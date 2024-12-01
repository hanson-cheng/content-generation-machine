-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type content_type as enum ('image', 'audio', 'text');
create type content_status as enum ('pending', 'processing', 'completed', 'failed');
create type subscription_tier as enum ('free', 'pro', 'enterprise');

-- Create users table (extends Supabase auth.users)
create table if not exists public.user_profiles (
    id uuid references auth.users primary key,
    subscription_tier subscription_tier default 'free',
    storage_used bigint default 0,
    api_usage jsonb default '{}'::jsonb,
    settings jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create content generation projects
create table if not exists public.projects (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.user_profiles(id) not null,
    name text not null,
    description text,
    settings jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create content items
create table if not exists public.content_items (
    id uuid default uuid_generate_v4() primary key,
    project_id uuid references public.projects(id) not null,
    user_id uuid references public.user_profiles(id) not null,
    type content_type not null,
    status content_status default 'pending',
    prompt text not null,
    settings jsonb default '{}'::jsonb,
    output_urls text[],
    metadata jsonb default '{}'::jsonb,
    error_message text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create API usage logs
create table if not exists public.api_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.user_profiles(id) not null,
    content_item_id uuid references public.content_items(id),
    model_name text not null,
    operation text not null,
    cost numeric(10,4) not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

-- Create RLS policies

-- User Profiles
alter table public.user_profiles enable row level security;

create policy "Users can view their own profile"
    on public.user_profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.user_profiles for update
    using (auth.uid() = id);

-- Projects
alter table public.projects enable row level security;

create policy "Users can view their own projects"
    on public.projects for select
    using (auth.uid() = user_id);

create policy "Users can create their own projects"
    on public.projects for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own projects"
    on public.projects for update
    using (auth.uid() = user_id);

create policy "Users can delete their own projects"
    on public.projects for delete
    using (auth.uid() = user_id);

-- Content Items
alter table public.content_items enable row level security;

create policy "Users can view their own content"
    on public.content_items for select
    using (auth.uid() = user_id);

create policy "Users can create their own content"
    on public.content_items for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own content"
    on public.content_items for update
    using (auth.uid() = user_id);

create policy "Users can delete their own content"
    on public.content_items for delete
    using (auth.uid() = user_id);

-- API Logs
alter table public.api_logs enable row level security;

create policy "Users can view their own API logs"
    on public.api_logs for select
    using (auth.uid() = user_id);

-- Create functions

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers

-- User Profiles updated_at
create trigger handle_updated_at
    before update on public.user_profiles
    for each row
    execute function public.handle_updated_at();

-- Projects updated_at
create trigger handle_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at();

-- Content Items updated_at
create trigger handle_updated_at
    before update on public.content_items
    for each row
    execute function public.handle_updated_at();

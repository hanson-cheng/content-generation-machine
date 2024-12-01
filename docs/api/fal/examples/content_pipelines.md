# Content Generation Pipeline Examples

This guide demonstrates how to combine different fal.ai models to create sophisticated content generation pipelines.

## 1. Marketing Content Generation

### Product Showcase Pipeline
Combines FLUX Subject for product shots with F5 TTS for voiceovers.

```python
import fal_client
import asyncio
from typing import List

async def generate_product_showcase(
    product_image_url: str,
    script: str,
    scenes: List[str]
) -> dict:
    """
    Creates a product showcase with multiple scenes and voiceover.
    
    Args:
        product_image_url: Reference image of the product
        script: Voiceover script
        scenes: List of scene descriptions
    """
    
    async def generate_scene(scene_desc: str) -> str:
        return await fal_client.subscribe(
            "fal-ai/flux-subject",
            arguments={
                "prompt": scene_desc,
                "image_url": product_image_url,
                "image_size": "landscape_16_9"
            }
        )

    # 1. Generate product scenes in parallel
    scene_tasks = [generate_scene(scene) for scene in scenes]
    scene_images = await asyncio.gather(*scene_tasks)
    
    # 2. Generate voiceover
    audio = await fal_client.subscribe(
        "fal-ai/f5-tts",
        arguments={
            "text": script,
            "speaker_id": "v2/en_speaker_6"
        }
    )
    
    return {
        "scenes": scene_images,
        "voiceover": audio
    }

# Usage Example
scenes = [
    "Product displayed in a modern living room with natural lighting",
    "Close-up of product features with professional studio lighting",
    "Product in use by a satisfied customer outdoors"
]

script = """
Introducing our revolutionary product, designed to transform your daily life.
With its sleek design and powerful features, it's the perfect addition to any home.
"""

result = await generate_product_showcase(
    product_image_url="https://example.com/product.jpg",
    script=script,
    scenes=scenes
)
```

## 2. Social Media Content Creation

### Brand Style Pipeline
Uses Recraft V3 to create a consistent brand style and applies it to multiple content pieces.

```python
import fal_client
from typing import List

async def create_brand_content(
    style_images_url: str,
    content_prompts: List[str]
) -> dict:
    """
    Creates branded content using a consistent style.
    
    Args:
        style_images_url: ZIP of brand style reference images
        content_prompts: List of content descriptions
    """
    
    # 1. Create brand style
    style = await fal_client.subscribe(
        "fal-ai/recraft-v3/create-style",
        arguments={
            "images_data_url": style_images_url,
            "base_style": "digital_illustration"
        }
    )
    
    # 2. Generate content with consistent style
    content = []
    for prompt in content_prompts:
        image = await fal_client.subscribe(
            "fal-ai/recraft-v3",
            arguments={
                "prompt": prompt,
                "style_id": style["style_id"],
                "image_size": "square"  # Instagram-friendly
            }
        )
        content.append(image)
    
    return {
        "style_id": style["style_id"],
        "content": content
    }

# Usage Example
prompts = [
    "Team collaboration in modern office setting",
    "Product demonstration with customer",
    "Behind-the-scenes creative process"
]

result = await create_brand_content(
    style_images_url="https://example.com/brand_style.zip",
    content_prompts=prompts
)
```

## 3. Educational Content Pipeline

### Interactive Learning Materials
Combines FLUX Pro for visuals with Stable Audio for background music.

```python
import fal_client
from typing import List, Dict

async def create_lesson_content(
    lesson_segments: List[Dict[str, str]]
) -> dict:
    """
    Creates multimedia educational content.
    
    Args:
        lesson_segments: List of segments with visual and audio descriptions
    """
    
    async def generate_segment(segment: dict) -> dict:
        # Generate illustration
        visual = await fal_client.subscribe(
            "fal-ai/flux-pro",
            arguments={
                "prompt": segment["visual_prompt"],
                "image_size": "landscape_16_9",
                "guidance_scale": 7.0  # Higher accuracy for educational content
            }
        )
        
        # Generate background music
        audio = await fal_client.subscribe(
            "fal-ai/stable-audio",
            arguments={
                "prompt": segment["audio_prompt"],
                "seconds_total": 30
            }
        )
        
        return {
            "visual": visual,
            "audio": audio,
            "segment_id": segment["id"]
        }
    
    # Generate all segments in parallel
    segment_tasks = [generate_segment(seg) for seg in lesson_segments]
    results = await asyncio.gather(*segment_tasks)
    
    return {
        "lesson_segments": results
    }

# Usage Example
segments = [
    {
        "id": "intro",
        "visual_prompt": "Visual representation of molecular structure",
        "audio_prompt": "Calm, focused study music with light percussion"
    },
    {
        "id": "main_concept",
        "visual_prompt": "Step-by-step chemical reaction process",
        "audio_prompt": "Uplifting background melody with subtle energy"
    }
]

result = await create_lesson_content(segments)
```

## 4. Personal Content Creation

### Custom Portrait Series
Combines FLUX LoRA Portrait training with style transfer.

```python
import fal_client
from typing import List

async def create_portrait_series(
    training_images_url: str,
    style_images_url: str,
    scenarios: List[str]
) -> dict:
    """
    Creates personalized portraits in various styles and scenarios.
    
    Args:
        training_images_url: ZIP of subject reference images
        style_images_url: ZIP of style reference images
        scenarios: List of scenario descriptions
    """
    
    # 1. Train personal model
    model = await fal_client.subscribe(
        "fal-ai/flux-lora-portrait-trainer",
        arguments={
            "images_url": training_images_url,
            "num_steps": 2000
        }
    )
    
    # 2. Create style
    style = await fal_client.subscribe(
        "fal-ai/recraft-v3/create-style",
        arguments={
            "images_data_url": style_images_url,
            "base_style": "digital_illustration"
        }
    )
    
    # 3. Generate portraits
    portraits = []
    for scenario in scenarios:
        # Generate base portrait
        portrait = await fal_client.subscribe(
            "fal-ai/flux-lora",
            arguments={
                "prompt": scenario,
                "lora_id": model["lora_id"]
            }
        )
        
        # Apply style
        styled_portrait = await fal_client.subscribe(
            "fal-ai/recraft-v3",
            arguments={
                "image_url": portrait["image"]["url"],
                "style_id": style["style_id"]
            }
        )
        
        portraits.append({
            "scenario": scenario,
            "original": portrait,
            "styled": styled_portrait
        })
    
    return {
        "model_id": model["lora_id"],
        "style_id": style["style_id"],
        "portraits": portraits
    }

# Usage Example
scenarios = [
    "Professional headshot in modern office",
    "Casual portrait in nature setting",
    "Creative portrait with artistic lighting"
]

result = await create_portrait_series(
    training_images_url="https://example.com/training_images.zip",
    style_images_url="https://example.com/style_images.zip",
    scenarios=scenarios
)
```

## Best Practices

### Error Handling
```python
async def safe_model_call(model_func, *args, **kwargs):
    """Wrapper for safe model execution with retries"""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            return await model_func(*args, **kwargs)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            await asyncio.sleep(2 ** attempt)  # Exponential backoff
```

### Rate Limiting
```python
from asyncio import Semaphore

class RateLimiter:
    def __init__(self, max_concurrent=5):
        self.semaphore = Semaphore(max_concurrent)
    
    async def __aenter__(self):
        await self.semaphore.acquire()
    
    async def __aexit__(self, exc_type, exc, tb):
        self.semaphore.release()

# Usage
rate_limiter = RateLimiter()
async with rate_limiter:
    result = await fal_client.subscribe(...)
```

### Cost Optimization
```python
def estimate_cost(pipeline_config: dict) -> float:
    """Estimate pipeline cost before execution"""
    cost_map = {
        "flux_pro": 0.02,  # Base cost per image
        "f5_tts": 0.03,    # Per minute
        "stable_audio": 0.05,  # Per 30 seconds
        "recraft_style": 0.10  # Style creation
    }
    
    total_cost = 0
    # Add cost calculation logic
    return total_cost
```

## Pipeline Optimization Tips

1. **Parallel Processing**
   - Use `asyncio.gather()` for independent tasks
   - Implement proper error handling for each task
   - Monitor memory usage with large batches

2. **Resource Management**
   - Implement rate limiting
   - Use connection pooling
   - Clean up temporary files

3. **Quality Control**
   - Validate inputs before processing
   - Implement quality checks
   - Store generation parameters for reproducibility

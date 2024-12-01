"""
Pytest configuration and fixtures for the Content Generation Machine API tests.
"""
import pytest
import asyncio
from typing import AsyncGenerator, Generator
from fastapi.testclient import TestClient
from httpx import AsyncClient
import os
import json
from unittest.mock import AsyncMock, patch

# Mock FAL API responses
MOCK_RESPONSES = {
    "flux_pro": {
        "images": [{
            "url": "https://example.com/test.jpg",
            "content_type": "image/jpeg"
        }]
    },
    "f5_tts": {
        "audio_file": {
            "url": "https://example.com/test.mp3",
            "content_type": "audio/mpeg"
        }
    },
    "stable_audio": {
        "audio_file": {
            "url": "https://example.com/test.wav",
            "content_type": "audio/wav"
        }
    }
}

@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def mock_fal_client():
    """Mock fal.ai client responses"""
    async def mock_subscribe(*args, **kwargs):
        model_name = args[0].split('/')[-1]
        return MOCK_RESPONSES.get(model_name, {})
    
    with patch('fal_client.subscribe', new=AsyncMock(side_effect=mock_subscribe)):
        yield

@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Create async test client"""
    from app.main import app  # Import your FastAPI app
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.fixture
def test_client() -> Generator[TestClient, None, None]:
    """Create sync test client"""
    from app.main import app
    
    with TestClient(app=app) as client:
        yield client

@pytest.fixture
def mock_env_vars():
    """Set up test environment variables"""
    os.environ["FAL_KEY"] = "test_key"
    os.environ["SUPABASE_URL"] = "https://test.supabase.co"
    os.environ["SUPABASE_KEY"] = "test_key"
    yield
    del os.environ["FAL_KEY"]
    del os.environ["SUPABASE_URL"]
    del os.environ["SUPABASE_KEY"]

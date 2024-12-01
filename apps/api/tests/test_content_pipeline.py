"""
Tests for the content generation pipeline.
"""
import pytest
from app.services.content import ContentPipeline
from app.models.content import ContentRequest, ContentResponse

@pytest.mark.asyncio
async def test_content_pipeline_text_to_image(mock_fal_client, mock_env_vars):
    """Test basic text to image generation"""
    pipeline = ContentPipeline()
    request = ContentRequest(
        content_type="image",
        prompt="A test image",
        settings={
            "model": "flux_pro",
            "image_size": "512x512"
        }
    )
    
    response = await pipeline.process_content(request)
    assert response.status == "success"
    assert response.outputs[0].url.startswith("https://")
    assert response.outputs[0].type == "image"

@pytest.mark.asyncio
async def test_content_pipeline_text_to_speech(mock_fal_client, mock_env_vars):
    """Test text to speech generation"""
    pipeline = ContentPipeline()
    request = ContentRequest(
        content_type="audio",
        prompt="Test speech content",
        settings={
            "model": "f5_tts",
            "voice_id": "test_voice"
        }
    )
    
    response = await pipeline.process_content(request)
    assert response.status == "success"
    assert response.outputs[0].url.startswith("https://")
    assert response.outputs[0].type == "audio"

@pytest.mark.asyncio
async def test_content_pipeline_style_transfer(mock_fal_client, mock_env_vars):
    """Test style transfer pipeline"""
    pipeline = ContentPipeline()
    request = ContentRequest(
        content_type="image",
        prompt="Test style transfer",
        settings={
            "model": "recraft_v3",
            "style_id": "test_style",
            "image_size": "512x512"
        }
    )
    
    response = await pipeline.process_content(request)
    assert response.status == "success"
    assert response.outputs[0].url.startswith("https://")
    assert response.outputs[0].type == "image"

@pytest.mark.asyncio
async def test_content_pipeline_error_handling(mock_fal_client, mock_env_vars):
    """Test error handling in pipeline"""
    pipeline = ContentPipeline()
    request = ContentRequest(
        content_type="invalid",
        prompt="Test error handling",
        settings={}
    )
    
    with pytest.raises(ValueError):
        await pipeline.process_content(request)

@pytest.mark.asyncio
async def test_content_pipeline_batch_processing(mock_fal_client, mock_env_vars):
    """Test batch content processing"""
    pipeline = ContentPipeline()
    requests = [
        ContentRequest(
            content_type="image",
            prompt=f"Test image {i}",
            settings={"model": "flux_pro"}
        )
        for i in range(3)
    ]
    
    responses = await pipeline.process_batch(requests)
    assert len(responses) == 3
    assert all(r.status == "success" for r in responses)

@pytest.mark.asyncio
async def test_content_pipeline_with_custom_settings(mock_fal_client, mock_env_vars):
    """Test pipeline with custom processing settings"""
    pipeline = ContentPipeline()
    request = ContentRequest(
        content_type="image",
        prompt="Test with custom settings",
        settings={
            "model": "flux_pro",
            "image_size": "1024x1024",
            "guidance_scale": 7.5,
            "num_inference_steps": 50
        }
    )
    
    response = await pipeline.process_content(request)
    assert response.status == "success"
    assert response.settings["image_size"] == "1024x1024"

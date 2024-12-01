# Image Generation Examples

## Basic Image Generation
```python
from app.services.fal import generate_image

# Simple image generation
result = await generate_image(
    prompt="A serene landscape with mountains and a lake at sunset",
    size=(1024, 1024)
)

# Save the generated image
image_path = await save_generated_image(result.image)
```

## Advanced Usage
### Style Control
```python
# Using style parameters
result = await generate_image(
    prompt="A serene landscape",
    negative_prompt="blurry, low quality",
    style_preset="photographic",
    guidance_scale=7.5
)
```

### Batch Generation
```python
# Generate multiple variations
results = await generate_image_batch(
    prompt="Product photo of a modern coffee mug",
    num_images=4,
    size=(512, 512)
)
```

## Error Handling
```python
try:
    result = await generate_image(prompt="...")
except FalApiError as e:
    logger.error(f"Image generation failed: {e}")
    # Handle error appropriately
```

## Best Practices
1. Always include error handling
2. Use appropriate image sizes for your use case
3. Consider rate limits and costs
4. Cache results when possible

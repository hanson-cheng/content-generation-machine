# FLUX 1.1 Pro Model

## Overview
FLUX 1.1 Pro is a next-generation text-to-image model offering 10x accelerated speeds compared to standard models. This commercial-grade model provides enhanced image quality and advanced safety controls.

⚠️ **Note**: Usage must comply with FLUX.1 PRO Terms of Service.

## Quick Start
```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/flux-pro/v1.1",
    arguments={
        "prompt": "A professional studio portrait with dramatic lighting",
        "image_size": "portrait_4_3",
        "safety_tolerance": "2"
    }
)
```

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | - | Text description of desired image |
| `image_size` | enum/object | No | "landscape_4_3" | Output image dimensions |
| `seed` | integer | No | random | Random seed for reproducibility |
| `num_images` | integer | No | 1 | Number of images to generate |
| `enable_safety_checker` | boolean | No | true | Enable content filtering |
| `safety_tolerance` | enum | No | "2" | Safety level (1-6, 1 strictest) |
| `output_format` | enum | No | "jpeg" | Output format (jpeg/png) |
| `sync_mode` | boolean | No | false | Wait for generation completion |
| `raw` | boolean | No | false | Generate less processed images |
| `image_url` | string | No | - | Reference image URL |
| `image_prompt_strength` | float | No | 0.1 | Image reference strength (0-1) |

### Image Sizes
- **Preset Sizes**:
  - `square_hd`: High-definition square
  - `square`: Standard square
  - `portrait_4_3`: Portrait 4:3 ratio
  - `portrait_16_9`: Portrait 16:9 ratio
  - `landscape_4_3`: Landscape 4:3 ratio
  - `landscape_16_9`: Landscape 16:9 ratio

- **Custom Size**:
  ```json
  "image_size": {
    "width": 1280,
    "height": 720
  }
  ```

### Aspect Ratios
- `21:9`: Ultra-wide
- `16:9`: Widescreen
- `4:3`: Standard
- `1:1`: Square
- `3:4`: Portrait
- `9:16`: Mobile
- `9:21`: Ultra-tall

## Response Format
```json
{
  "images": [
    {
      "url": "https://fal.media/files/example.jpg",
      "content_type": "image/jpeg",
      "width": 1024,
      "height": 768
    }
  ],
  "seed": 12345,
  "has_nsfw_concepts": [false],
  "prompt": "original prompt here"
}
```

## Authentication
Set your FAL_KEY as an environment variable:
```bash
export FAL_KEY="YOUR_API_KEY"
```

⚠️ **Security Note**: Never expose your FAL_KEY in client-side code. Use a server-side proxy for production.

## Advanced Usage

### Image-to-Image Generation
```python
result = fal_client.subscribe(
    "fal-ai/flux-pro/v1.1",
    arguments={
        "prompt": "Transform into an oil painting",
        "image_url": "https://example.com/reference.jpg",
        "image_prompt_strength": 0.75
    }
)
```

### Raw Mode Generation
```python
result = fal_client.subscribe(
    "fal-ai/flux-pro/v1.1",
    arguments={
        "prompt": "Natural landscape scene",
        "raw": True,
        "safety_tolerance": "3"
    }
)
```

### Progress Tracking
```python
def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"Progress: {log['message']}")

result = fal_client.subscribe(
    "fal-ai/flux-pro/v1.1",
    arguments={"prompt": "your prompt"},
    with_logs=True,
    on_queue_update=on_queue_update
)
```

## Best Practices

### Prompt Engineering
1. **Be Specific**:
   - Describe desired style
   - Mention lighting conditions
   - Include composition details
   - Specify important elements

2. **Example Prompts**:
   - "Professional studio portrait with dramatic rim lighting and dark background"
   - "Aerial view of a modern city at sunset with golden hour lighting"
   - "Close-up macro photography of a dewdrop on a leaf, natural lighting"

### Safety Settings
1. **Safety Tolerance Levels**:
   - Level 1: Strictest filtering
   - Level 2: Standard filtering (default)
   - Level 3-6: Progressively more permissive

2. **Content Guidelines**:
   - Follow platform's content policies
   - Consider target audience
   - Use appropriate safety levels

### Performance Optimization
1. Use sync_mode strategically
2. Implement proper error handling
3. Cache results when possible
4. Consider batch processing

## Limitations
- Maximum resolution restrictions
- API rate limits
- Safety filter constraints
- Processing time variations
- Commercial usage terms

## Troubleshooting
1. **Image Quality Issues**:
   - Check prompt specificity
   - Adjust image size
   - Try different safety levels
   - Consider raw mode

2. **Performance Issues**:
   - Optimize image sizes
   - Use async implementation
   - Check rate limits
   - Monitor resource usage

3. **Safety Filter Issues**:
   - Review content guidelines
   - Adjust safety tolerance
   - Modify prompt wording
   - Check for restricted content

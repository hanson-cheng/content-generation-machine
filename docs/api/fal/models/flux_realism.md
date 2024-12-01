# FLUX Realism Model

## Overview
FLUX Realism is a specialized text-to-image model optimized for generating highly realistic images with exceptional detail and accuracy. It excels at creating photorealistic portraits, scenes, and detailed compositions with natural lighting and textures.

## Quick Start
```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/flux-realism",
    arguments={
        "prompt": "Professional headshot of a business executive in a modern office setting",
        "image_size": "portrait_4_3",
        "strength": 1.0
    }
)
```

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | - | Text description of desired image |
| `image_size` | enum/object | No | "landscape_4_3" | Output image dimensions |
| `num_inference_steps` | integer | No | 28 | Number of denoising steps |
| `seed` | integer | No | random | Random seed for reproducibility |
| `guidance_scale` | float | No | 3.5 | Prompt adherence strength |
| `strength` | float | No | 1.0 | Model influence strength |
| `num_images` | integer | No | 1 | Number of images to generate |
| `enable_safety_checker` | boolean | No | true | Enable content filtering |
| `output_format` | enum | No | "jpeg" | Output format (jpeg/png) |
| `sync_mode` | boolean | No | false | Wait for generation completion |

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

### Detailed Scene Generation
```python
result = fal_client.subscribe(
    "fal-ai/flux-realism",
    arguments={
        "prompt": """Professional photographer in a studio setting. 
                    She has short black hair, wearing a casual black t-shirt. 
                    Standing next to professional lighting equipment. 
                    Natural pose, holding a DSLR camera. 
                    Studio background with soft bokeh effect.""",
        "guidance_scale": 4.0,
        "num_inference_steps": 30
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
    "fal-ai/flux-realism",
    arguments={"prompt": "your prompt"},
    with_logs=True,
    on_queue_update=on_queue_update
)
```

## Best Practices

### Prompt Engineering
1. **Be Highly Descriptive**:
   - Include physical details
   - Specify lighting conditions
   - Describe environment
   - Mention materials and textures

2. **Example Prompts**:
   ```python
   prompts = [
       """Close-up portrait of a senior architect at work.
          Gray hair, wire-rimmed glasses, focused expression.
          Wearing a charcoal blazer. Natural office lighting.
          Architectural plans visible in the background.""",
       
       """Modern kitchen interior with a chef at work.
          Stainless steel appliances, marble countertops.
          Chef wearing white uniform with black buttons.
          Morning light streaming through large windows."""
   ]
   ```

3. **Structure Your Prompts**:
   - Start with subject description
   - Add environmental details
   - Specify lighting and atmosphere
   - Include important small details

### Optimization Tips
1. **Image Quality**:
   - Use higher inference steps (28-40) for better detail
   - Adjust guidance scale for prompt adherence
   - Consider larger image sizes for more detail

2. **Performance**:
   - Use async implementation for batch processing
   - Cache results when possible
   - Implement proper error handling

## Limitations
- Maximum resolution restrictions
- Processing time increases with detail
- Complex scenes may need refinement
- Memory usage with high inference steps
- Rate limiting considerations

## Troubleshooting
1. **Image Quality Issues**:
   - Increase inference steps
   - Adjust guidance scale
   - Make prompts more specific
   - Check image size settings

2. **Generation Problems**:
   - Verify prompt clarity
   - Check for conflicting descriptions
   - Ensure realistic expectations
   - Review parameter settings

3. **Performance Issues**:
   - Optimize image sizes
   - Use async for batch processing
   - Monitor resource usage
   - Check API limits

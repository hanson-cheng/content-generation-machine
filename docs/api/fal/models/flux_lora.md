# Flux LoRA Model

## Overview
FLUX.1 [dev] with LoRAs is a next-generation text-to-image model that supports custom LoRA models for specialized image generation. It allows multiple LoRA weights to be combined, offering highly customizable image generation capabilities.

## Quick Start
```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/flux-lora",
    arguments={
        "prompt": "A professional portrait in anime style",
        "loras": [
            {
                "path": "path/to/your/lora.safetensors",
                "scale": 0.75
            }
        ],
        "image_size": "portrait_4_3"
    }
)
```

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | - | Text description of desired image |
| `loras` | array | No | [] | List of LoRA weights to use |
| `image_size` | enum/object | No | "landscape_4_3" | Output image dimensions |
| `num_inference_steps` | integer | No | 28 | Number of denoising steps |
| `seed` | integer | No | random | Random seed for reproducibility |
| `guidance_scale` | float | No | 3.5 | CFG scale for prompt adherence |
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

### LoRA Configuration
```python
loras = [
    {
        "path": "url_or_path_to_lora1",
        "scale": 0.8  # Strength of the LoRA effect
    },
    {
        "path": "url_or_path_to_lora2",
        "scale": 0.5
    }
]
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

### Multiple LoRA Combination
```python
result = fal_client.subscribe(
    "fal-ai/flux-lora",
    arguments={
        "prompt": "A cyberpunk character with anime styling",
        "loras": [
            {"path": "cyberpunk_style.safetensors", "scale": 0.7},
            {"path": "anime_style.safetensors", "scale": 0.5}
        ],
        "guidance_scale": 7.0,
        "num_inference_steps": 30
    }
)
```

### Async Implementation
```python
handler = fal_client.submit(
    "fal-ai/flux-lora",
    arguments={
        "prompt": "your prompt",
        "loras": [{"path": "lora_path", "scale": 1.0}]
    },
    webhook_url="https://your.webhook.url"
)
```

### Progress Tracking
```python
def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"Progress: {log['message']}")

result = fal_client.subscribe(
    "fal-ai/flux-lora",
    arguments={"prompt": "your prompt"},
    with_logs=True,
    on_queue_update=on_queue_update
)
```

## Best Practices

### LoRA Usage
1. **Scale Adjustment**:
   - Start with scales between 0.5 and 1.0
   - Lower scales for subtle effects
   - Test different combinations

2. **Multiple LoRAs**:
   - Consider LoRA compatibility
   - Balance scale values
   - Order can affect results

### Prompt Engineering
1. **Style Guidance**:
   - Reference LoRA's training style
   - Be specific about desired elements
   - Include technical details

2. **Example Prompts**:
   - "Professional portrait, detailed lighting, [style] aesthetic"
   - "Character concept art in [style] style, full body"
   - "Detailed landscape with [style] elements"

### Performance Optimization
1. Use appropriate inference steps
2. Consider sync_mode for different use cases
3. Cache results when possible
4. Implement proper error handling

## Limitations
- Maximum image resolution limits
- LoRA compatibility considerations
- Processing time varies with settings
- Memory usage with multiple LoRAs
- Rate limiting considerations

## Troubleshooting
1. **Poor Results**:
   - Adjust LoRA scales
   - Increase inference steps
   - Refine prompt
   - Check LoRA compatibility

2. **Performance Issues**:
   - Optimize image size
   - Reduce number of LoRAs
   - Use async implementation
   - Check resource usage

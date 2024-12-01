# FLUX Subject Model

## Overview
FLUX Subject is a specialized image generation model that excels at creating images incorporating specific subjects from reference images. It's particularly useful for creating variations of products, people, or objects in different contexts while maintaining their key characteristics.

## Quick Start
```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/flux-subject",
    arguments={
        "prompt": "A person wearing the t-shirt in a modern coffee shop, sitting by a window",
        "image_url": "https://example.com/path/to/tshirt.jpg",
        "image_size": "portrait_4_3"
    }
)
```

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | - | Description of desired scene with subject |
| `image_url` | string | Yes | - | URL of the reference subject image |
| `image_size` | enum/object | No | "square" | Output image dimensions |
| `num_inference_steps` | integer | No | 8 | Number of denoising steps |
| `seed` | integer | No | random | Random seed for reproducibility |
| `guidance_scale` | float | No | 3.5 | Prompt adherence strength |
| `num_images` | integer | No | 1 | Number of images to generate |
| `enable_safety_checker` | boolean | No | true | Enable content filtering |
| `output_format` | enum | No | "png" | Output format (jpeg/png) |
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

## File Handling

### URL Input
```python
result = fal_client.subscribe(
    "fal-ai/flux-subject",
    arguments={
        "prompt": "Product placement in a luxury store display",
        "image_url": "https://public-url.com/product.jpg"
    }
)
```

### Local File Upload
```python
# Upload local file first
url = fal_client.upload_file("local/path/to/image.jpg")

# Use uploaded URL in generation
result = fal_client.subscribe(
    "fal-ai/flux-subject",
    arguments={
        "prompt": "Product in use outdoors",
        "image_url": url
    }
)
```

### Base64 Support
```python
import base64

with open("image.jpg", "rb") as image_file:
    encoded = base64.b64encode(image_file.read()).decode()
    data_uri = f"data:image/jpeg;base64,{encoded}"

result = fal_client.subscribe(
    "fal-ai/flux-subject",
    arguments={
        "prompt": "Subject in natural lighting",
        "image_url": data_uri
    }
)
```

## Best Practices

### Prompt Engineering
1. **Reference the Subject**:
   ```python
   prompts = [
       "The t-shirt displayed on a mannequin in a high-end boutique window",
       "A model wearing this shirt during a fashion shoot in an urban setting"
   ]
   ```

2. **Context Guidelines**:
   - Describe desired environment
   - Specify lighting conditions
   - Include action or pose
   - Mention surrounding elements

### Subject Image Tips
1. **Image Quality**:
   - Use clear, well-lit images
   - Ensure subject is prominent
   - Avoid busy backgrounds
   - Maintain good resolution

2. **Subject Types**:
   - Products (clothing, accessories)
   - Objects (furniture, artwork)
   - Branded items
   - Design elements

## Advanced Usage

### Progress Tracking
```python
def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"Progress: {log['message']}")

result = fal_client.subscribe(
    "fal-ai/flux-subject",
    arguments={
        "prompt": "your prompt",
        "image_url": "your_image_url"
    },
    with_logs=True,
    on_queue_update=on_queue_update
)
```

### Async Implementation
```python
async def generate_variations():
    handler = await fal_client.submit(
        "fal-ai/flux-subject",
        arguments={
            "prompt": "Subject in different settings",
            "image_url": "subject_image_url",
            "num_images": 3
        }
    )
    return await handler.wait()
```

## Limitations
- Subject recognition accuracy
- Complex scene composition
- Background detail control
- Style transfer limitations
- File size restrictions

## Troubleshooting

### Common Issues
1. **Poor Subject Integration**:
   - Use clearer reference images
   - Make prompts more specific
   - Adjust guidance scale
   - Increase inference steps

2. **Image Quality Problems**:
   - Check input image resolution
   - Verify file format
   - Ensure proper lighting
   - Review size settings

3. **Generation Failures**:
   - Validate image URL accessibility
   - Check file size limits
   - Verify API key status
   - Monitor rate limits

### Security Notes
- Never expose API keys in client code
- Use server-side proxies
- Validate input URLs
- Implement proper error handling

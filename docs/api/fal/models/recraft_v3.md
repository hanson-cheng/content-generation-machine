# Recraft V3 Model

## Overview
Recraft V3 is a state-of-the-art image generation model by recraft.ai, available through fal.ai. It supports multiple styles and resolutions, with specialized capabilities for different artistic approaches from realistic images to vector illustrations.

## Quick Start
```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/recraft-v3",
    arguments={
        "prompt": "a serene mountain landscape at sunset",
        "image_size": "landscape_16_9",
        "style": "realistic_image"
    }
)
```

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | - | Text description of the desired image |
| `image_size` | enum/object | No | "square_hd" | Image dimensions (see sizes below) |
| `style` | enum | No | "realistic_image" | Visual style of the generated image |
| `colors` | array | No | [] | Preferred RGB colors for generation |
| `style_id` | string | No | null | Custom style reference ID |

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

### Available Styles
1. **Realistic Images**:
   - `realistic_image` (default)
   - `realistic_image/b_and_w`
   - `realistic_image/hard_flash`
   - `realistic_image/hdr`
   - `realistic_image/natural_light`
   - `realistic_image/studio_portrait`
   - `realistic_image/enterprise`
   - `realistic_image/motion_blur`

2. **Digital Illustrations**:
   - `digital_illustration`
   - `digital_illustration/pixel_art`
   - `digital_illustration/hand_drawn`
   - `digital_illustration/grain`
   - `digital_illustration/infantile_sketch`
   - `digital_illustration/2d_art_poster`
   - `digital_illustration/handmade_3d`
   - `digital_illustration/hand_drawn_outline`
   - `digital_illustration/engraving_color`
   - `digital_illustration/2d_art_poster_2`

3. **Vector Illustrations** (2X cost):
   - `vector_illustration`
   - `vector_illustration/engraving`
   - `vector_illustration/line_art`
   - `vector_illustration/line_circuit`
   - `vector_illustration/linocut`

## Response Format
```json
{
  "images": [
    {
      "url": "https://fal.media/files/example_image.webp",
      "content_type": "image/webp",
      "file_name": "example_image.webp",
      "file_size": 1024000
    }
  ]
}
```

## Authentication
Set your FAL_KEY as an environment variable:
```bash
export FAL_KEY="YOUR_API_KEY"
```

⚠️ **Security Note**: Never expose your FAL_KEY in client-side code. Use a server-side proxy for production.

## Advanced Usage

### Color Specification
```python
result = fal_client.subscribe(
    "fal-ai/recraft-v3",
    arguments={
        "prompt": "a sunset landscape",
        "colors": [
            {"r": 255, "g": 140, "b": 0},  # Orange
            {"r": 70, "g": 130, "b": 180}   # Steel Blue
        ]
    }
)
```

### Async Implementation
```python
handler = fal_client.submit(
    "fal-ai/recraft-v3",
    arguments={
        "prompt": "your prompt here",
        "style": "digital_illustration/pixel_art"
    },
    webhook_url="https://your.webhook.url"
)
```

## Best Practices
1. **Prompt Engineering**:
   - Be specific and descriptive
   - Include desired atmosphere and details
   - Mention specific artistic elements

2. **Style Selection**:
   - Match style to intended use
   - Consider cost (vector styles cost 2X)
   - Test different styles for best results

3. **Performance**:
   - Use appropriate image sizes
   - Consider async for batch processing
   - Cache results when possible

## Limitations
- Maximum image size restrictions
- Processing time varies by style
- Vector styles cost twice as much
- Rate limiting considerations
- Some style combinations may not be available

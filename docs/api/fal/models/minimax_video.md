# MiniMax Video (Image to Video)

## Overview
MiniMax Video is an advanced AI model that transforms still images into dynamic videos. It can generate natural-looking motion and animations while maintaining consistency with the input image and following the provided prompt.

## Quick Start
```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/minimax-video/image-to-video",
    arguments={
        "prompt": "A butterfly gently fluttering its wings in a garden",
        "image_url": "path/to/butterfly.jpg",
        "prompt_optimizer": True
    }
)
```

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | - | Description of desired motion/animation |
| `image_url` | string | Yes | - | URL of the source image |
| `prompt_optimizer` | boolean | No | true | Enable prompt optimization |

## Input Requirements
### Image Guidelines
- **Format**: Common image formats (JPEG, PNG)
- **Resolution**: Recommended 512x512 or 1024x1024
- **Content**: Clear, well-lit images work best
- **Subject**: Main subject should be clearly visible

### Prompt Guidelines
- Be specific about desired motion
- Include details about:
  - Movement direction
  - Speed and style of motion
  - Environmental effects
  - Camera movement (if any)

## Response Format
```json
{
  "video": {
    "url": "https://fal.media/files/output.mp4",
    "content_type": "video/mp4",
    "file_name": "generated_video.mp4",
    "file_size": 2048000
  }
}
```

## Authentication
Set your FAL_KEY as an environment variable:
```bash
export FAL_KEY="YOUR_API_KEY"
```

⚠️ **Security Note**: Never expose your FAL_KEY in client-side code. Use a server-side proxy for production.

## Advanced Usage

### With Progress Tracking
```python
import fal_client

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"Progress: {log['message']}")

result = fal_client.subscribe(
    "fal-ai/minimax-video/image-to-video",
    arguments={
        "prompt": "Camera slowly zooms in on a blooming flower",
        "image_url": "path/to/flower.jpg"
    },
    with_logs=True,
    on_queue_update=on_queue_update
)
```

### Async Implementation
```python
handler = fal_client.submit(
    "fal-ai/minimax-video/image-to-video",
    arguments={
        "prompt": "your prompt here",
        "image_url": "your_image_url"
    },
    webhook_url="https://your.webhook.url"
)

# Check status later
status = fal_client.status("fal-ai/minimax-video/image-to-video", 
                          handler.request_id, 
                          with_logs=True)
```

### File Upload
```python
# Upload local image
image_url = fal_client.upload_file("local_image.jpg")

# Use uploaded image URL
result = fal_client.subscribe(
    "fal-ai/minimax-video/image-to-video",
    arguments={
        "prompt": "your prompt",
        "image_url": image_url
    }
)
```

## Best Practices

### Prompt Engineering
1. **Be Specific**:
   - Describe motion direction and speed
   - Mention any camera movements
   - Include atmospheric details

2. **Example Prompts**:
   - "Camera slowly pans right across a sunset landscape"
   - "Gentle breeze moving through leaves, subtle motion"
   - "Zoom out gradually revealing more of the cityscape"

### Image Selection
1. **Composition**:
   - Clear subject positioning
   - Good lighting and contrast
   - Minimal motion blur

2. **Technical Aspects**:
   - Appropriate resolution
   - Good image quality
   - Proper aspect ratio

### Performance Optimization
1. Use async implementation for production
2. Implement proper error handling
3. Consider webhook integration for long processes
4. Cache results when possible

## Limitations
- Maximum video duration restrictions
- Processing time varies with complexity
- Some motions may be challenging to generate
- Specific file size limits
- Rate limiting considerations

## Common Issues
1. **Poor Video Quality**:
   - Check input image resolution
   - Ensure clear prompt description
   - Verify image meets guidelines

2. **Unexpected Motion**:
   - Make prompt more specific
   - Check if motion is feasible
   - Consider simpler movements

3. **Processing Failures**:
   - Verify image format
   - Check file size limits
   - Ensure stable internet connection

# Flux LoRA Portrait Trainer

## Overview
The Flux LoRA Portrait Trainer is a specialized model for fine-tuning Stable Diffusion models on portrait images. It creates a custom LoRA model that can generate images in the style of your training data.

## Quick Start
```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/flux-lora-portrait-trainer",
    arguments={
        "images_data_url": "path/to/your/images.zip",
        "trigger_phrase": "photo of person123",
        "steps": 2500
    }
)
```

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `images_data_url` | string | Yes | - | URL to zip archive with training images |
| `trigger_phrase` | string | No | None | Custom trigger word for generation |
| `learning_rate` | float | No | 0.00009 | Learning rate for training |
| `steps` | integer | No | 2500 | Number of training steps |
| `multiresolution_training` | boolean | No | true | Enable multi-resolution training |
| `subject_crop` | boolean | No | true | Auto-crop subjects in images |
| `data_archive_format` | string | No | - | Archive format (auto-detected if not specified) |
| `resume_from_checkpoint` | string | No | "" | URL to resume training from checkpoint |

## Training Data Requirements
1. **Image Count**: Minimum 10 images recommended
2. **Archive Format**: ZIP file containing:
   - Images (.jpg, .png)
   - Optional caption files (same name as image files)
3. **Captions Format**:
   - Use `[trigger]` placeholder for trigger word replacement
   - Example: "a photo of [trigger] in a garden"

## Response Format
```json
{
  "diffusers_lora_file": {
    "url": "https://example.com/lora_weights.safetensors",
    "content_type": "application/octet-stream",
    "file_name": "lora_weights.safetensors",
    "file_size": 4404019
  },
  "config_file": {
    "url": "https://example.com/config.json",
    "content_type": "application/json",
    "file_name": "config.json",
    "file_size": 1024
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

### Async Implementation
```python
import fal_client

handler = fal_client.submit(
    "fal-ai/flux-lora-portrait-trainer",
    arguments={
        "images_data_url": "path/to/your/images.zip",
        "trigger_phrase": "person123"
    },
    webhook_url="https://your.webhook.url"
)

# Check training status
status = fal_client.status("fal-ai/flux-lora-portrait-trainer", handler.request_id, with_logs=True)
```

### File Handling Options
1. **Direct Upload**:
   ```python
   url = fal_client.upload_file("path/to/images.zip")
   ```
2. **Base64 Data URI**: For smaller datasets
3. **Hosted URL**: Use any publicly accessible URL

## Best Practices
1. **Image Quality**:
   - Use high-quality, consistent images
   - Ensure similar style/composition
   - Remove background distractions

2. **Training Parameters**:
   - Start with default learning rate
   - Increase steps for better results
   - Enable subject crop for portraits

3. **Performance**:
   - Use async implementation for long training jobs
   - Monitor training progress with logs
   - Save checkpoints for long training sessions

## Limitations
- Maximum archive size restrictions
- Training time increases with dataset size
- GPU memory constraints
- Rate limiting on API calls

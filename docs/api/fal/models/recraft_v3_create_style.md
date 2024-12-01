# Recraft V3 Create Style

## Overview
The Create Style endpoint of Recraft V3 allows you to create custom styles from reference images. These styles can then be used for consistent image generation across multiple prompts. The system supports various base styles and can analyze up to 5 reference images to create a unique style identifier.

## Quick Start
```python
import fal_client

# Upload a ZIP file containing reference images
style_images_url = fal_client.upload_file("path/to/style_images.zip")

result = fal_client.subscribe(
    "fal-ai/recraft-v3/create-style",
    arguments={
        "images_data_url": style_images_url,
        "base_style": "digital_illustration"
    }
)
```

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `images_data_url` | string | Yes | - | URL to ZIP archive of reference images (PNG format) |
| `base_style` | enum | No | "digital_illustration" | Base style category for generation |

## Base Styles

### Realistic Image Styles
- `realistic_image`: General realistic photography
- `realistic_image/b_and_w`: Black and white photography
- `realistic_image/hard_flash`: Hard flash photography
- `realistic_image/hdr`: High Dynamic Range
- `realistic_image/natural_light`: Natural lighting
- `realistic_image/studio_portrait`: Studio portrait photography
- `realistic_image/enterprise`: Corporate/professional
- `realistic_image/motion_blur`: Motion blur effect

### Digital Illustration Styles
- `digital_illustration`: General digital art
- `digital_illustration/pixel_art`: Pixel art style
- `digital_illustration/hand_drawn`: Hand-drawn digital
- `digital_illustration/grain`: Grainy texture effect
- `digital_illustration/infantile_sketch`: Child-like sketches
- `digital_illustration/2d_art_poster`: 2D poster art
- `digital_illustration/handmade_3d`: 3D-like illustration
- `digital_illustration/hand_drawn_outline`: Outlined drawings
- `digital_illustration/engraving_color`: Color engraving
- `digital_illustration/2d_art_poster_2`: Alternative poster style

### Vector Illustration Styles
- `vector_illustration/engraving`: Vector engraving
- `vector_illustration/line_art`: Line art style
- `vector_illustration/line_circuit`: Circuit-like lines
- `vector_illustration/linocut`: Linocut print style

## File Preparation

### Image Requirements
1. **Format**:
   - PNG format required
   - Maximum 5 images allowed
   - Consistent style across images
   - Clear, high-quality images

2. **ZIP Archive**:
   ```python
   import zipfile
   import os

   def create_style_zip(image_paths, output_zip):
       with zipfile.ZipFile(output_zip, 'w') as zf:
           for path in image_paths[:5]:  # Limit to 5 images
               if path.lower().endswith('.png'):
                   zf.write(path, os.path.basename(path))
   ```

### File Upload Options

1. **Direct Upload**:
   ```python
   # Upload ZIP file
   url = fal_client.upload_file("style_images.zip")
   
   # Create style
   result = fal_client.subscribe(
       "fal-ai/recraft-v3/create-style",
       arguments={
           "images_data_url": url,
           "base_style": "digital_illustration"
       }
   )
   ```

2. **URL Reference**:
   ```python
   result = fal_client.subscribe(
       "fal-ai/recraft-v3/create-style",
       arguments={
           "images_data_url": "https://public-url.com/style_images.zip",
           "base_style": "vector_illustration/line_art"
       }
   )
   ```

## Advanced Usage

### Progress Tracking
```python
def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"Progress: {log['message']}")

result = fal_client.subscribe(
    "fal-ai/recraft-v3/create-style",
    arguments={
        "images_data_url": style_images_url,
        "base_style": "realistic_image/studio_portrait"
    },
    with_logs=True,
    on_queue_update=on_queue_update
)
```

### Async Implementation
```python
async def create_custom_style():
    handler = await fal_client.submit(
        "fal-ai/recraft-v3/create-style",
        arguments={
            "images_data_url": style_images_url,
            "base_style": "digital_illustration/pixel_art"
        }
    )
    return await handler.wait()
```

## Best Practices

### Style Creation Tips
1. **Image Selection**:
   - Choose images with consistent style
   - Use high-quality source material
   - Avoid mixed artistic styles
   - Consider lighting and composition

2. **Base Style Selection**:
   - Match reference images to base style
   - Consider target use case
   - Test different base styles
   - Use specific sub-styles when possible

3. **Performance Optimization**:
   - Optimize image sizes
   - Limit to necessary images
   - Use efficient file formats
   - Consider compression ratio

## Limitations
- Maximum 5 reference images
- PNG format requirement
- File size restrictions
- Style consistency requirements
- Processing time constraints

## Troubleshooting

### Common Issues
1. **Upload Problems**:
   - Verify ZIP format
   - Check file permissions
   - Validate image formats
   - Monitor file sizes

2. **Style Creation Failures**:
   - Review image quality
   - Check style consistency
   - Verify base style compatibility
   - Monitor API limits

3. **Performance Issues**:
   - Optimize image sizes
   - Reduce number of images
   - Check network connectivity
   - Monitor system resources

### Error Handling
```python
try:
    result = fal_client.subscribe(
        "fal-ai/recraft-v3/create-style",
        arguments={
            "images_data_url": style_url,
            "base_style": "digital_illustration"
        }
    )
except Exception as e:
    print(f"Style creation failed: {str(e)}")
    # Implement appropriate fallback
```

## Security Considerations
- Secure file handling
- API key protection
- Content validation
- URL verification
- Rate limit management

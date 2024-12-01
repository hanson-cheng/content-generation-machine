# Stable Audio Model

## Overview
Stable Audio is a powerful text-to-audio generation model designed to create high-quality audio clips from textual descriptions. It excels at generating music, sound effects, and ambient audio, with particular strength in creating rhythmic and structured audio content.

## Quick Start
```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/stable-audio",
    arguments={
        "prompt": "Upbeat electronic dance music with synth leads",
        "seconds_total": 30,
        "steps": 100
    }
)
```

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | - | Text description of desired audio |
| `seconds_total` | integer | No | 30 | Duration of generated audio in seconds |
| `seconds_start` | integer | No | 0 | Start point of the audio clip |
| `steps` | integer | No | 100 | Number of denoising steps |

## Prompt Engineering

### Music Generation
1. **Genre and Style**:
   ```python
   prompts = [
       "90 BPM lo-fi hip hop beat with jazzy piano",
       "160 BPM drum and bass with heavy bassline",
       "Ambient pad with reverb and subtle movement"
   ]
   ```

2. **Key Elements to Include**:
   - Tempo (BPM)
   - Genre/style
   - Instruments
   - Mood/atmosphere
   - Musical elements (rhythm, harmony)

### Sound Effects
1. **Environmental Sounds**:
   ```python
   prompts = [
       "Gentle ocean waves with seagulls",
       "Busy city street with traffic and people",
       "Forest ambiance with birds and wind"
   ]
   ```

2. **Technical Sounds**:
   ```python
   prompts = [
       "Mechanical keyboard typing sounds",
       "Vintage analog synthesizer sequence",
       "Industrial machinery hum and whir"
   ]
   ```

## Advanced Usage

### Progress Tracking
```python
def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"Progress: {log['message']}")

result = fal_client.subscribe(
    "fal-ai/stable-audio",
    arguments={
        "prompt": "Atmospheric soundtrack with strings",
        "seconds_total": 60
    },
    with_logs=True,
    on_queue_update=on_queue_update
)
```

### Async Generation
```python
async def generate_audio():
    handler = await fal_client.submit(
        "fal-ai/stable-audio",
        arguments={
            "prompt": "Epic orchestral theme",
            "seconds_total": 45,
            "steps": 150
        }
    )
    return await handler.wait()
```

### Segmented Generation
```python
def generate_segments(total_duration, segment_length=30):
    segments = []
    for start in range(0, total_duration, segment_length):
        result = fal_client.subscribe(
            "fal-ai/stable-audio",
            arguments={
                "prompt": "Continuous ambient background",
                "seconds_start": start,
                "seconds_total": min(segment_length, total_duration - start),
                "steps": 100
            }
        )
        segments.append(result['audio_file']['url'])
    return segments
```

## Best Practices

### Audio Quality Optimization
1. **Step Count**:
   - Higher steps (100-200) for better quality
   - Lower steps (50-100) for faster generation
   - Balance based on use case

2. **Duration Management**:
   - Optimal range: 10-60 seconds
   - Use segmentation for longer pieces
   - Consider transition points

3. **Prompt Clarity**:
   - Be specific about musical elements
   - Include technical details (BPM, key)
   - Describe desired atmosphere

### Common Use Cases
1. **Music Production**:
   - Drum loops and patterns
   - Melodic sequences
   - Background tracks
   - Sound design elements

2. **Sound Design**:
   - Ambient backgrounds
   - Sound effects
   - Transition sounds
   - Environmental audio

3. **Content Creation**:
   - Podcast backgrounds
   - Video soundtracks
   - Game audio assets
   - Installation sound art

## Limitations
- Maximum duration constraints
- Consistency in longer pieces
- Complex musical structure
- Specific instrument reproduction
- High-frequency detail accuracy

## Troubleshooting

### Common Issues
1. **Generation Quality**:
   - Increase step count
   - Make prompts more specific
   - Check duration settings
   - Consider segmentation

2. **Performance Issues**:
   - Optimize duration length
   - Balance step count
   - Use async for long generations
   - Monitor API limits

3. **Audio Artifacts**:
   - Adjust step parameters
   - Review prompt clarity
   - Check for overloaded descriptions
   - Consider multiple generations

### Error Handling
```python
try:
    result = fal_client.subscribe(
        "fal-ai/stable-audio",
        arguments={
            "prompt": "Complex orchestral piece",
            "seconds_total": 30
        }
    )
except Exception as e:
    print(f"Generation failed: {str(e)}")
    # Implement appropriate fallback
```

## Security Considerations
- Secure API key storage
- Server-side processing
- Content validation
- Output verification
- Rate limit management

# F5 TTS Model

## Overview
F5 TTS is a text-to-speech model available through fal.ai that generates human-like speech from text input using a reference audio for voice cloning.

## Quick Start
```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/f5-tts",
    arguments={
        "gen_text": "Your text here",
        "ref_audio_url": "path/to/reference/audio.wav",
        "model_type": "F5-TTS"
    }
)
```

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `gen_text` | string | Yes | - | The text to be converted to speech |
| `ref_audio_url` | string | Yes | - | URL of the reference audio file |
| `ref_text` | string | No | "" | Reference text for TTS. If not provided, ASR will be used |
| `model_type` | enum | Yes | - | Model type: "F5-TTS" or "E2-TTS" |
| `remove_silence` | boolean | No | true | Whether to remove silence from audio |

## Response Format
```json
{
  "audio_url": {
    "url": "https://v2.fal.media/files/example.wav",
    "content_type": "audio/wav",
    "file_name": "example.wav",
    "file_size": 4404019
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
    "fal-ai/f5-tts",
    arguments={
        "gen_text": "Your text here",
        "ref_audio_url": "path/to/reference/audio.wav",
        "model_type": "F5-TTS"
    },
    webhook_url="https://your.webhook.url"
)
```

### File Handling
1. **Base64 Data URI**: Pass encoded audio directly
2. **Hosted Files**: Use public URLs
3. **File Upload**:
   ```python
   url = fal_client.upload_file("path/to/file")
   ```

## Best Practices
1. Use async implementation for production
2. Monitor queue status for long-running requests
3. Implement proper error handling
4. Cache results when possible

## Limitations
- Maximum text length restrictions may apply
- Audio file size limits
- Rate limiting considerations

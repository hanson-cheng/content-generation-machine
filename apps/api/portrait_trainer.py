import os
from typing import List, Optional
from pydantic import BaseModel
import fal
import asyncio
from pathlib import Path

# Initialize FAL client
fal.config.api_key = os.getenv("FAL_KEY")

class TrainingConfig(BaseModel):
    instance_name: str
    instance_class: Optional[str] = "person"
    training_images: List[str]  # List of image URLs or base64 images
    num_steps: int = 1000
    seed: Optional[int] = None

class GenerationConfig(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = None
    num_images: int = 1
    guidance_scale: float = 7.5
    num_inference_steps: int = 50
    seed: Optional[int] = None

async def train_portrait_model(config: TrainingConfig):
    """Train a personalized portrait model using FLUX LoRA Portrait Trainer"""
    try:
        print(f"Starting training for instance: {config.instance_name}")
        
        # Initialize training
        result = await fal.apps.subscribe('flux-lora-portrait-trainer', {
            'instance_name': config.instance_name,
            'instance_class': config.instance_class,
            'training_images': config.training_images,
            'num_steps': config.num_steps,
            'seed': config.seed
        })
        
        print(f"Training completed. Model ID: {result.get('model_id')}")
        return result
        
    except Exception as e:
        print(f"Error during training: {str(e)}")
        raise

async def generate_portrait(model_id: str, config: GenerationConfig):
    """Generate portraits using the trained model"""
    try:
        print(f"Generating portraits using model: {model_id}")
        
        # Prepare prompt
        full_prompt = f"{config.prompt} {model_id}"
        
        # Generate images
        result = await fal.apps.subscribe('flux-portrait', {
            'prompt': full_prompt,
            'negative_prompt': config.negative_prompt,
            'num_images': config.num_images,
            'guidance_scale': config.guidance_scale,
            'num_inference_steps': config.num_inference_steps,
            'seed': config.seed
        })
        
        return result
        
    except Exception as e:
        print(f"Error during generation: {str(e)}")
        raise

# Example usage
async def main():
    # Training configuration
    training_config = TrainingConfig(
        instance_name="your_name",
        training_images=[
            # Add your training image URLs here
        ],
        num_steps=1000
    )
    
    # Train the model
    training_result = await train_portrait_model(training_config)
    model_id = training_result.get('model_id')
    
    if model_id:
        # Generation configuration
        generation_config = GenerationConfig(
            prompt="A professional headshot of the person",
            negative_prompt="blurry, low quality, distorted",
            num_images=1
        )
        
        # Generate portraits
        generation_result = await generate_portrait(model_id, generation_config)
        print("Generated images:", generation_result)

if __name__ == "__main__":
    asyncio.run(main())

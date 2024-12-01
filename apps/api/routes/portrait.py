from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List
import base64
from portrait_trainer import TrainingConfig, GenerationConfig, train_portrait_model, generate_portrait

router = APIRouter()

@router.post("/train")
async def train_portrait(
    instance_name: str,
    files: List[UploadFile] = File(...),
    instance_class: str = "person",
    num_steps: int = 1000
):
    """
    Train a portrait model using uploaded images
    """
    try:
        # Convert uploaded files to base64
        training_images = []
        for file in files:
            contents = await file.read()
            base64_image = base64.b64encode(contents).decode('utf-8')
            training_images.append(f"data:image/jpeg;base64,{base64_image}")
        
        # Configure training
        config = TrainingConfig(
            instance_name=instance_name,
            instance_class=instance_class,
            training_images=training_images,
            num_steps=num_steps
        )
        
        # Start training
        result = await train_portrait_model(config)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/{model_id}")
async def generate_portraits(
    model_id: str,
    prompt: str,
    negative_prompt: str = None,
    num_images: int = 1,
    guidance_scale: float = 7.5,
    num_inference_steps: int = 50,
    seed: int = None
):
    """
    Generate portraits using a trained model
    """
    try:
        config = GenerationConfig(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_images=num_images,
            guidance_scale=guidance_scale,
            num_inference_steps=num_inference_steps,
            seed=seed
        )
        
        result = await generate_portrait(model_id, config)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

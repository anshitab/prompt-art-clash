from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline
import torch
import base64
from io import BytesIO
import random
import os
from dotenv import load_dotenv
from typing import Optional


load_dotenv(dotenv_path="backend/.env") # Loads variables from .env into environment
HF_TOKEN = os.getenv("HF_TOKEN")


app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Stable Diffusion model once
device = "cpu" 
model = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4", use_auth_token=HF_TOKEN)
model = model.to(device)

# Predefined prompts with sample images for efficient generation
PREDEFINED_PROMPTS = [
    {
        "id": 0,
        "prompt": "A futuristic cityscape with neon lights and flying cars, digital art style",
        "category": "futuristic",
        "style": "digital art"
    },
    {
        "id": 1,
        "prompt": "A serene mountain landscape at sunset with golden clouds, oil painting style",
        "category": "nature",
        "style": "oil painting"
    },
    {
        "id": 2,
        "prompt": "A cyberpunk warrior with glowing armor in a dark alley, concept art",
        "category": "cyberpunk",
        "style": "concept art"
    },
    {
        "id": 3,
        "prompt": "A magical forest with glowing mushrooms and fairy lights, fantasy art",
        "category": "fantasy",
        "style": "fantasy art"
    },
    {
        "id": 4,
        "prompt": "A steampunk airship flying over Victorian London, detailed illustration",
        "category": "steampunk",
        "style": "detailed illustration"
    },
    {
        "id": 5,
        "prompt": "A cute robot playing with a cat in a cozy room, cartoon style",
        "category": "cute",
        "style": "cartoon"
    },
    {
        "id": 6,
        "prompt": "A space station orbiting Earth with stars in background, sci-fi art",
        "category": "sci-fi",
        "style": "sci-fi art"
    },
    {
        "id": 7,
        "prompt": "A medieval castle on a hill with dragons flying overhead, fantasy",
        "category": "fantasy",
        "style": "fantasy"
    },
    {
        "id": 8,
        "prompt": "A modern abstract composition with geometric shapes and vibrant colors",
        "category": "abstract",
        "style": "modern"
    },
    {
        "id": 9,
        "prompt": "A peaceful garden with cherry blossoms and a small pond, watercolor style",
        "category": "nature",
        "style": "watercolor"
    },
    {
        "id": 10,
        "prompt": "A superhero in a dynamic pose with energy effects, comic book style",
        "category": "superhero",
        "style": "comic book"
    },
    {
        "id": 11,
        "prompt": "A cozy coffee shop interior with warm lighting and people, realistic",
        "category": "realistic",
        "style": "realistic"
    },
    {
        "id": 12,
        "prompt": "A mystical crystal cave with glowing crystals and magical atmosphere",
        "category": "fantasy",
        "style": "mystical"
    },
    {
        "id": 13,
        "prompt": "A vintage car driving through a desert landscape at golden hour",
        "category": "vintage",
        "style": "realistic"
    },
    {
        "id": 14,
        "prompt": "A fantasy character with magical staff and flowing robes, RPG art",
        "category": "fantasy",
        "style": "RPG art"
    }
]

# Cache for pre-generated sample images
SAMPLE_IMAGES_CACHE = {}
SAMPLE_IMAGES_DIR = 'sample_images'
os.makedirs(SAMPLE_IMAGES_DIR, exist_ok=True)

def generate_sample_image(prompt: str, prompt_id: int) -> str:
    image_path = os.path.join(SAMPLE_IMAGES_DIR, f"{prompt_id}.png")
    # If image already exists, load and return as base64
    if os.path.exists(image_path):
        with open(image_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    # Otherwise, generate and save
    try:
        image = model(prompt).images[0]
        image.save(image_path, format="PNG")
        with open(image_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    except Exception as e:
        print(f"Error generating sample image: {e}")
        return ""

def pre_generate_sample_images():
    print("Pre-generating/loading sample images for all prompts...")
    try:
        for prompt_data in PREDEFINED_PROMPTS:
            prompt_id = prompt_data["id"]
            prompt_text = prompt_data["prompt"]
            if prompt_id not in SAMPLE_IMAGES_CACHE:
                print(f"Generating/loading sample for prompt {prompt_id}: {prompt_text[:50]}...")
                sample_image = generate_sample_image(prompt_text, prompt_id)
                SAMPLE_IMAGES_CACHE[prompt_id] = sample_image
        print(f"Ready {len(SAMPLE_IMAGES_CACHE)} sample images")
    except Exception as e:
        print(f"Error during sample image generation: {e}")
        print("Continuing without sample images...")

# Request body structure (simplified)
class GenerateRequest(BaseModel):
    prompt_index: Optional[int] = None  # Optional: specify which predefined prompt to use
    prompt: Optional[str] = None        # Optional: custom prompt

@app.post("/generate-image")
async def generate_image(req: GenerateRequest = GenerateRequest()):
    try:
        if req.prompt:  # If user provided a custom prompt, use it
            selected_prompt = req.prompt
            selected_prompt_data = {"id": None, "prompt": req.prompt, "category": "custom", "style": "custom"}
        elif req.prompt_index is not None and 0 <= req.prompt_index < len(PREDEFINED_PROMPTS):
            selected_prompt_data = PREDEFINED_PROMPTS[req.prompt_index]
            selected_prompt = selected_prompt_data["prompt"]
        else:
            selected_prompt_data = random.choice(PREDEFINED_PROMPTS)
            selected_prompt = selected_prompt_data["prompt"]

        # Generate image with the selected prompt
        image = model(selected_prompt).images[0]
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return {
            "success": True,
            "imageData": img_str,
            "prompt": selected_prompt,
            "promptData": selected_prompt_data,
            "description": f"Image generated from prompt: '{selected_prompt}'"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/predefined-prompts")
async def get_predefined_prompts():
    """Get list of all predefined prompts with metadata and sample images"""
    # Ensure sample images are generated
    if not SAMPLE_IMAGES_CACHE:
        pre_generate_sample_images()
    
    # Add sample images to prompts
    prompts_with_samples = []
    for prompt_data in PREDEFINED_PROMPTS:
        prompt_with_sample = prompt_data.copy()
        prompt_with_sample["sampleImage"] = SAMPLE_IMAGES_CACHE.get(prompt_data["id"], "")
        prompts_with_samples.append(prompt_with_sample)
    
    return {
        "success": True,
        "prompts": prompts_with_samples,
        "count": len(PREDEFINED_PROMPTS)
    }

@app.get("/generate-random")
async def generate_random_image():
    """Generate image from a random predefined prompt"""
    try:
        selected_prompt_data = random.choice(PREDEFINED_PROMPTS)
        selected_prompt = selected_prompt_data["prompt"]
        
        image = model(selected_prompt).images[0]

        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return {
            "success": True,
            "imageData": img_str,
            "prompt": selected_prompt,
            "promptData": selected_prompt_data,
            "description": f"Random image generated from: '{selected_prompt}'"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/prompt/{prompt_id}")
async def get_prompt_by_id(prompt_id: int):
    """Get a specific prompt by its ID with sample image"""
    if 0 <= prompt_id < len(PREDEFINED_PROMPTS):
        # Ensure sample images are generated
        if not SAMPLE_IMAGES_CACHE:
            pre_generate_sample_images()
        
        prompt_data = PREDEFINED_PROMPTS[prompt_id].copy()
        prompt_data["sampleImage"] = SAMPLE_IMAGES_CACHE.get(prompt_id, "")
        
        return {
            "success": True,
            "prompt": prompt_data
        }
    else:
        return {
            "success": False,
            "error": f"Prompt ID {prompt_id} not found"
        }

@app.get("/prompts-by-category/{category}")
async def get_prompts_by_category(category: str):
    """Get all prompts for a specific category with sample images"""
    # Ensure sample images are generated
    if not SAMPLE_IMAGES_CACHE:
        pre_generate_sample_images()
    
    filtered_prompts = []
    for p in PREDEFINED_PROMPTS:
        if p["category"].lower() == category.lower():
            prompt_with_sample = p.copy()
            prompt_with_sample["sampleImage"] = SAMPLE_IMAGES_CACHE.get(p["id"], "")
            filtered_prompts.append(prompt_with_sample)
    
    return {
        "success": True,
        "prompts": filtered_prompts,
        "category": category,
        "count": len(filtered_prompts)
    }

@app.get("/sample-images")
async def get_all_sample_images():
    """Get all sample images for quick access"""
    # Ensure sample images are generated
    if not SAMPLE_IMAGES_CACHE:
        pre_generate_sample_images()
    
    return {
        "success": True,
        "sampleImages": SAMPLE_IMAGES_CACHE,
        "count": len(SAMPLE_IMAGES_CACHE)
    }

# Initialize sample images when the app starts
@app.on_event("startup")
async def startup_event():
    """Initialize sample images on startup"""
    pre_generate_sample_images()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Prompt Art Clash API is running!",
        "status": "healthy",
        "endpoints": {
            "predefined_prompts": "/predefined-prompts",
            "generate_image": "/generate-image",
            "generate_random": "/generate-random",
            "sample_images": "/sample-images",
            "prompt_by_id": "/prompt/{prompt_id}",
            "prompts_by_category": "/prompts-by-category/{category}"
        }
    }

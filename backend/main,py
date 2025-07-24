from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline
import torch
import base64
from io import BytesIO

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
# if torch.cuda.is_available() else "cpu"
device = "cpu" 
model = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4")
model = model.to(device)

# Request body structure
class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate-image")
async def generate_image(req: PromptRequest):
    try:
        image = model(req.prompt).images[0]

        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return {
            "success": True,
            "imageData": img_str,
            "description": f"Image generated from prompt: '{req.prompt}'"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

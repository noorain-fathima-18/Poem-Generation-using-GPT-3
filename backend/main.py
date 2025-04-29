from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# OpenAI API key from the environment variable
openai.api_key = os.getenv('OPENAI_API_KEY')

# Initialize FastAPI app
app = FastAPI(title="Poet's Palette API")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request model for poem generation
class PoemRequest(BaseModel):
    title: str
    emotion: str
    context: str
    tone: str
    model: Optional[str] = "gpt-3.5-turbo"
    max_tokens: Optional[int] = 200
    temperature: Optional[float] = 1.0

# Define response model
class PoemResponse(BaseModel):
    poem: str

@app.post("/generate-poem", response_model=PoemResponse)
async def generate_poem(request: PoemRequest):
    """
    Generate a poem based on the provided title, emotion, context, and tone.
    """
    try:
        # Create a chat message for the model
        messages = [
            {"role": "system", "content": "You are a creative poet."},
            {"role": "user", "content": f"Write a beautiful poem with the title '{request.title}', conveying the emotion of '{request.emotion}', in a '{request.tone}' tone, and considering the context: '{request.context}'."}
        ]

        # Use the OpenAI API to generate the poem
        response = openai.chat.completions.create(
            model=request.model,
            messages=messages,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )
        
        # Extract the generated poem text
        poem = response.choices[0].message.content.strip()
        return {"poem": poem}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """
    Endpoint to check if the API is running.
    """
    return {"status": "healthy"}

# Run with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

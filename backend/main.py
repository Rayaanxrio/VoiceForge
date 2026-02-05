import os
import io
import httpx
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="VoiceForge API",
    description="Voice cloning API powered by Qwen3-TTS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COLAB_URL = os.getenv("COLAB_URL", "")
ALLOWED_EXTENSIONS = {".wav", ".mp3", ".m4a", ".ogg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def validate_audio_file(filename: str, file_size: int) -> None:
    ext = os.path.splitext(filename.lower())[1]
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file format. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )


@app.get("/")
async def root():
    return {
        "service": "VoiceForge API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    colab_status = "configured" if COLAB_URL else "not configured"
    return {
        "status": "healthy",
        "colab_url": colab_status
    }


@app.post("/generate")
async def generate_voice(
    text: str = Form(..., min_length=1, max_length=1000),
    reference_audio: UploadFile = File(...)
):
    if not COLAB_URL:
        raise HTTPException(
            status_code=503,
            detail="Colab server URL not configured. Please set COLAB_URL in .env"
        )

    audio_content = await reference_audio.read()
    file_size = len(audio_content)
    
    validate_audio_file(reference_audio.filename, file_size)
    
    logger.info(f"Processing request: text='{text[:50]}...', file={reference_audio.filename}")

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            files = {
                "reference_audio": (
                    reference_audio.filename,
                    audio_content,
                    reference_audio.content_type or "audio/wav"
                )
            }
            data = {"text": text}
            
            response = await client.post(
                f"{COLAB_URL.rstrip('/')}/clone",
                files=files,
                data=data
            )
            
            if response.status_code != 200:
                error_detail = response.text[:200] if response.text else "Unknown error"
                logger.error(f"Colab error: {response.status_code} - {error_detail}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Colab server error: {error_detail}"
                )
            
            logger.info("Voice generation successful")
            
            return StreamingResponse(
                io.BytesIO(response.content),
                media_type="audio/wav",
                headers={
                    "Content-Disposition": "attachment; filename=generated_voice.wav"
                }
            )
            
    except httpx.ConnectError:
        logger.error("Failed to connect to Colab server")
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Colab server. Please check if it's running and the URL is correct."
        )
    except httpx.TimeoutException:
        logger.error("Colab server request timed out")
        raise HTTPException(
            status_code=504,
            detail="Request timed out. The Colab server took too long to respond."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """
    Nvidia NIM Configuration for High-Precision Extraction.
    """
    NVIDIA_API_KEY: str = os.getenv("NVIDIA_API_KEY", "")
    INVOKE_URL: str = "https://integrate.api.nvidia.com/v1/chat/completions"
    
    # Using the Llama 3.2 Vision model for image ingestion
    VISION_MODEL: str = "meta/llama-3.2-90b-vision-instruct"
    
    # Inference Parameters
    TEMPERATURE: float = 1.00
    TOP_P: float = 1.00
    MAX_TOKENS: int = 512

    @classmethod
    def validate(cls) -> None:
        if not cls.NVIDIA_API_KEY:
            raise ValueError("ENVIRONMENT ERROR: NVIDIA_API_KEY must be set in .env")

config = Config()

import requests
import json
import logging
from src.core.config import config
from src.domain.schemas import ExtractionResult
from src.utils.encoding import encode_image

logger = logging.getLogger(__name__)

class ImageExtractionEngine:
    """
    Service Layer: Interfaces with Nvidia NIM Vision Endpoint.
    """
    def __init__(self):
        config.validate()
        self.headers = {
            "Authorization": f"Bearer {config.NVIDIA_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

    def extract_data(self, image_path: str) -> ExtractionResult:
        """
        Executes vision-to-json pipeline.
        """
        base64_image = encode_image(image_path)
        
        system_instructions = """
You are a strict data extraction engine. Your ONLY objective is to extract food ingredients, quantities, and categories from images and output them in valid JSON.
"""
        payload = {
            "model": config.VISION_MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": system_instructions},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                        }
                    ]
                }
            ],
            "max_tokens": config.MAX_TOKENS,
            "temperature": config.TEMPERATURE,
            "top_p": config.TOP_P,
            "stream": False
        }

        try:
            response = requests.post(
                config.INVOKE_URL,
                headers=self.headers,
                json=payload,
                timeout=120
            )
            response.raise_for_status()
            
            raw_content = response.json()["choices"][0]["message"]["content"]
            
            # Strip hallucinated markdown fences before passing to Pydantic
            clean_json = raw_content.replace("```json", "").replace("```", "").strip()
            
            try:
                extraction = ExtractionResult.model_validate_json(clean_json)
                return extraction
            except Exception as ve:
                logger.error(f"Error: {str(ve)}", exc_info=True)
                raise ValueError("SCHEMA VALIDATION FAILED")

        except Exception as e:
            logger.error(f"Error: {str(e)}", exc_info=True)
            raise RuntimeError("An internal error occurred. Please try again later.")

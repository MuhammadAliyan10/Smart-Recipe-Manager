import requests
import json
from src.core.config import config
from src.domain.schemas import ExtractionResult
from src.utils.encoding import encode_image

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

CRITICAL RULES:
1. You MUST use the exact JSON keys provided in the example below. Do not invent new keys (e.g., use "name", NEVER use "item").
2. You MUST provide a "confidence_score" (float between 0.0 and 1.0) for every ingredient.
3. Separate weights/volumes from the product name. If the receipt says "GREEK YOGURT 320Z", the name is "GREEK YOGURT" and the quantity is "320Z".
4. If the image contains no food or receipts, return an empty "ingredients" list [].
5. OUTPUT ONLY RAW JSON. No markdown formatting (e.g., do not use ```json).

EXPECTED EXACT SCHEMA FORMAT:
{
  "ingredients": [
    {
      "name": "string",
      "quantity": "string",
      "category": "string",
      "confidence_score": 0.95
    }
  ],
  "unrecognized_text": "string"
}
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
                raise ValueError(f"SCHEMA VALIDATION FAILED: {ve}. Raw Content: {raw_content}")

        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"API NETWORK FAILURE: {str(e)}")
        except Exception as e:
            raise RuntimeError(f"DATA PROCESSING FAILURE: {str(e)}")

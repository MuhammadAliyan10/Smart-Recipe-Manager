import os
import json
from typing import List
from openai import OpenAI
from src.domain.schemas import RecipeListResponse

class RecipeGenerationEngine:
    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY")
        if not self.api_key:
            raise ValueError("CRITICAL: NVIDIA_API_KEY not found in environment.")
        
        # Initialize OpenAI-compatible client for Nvidia NIM
        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=self.api_key
        )
        self.model = "meta/llama-3.1-70b-instruct"

    def generate_recipes(self, available_ingredients: List[str]) -> RecipeListResponse:
        """
        Generates 3 recipes based on provided ingredients using Llama 3.1 70B on NIM.
        """
        ingredients_str = ", ".join(available_ingredients)
        
        system_prompt = (
            "You are an expert culinary AI. You will be provided with a list of ingredients currently in the user's pantry. "
            "Your task is to generate 3 highly appealing recipes that maximize the use of these ingredients. "
            "You may assume the user has basic pantry staples (salt, pepper, oil, water, flour, sugar). "
            "You MUST output valid JSON conforming exactly to this structure: "
            "{ \"recipes\": [ { \"title\": \"...\", \"matchPercentage\": 90, \"time\": \"20 min\", \"calories\": \"400 kcal\", \"ingredients\": [\"item1\", \"item2\"] } ] }. "
            "No markdown formatting, no conversational text, no explanations. Only raw JSON."
        )

        user_prompt = f"Available ingredients: {ingredients_str}"

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=1500,
                response_format={"type": "json_object"}
            )

            content = response.choices[0].message.content
            if not content:
                raise ValueError("LLM returned empty content")

            # Parse and validate against our schema
            raw_data = json.loads(content)
            return RecipeListResponse.model_validate(raw_data)

        except Exception as e:
            print(f"[RECIPE ENGINE] Generation Error: {str(e)}")
            # Fallback/Re-raise
            raise e

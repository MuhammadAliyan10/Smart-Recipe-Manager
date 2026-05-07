import os
import json
from typing import List, Optional
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

    def generate_recipes(self, available_ingredients: List[str], preferences: Optional[str] = None) -> RecipeListResponse:
        """
        Generates 3 recipes based on provided ingredients and optional user preferences.
        """
        ingredients_str = ", ".join(available_ingredients)
        
        preference_clause = f"The user has the following preferences: {preferences}. " if preferences else ""

        system_prompt = (
            "You are an expert culinary AI. You will be provided with a list of ingredients currently in the user's pantry. "
            "Your task is to generate 3 highly appealing recipes that maximize the use of these ingredients. "
            f"{preference_clause}"
            "You may assume the user has basic pantry staples (salt, pepper, oil, water, flour, sugar). "
            "You must compare the required ingredients and quantities for each recipe against the user's provided pantry list. "
            "If the user is entirely missing an ingredient, OR if they do not have enough quantity (e.g., they have 2 eggs but the recipe needs 4), "
            "you MUST list that specific item and the missing amount in the missing_ingredients array (e.g., '2 Eggs'). "
            "If they have everything needed, return an empty array []. "
            "For each recipe, include step-by-step cooking instructions and suggested ingredient substitutes if applicable. "
            "You MUST output valid JSON conforming exactly to this structure: "
            "{ "
            "  \"recipes\": [ "
            "    { "
            "      \"title\": \"...\", "
            "      \"matchPercentage\": 90, "
            "      \"time\": \"20 min\", "
            "      \"calories\": \"400 kcal\", "
            "      \"ingredients\": [\"item1\", \"item2\"], "
            "      \"instructions\": [\"Step 1...\", \"Step 2...\"], "
            "      \"missing_ingredients\": [\"2 Eggs\", \"500g Chicken\"], "
            "      \"substitutes\": [{\"original\": \"Milk\", \"substitute\": \"Almond Milk\"}] "
            "    } "
            "  ] "
            "}. "
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
                max_tokens=2500,
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

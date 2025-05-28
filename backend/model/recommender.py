import torch
import pandas as pd
import ast
import joblib
from model.model_def import IngredientPredictor  # make sure model_def.py is in the same folder or accessible

class IngredientRecommender:
    def __init__(self, recipe_path, model_path, mlb_path):
        df = pd.read_csv(recipe_path)
        df["ingredients"] = df["ingredients"].apply(ast.literal_eval)
        df["steps"] = df["steps"].apply(ast.literal_eval)
        df["nutrition"] = df["nutrition"].apply(ast.literal_eval)
        self.recipes = df.to_dict(orient="records")

        self.mlb = joblib.load(mlb_path)
        input_size = len(self.mlb.classes_)

        self.model = IngredientPredictor(input_size=input_size)
        self.model.load_state_dict(torch.load(model_path))
        self.model.eval()

    def recommend(self, input_ingredients, top_k=10):
        input_vector = self.mlb.transform([input_ingredients])
        input_tensor = torch.tensor(input_vector).float()
        with torch.no_grad():
            output = self.model(input_tensor).numpy().flatten()
        prediction_indices = output.argsort()[::-1]
        predicted_ingredients = [self.mlb.classes_[i] for i in prediction_indices if self.mlb.classes_[i] not in input_ingredients][:10]
        full_ingredients = set(input_ingredients + predicted_ingredients)

        # Score recipes
        scored = []
        for r in self.recipes:
            recipe_ingredients = set(r['ingredients'])
            score = len(full_ingredients & recipe_ingredients) / len(recipe_ingredients) if recipe_ingredients else 0
            if score > 0:
                result = r.copy()
                result['score'] = round(score, 2)
                scored.append(result)
        return sorted(scored, key=lambda x: x['score'], reverse=True)[:top_k]

# recommender.py

import pandas as pd
import torch
import torch.nn as nn
import joblib
from utils import preprocess_ingredients, vectorize_input, score_recipes

# This must exactly match the model used in training!
class Autoencoder(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 512),
            nn.ReLU(),
            nn.Linear(512, 256),
            nn.ReLU(),
        )
        self.decoder = nn.Sequential(
            nn.Linear(256, 512),
            nn.ReLU(),
            nn.Linear(512, input_dim),
            nn.Sigmoid(),
        )

    def forward(self, x):
        z = self.encoder(x)
        out = self.decoder(z)
        return out

class IngredientRecommender:
    def __init__(self, csv_path, model_path, mlb_path):
        self.recipes_df = pd.read_csv(csv_path)
        self.recipes = self.recipes_df.to_dict(orient="records")
        self.mlb = joblib.load(mlb_path)
        input_dim = len(self.mlb.classes_)
        self.model = Autoencoder(input_dim)
        # Load state_dict, not a whole model!
        state_dict = torch.load(model_path, map_location='cpu')
        self.model.load_state_dict(state_dict)
        self.model.eval()

    def recommend(self, raw_ingredients):
        processed = preprocess_ingredients(raw_ingredients)
        if not processed:
            return []
        input_vec = vectorize_input(processed, self.mlb)
        with torch.no_grad():
            pred = self.model(input_vec.unsqueeze(0)).squeeze(0)
        return score_recipes(pred, input_vec, self.recipes_df, self.mlb)

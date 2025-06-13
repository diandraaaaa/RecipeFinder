# main.py

from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sympy.printing.pytorch import torch

from recommender import IngredientRecommender
from utils import preprocess_ingredients, vectorize_input, score_recipes, clean_dict

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
recommender = IngredientRecommender(
    "data/cleaned_recipes_sorted.csv",
    "model/autoencoder_model_finetuned.pth",
    "model/mlb.pkl"
)

@app.get("/recipes")
def list_recipes(category: str = Query(None)):
    df = recommender.recipes_df
    if not category or not category.strip():
        # Sort by rating descending, return top 50 as dicts
        result = df.sort_values("rating", ascending=False).head(50)
        recipes = result.to_dict(orient="records")
    else:
        filtered = df[df["diet"].astype(str).str.lower() == category.lower()]
        recipes = filtered.head(50).to_dict(orient="records")
    # Clean NaN/inf values
    return [clean_dict(r) for r in recipes]


@app.get("/recipes/{id}")
def get_recipe(id: int):
    df = recommender.recipes_df
    match = df[df["id"] == id]
    if match.empty:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return match.iloc[0].to_dict()


@app.post("/recommend")
async def recommend_recipes(request: Request):
    body = await request.json()
    ingredients = body.get("ingredients", [])
    processed = preprocess_ingredients(ingredients)
    input_vec = vectorize_input(processed, recommender.mlb)

    print("----DEBUG /recommend----")
    print(f"User input: {ingredients}")
    print(f"Processed ingredients: {processed}")
    print(f"Input vector (sum): {input_vec.sum().item()}, shape: {input_vec.shape}")

    with torch.no_grad():
        pred = recommender.model(input_vec.unsqueeze(0)).squeeze(0)

    print(f"Model prediction (first 10): {pred[:10]}")
    topk_indices = torch.topk(pred, 100).indices.numpy()
    topk_ingredients = [recommender.mlb.classes_[i] for i in topk_indices]
    print(f"Top 10 predicted ingredients: {topk_ingredients[:10]}")

    results = score_recipes(pred, input_vec, recommender.recipes_df, recommender.mlb)

    print(f"Num results returned: {len(results)}")
    if results:
        print(f"Top result: {results[0]['title'] if isinstance(results[0], dict) else results[0][1]['title']}")

    return [clean_dict(r) for r in results]


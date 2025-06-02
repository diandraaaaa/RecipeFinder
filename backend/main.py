from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model.recommender import IngredientRecommender
import re

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load recommender and recipes ---
recommender = IngredientRecommender(
    "data/cleaned_recipes.csv",
    "model/model.pth",
    "model/mlb.pkl"
)

# --- Dynamically build ingredient vocabulary from the dataset ---
ingredient_vocabulary = set()
for recipe in recommender.recipes:
    for ingredient in recipe['ingredients']:
        # Lowercase and clean
        word = ingredient.lower()
        word = re.sub(r'[^\w\s]', '', word)
        ingredient_vocabulary.add(word)

# --- Minimal stopword set for ingredient normalization ---
SIMPLE_STOPWORDS = {
    "fresh", "chopped", "organic", "sliced", "diced", "minced", "ground",
    "crushed", "and", "or", "of", "the", "to", "in", "with", "on"
}

def preprocess_ingredient(ingredient):
    """Lowercase, remove punctuation, remove stopwords, and simple singularize tokens."""
    ingredient = ingredient.lower()
    ingredient = re.sub(r'[^\w\s]', '', ingredient)
    tokens = ingredient.split()
    tokens = [t for t in tokens if t not in SIMPLE_STOPWORDS]
    # Naive singularization: remove trailing 's' (improves matching for simple plurals)
    tokens = [t[:-1] if t.endswith('s') and len(t) > 3 else t for t in tokens]
    return tokens

def match_ingredients(input_tokens):
    """Return a list of tokens that match the ingredient vocabulary."""
    matched_ingredients = set()
    for token in input_tokens:
        if token in ingredient_vocabulary:
            matched_ingredients.add(token)
    return list(matched_ingredients)

# --- ROUTES ---

@app.get("/recipes")
def list_recipes():
    # Return the first 50 recipes
    return recommender.recipes[:50]

@app.get("/recipes/{id}")
def get_recipe(id: int):
    # Return the recipe with the specified ID, or 404 if not found
    for recipe in recommender.recipes:
        if recipe.get("id") == id:
            return recipe
    raise HTTPException(status_code=404, detail="Recipe not found")

@app.post("/recommend")
async def get_recommendation(request: Request):
    # Get the ingredients from the request body
    body = await request.json()
    raw_ingredients = body.get("ingredients", [])
    if not isinstance(raw_ingredients, list):
        raise HTTPException(status_code=400, detail="Ingredients must be a list of strings.")

    # Process and match ingredients
    processed_tokens = []
    for ingredient in raw_ingredients:
        processed_tokens.extend(preprocess_ingredient(ingredient))
    matched_ingredients = match_ingredients(processed_tokens)

    if not matched_ingredients:
        raise HTTPException(status_code=400, detail="No matching ingredients found.")

    # Return recommended recipes
    return recommender.recommend(matched_ingredients)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from model.recommender import IngredientRecommender

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load recommender
recommender = IngredientRecommender(
    "data/cleaned_recipes.csv",
    "model/model.pth",
    "model/mlb.pkl"
)

@app.get("/recipes")
def list_recipes():
    return recommender.recipes[:50]

@app.post("/recommend")
async def get_recommendation(request: Request):
    body = await request.json()
    ingredients = body.get("ingredients", [])
    return recommender.recommend(ingredients)
import torch
import re
import math

STOPWORDS_REGEX = re.compile(
r'\b(?:fresh|organic|chopped|sliced|minced|large|small|medium|peeled|diced|crushed|raw|cooked|whole|to|taste|optional|cup|tablespoon|tbsp|teaspoon|tsp|grams|g|ml|oz|lb|pound|kg|pinch|dash|package|packet|pieces|split|seeded|halved|quartered|boneless|skinless|boiled|baked|shredded|drained|uncooked|slice|into|and|couple|splashes|hot|cold)\b',
    flags=re.IGNORECASE
)


def clean_dict(obj):
    """Recursively replace NaN and inf in a dict with None."""
    if isinstance(obj, dict):
        return {k: clean_dict(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_dict(i) for i in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    else:
        return obj

def clean_ingredient(ingredient):
    cleaned = STOPWORDS_REGEX.sub('', ingredient.lower())
    return re.sub(r'[^\w\s]', '', cleaned).strip()

def preprocess_ingredients(raw_list):
    return [clean_ingredient(i) for i in raw_list if isinstance(i, str)]

def vectorize_input(ingredients, mlb):
    binary_vec = mlb.transform([ingredients])[0]
    return torch.FloatTensor(binary_vec)

def score_recipes(pred_vec, input_vec, df, mlb):
    topk_indices = torch.topk(pred_vec, 20).indices.numpy()
    predicted_ings = set(mlb.classes_[i] for i in topk_indices)
    results = []
    for _, row in df.iterrows():
        try:
            recipe_ings = set(eval(row["ingredients"]))
        except:
            continue
        score = len(predicted_ings & recipe_ings) / max(len(recipe_ings), 1)
        if score > 0:
            results.append((score, row.get("rating", 0), row.to_dict()))
    # Sort by score, then by rating
    results.sort(key=lambda x: (x[0], x[1]), reverse=True)
    return [r[2] for r in results]

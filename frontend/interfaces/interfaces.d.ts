// frontend/types.ts

// Basic recipe shown in lists
export interface Recipe {
    id: number;
    name: string;
    minutes: number;
    score?: number; // optional, e.g., for recommendations
    ingredients?: string[];
    instructions?: string;
    category?: string; // optional category for filtering
}

// Recipe shown in trending or analytics (if implemented)
export interface TrendingRecipe {
    searchTerm: string;
    recipe_id: number;
    name: string;
    count: number;
    image_url?: string; // optional, if you support custom images
}

// Full details for a single recipe
export interface RecipeDetails {
    id: number;
    name: string;
    minutes: number;
    nutrition: number[]; // typically [calories, fat, sugar, etc.]
    steps: string[];
    ingredients: string[];
    description?: string; // optional if added
    image_url?: string; // optional if added
}

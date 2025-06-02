// frontend/services/api.ts
import { BACKEND_URL } from '@/constants/config';

export const fetchRecipes = async () => {
    console.log("📡 Fetching from:", BACKEND_URL);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    try {
        const response = await fetch(`${BACKEND_URL}/recipes`, {
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
            console.log("⚠️ Backend responded with status:", response.status);
            throw new Error('Failed to fetch recipes');
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeout);
        if (error instanceof Error) {
            console.log("❌ Fetch failed:", error.message);
        } else {
            console.log("❌ Unknown fetch error:", error);
        }
        throw error;
    }
};


export const fetchRecommendations = async (ingredients: string[]) => {
    try {
        const response = await fetch(`${BACKEND_URL}/recommend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients }),
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        throw error;
    }
};
export const fetchRecipe = async (id: number) => {
    const response = await fetch(`${BACKEND_URL}/recipes/${id}`);
    if (!response.ok) throw new Error("Recipe not found");
    return await response.json();
};

// frontend/services/api.ts
import { BACKEND_URL } from '../constants/config';

export const fetchRecipes = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/recipes`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch recipes:', error);
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

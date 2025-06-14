import { BACKEND_URL } from '@/constants/config';
import { database } from '../lib/appwriteConfig';
import { ID, Query } from 'react-native-appwrite';

export const fetchRecipes = async (params: Record<string, string> = {}) => {
    const url = new URL(`${BACKEND_URL}/recipes`);
    Object.entries(params).forEach(([key, val]) => {
        if (val) url.searchParams.append(key, val);
    });

    console.log("📡 Fetching from:", url.toString());

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    try {
        const response = await fetch(url.toString(), {
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

const DATABASE_ID = "684408f0002252e5e9c5";
const FAVORITES_COLLECTION_ID ="684408fd0018251c68e0";

export const fetchFavorites = async (userId: string) => {
    try {
        const response = await database.listDocuments(
            DATABASE_ID,
            FAVORITES_COLLECTION_ID,
            [Query.equal('user_id', userId)]
        );
        return response.documents.map((doc: any) => Number(doc.recipe_id));
    } catch (error) {
        console.error('Failed to fetch favorites:', error);
        return [];
    }
};

export const toggleFavorite = async (userId: string, recipeId: number) => {
    try {
        const existingFav = await database.listDocuments(
            DATABASE_ID,
            FAVORITES_COLLECTION_ID,
            [
                Query.equal('user_id', userId),
                Query.equal('recipe_id', recipeId.toString())
            ]
        );

        if (existingFav.documents.length > 0) {
            await database.deleteDocument(
                DATABASE_ID,
                FAVORITES_COLLECTION_ID,
                existingFav.documents[0].$id
            );
        } else {
            await database.createDocument(
                DATABASE_ID,
                FAVORITES_COLLECTION_ID,
                ID.unique(),
                {
                    user_id: userId,
                    recipe_id: recipeId.toString()
                }
            );
        }
        return await fetchFavorites(userId);
    } catch (error) {
        console.error('Failed to toggle favorite:', error);
        return await fetchFavorites(userId);
    }
};


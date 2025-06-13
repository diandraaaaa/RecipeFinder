import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {fetchRecipe, fetchFavorites, toggleFavorite} from '@/services/api';
import { useAuth } from '@/context/AuthContex';
import { FontAwesome } from "@expo/vector-icons";
import { Recipe } from '@/interfaces/interfaces';

const fallbackImg = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";

function parseIngredients(ingredients: any): string[] {
    if (!ingredients) return [];
    if (Array.isArray(ingredients)) return ingredients;
    if (typeof ingredients === "string") {
        try {
            return JSON.parse(ingredients.replace(/'/g, '"'));
        } catch {
            return [ingredients];
        }
    }
    return [];
}

function parseInstructions(instructions: any): string[] {
    if (!instructions) return [];
    if (Array.isArray(instructions)) return instructions;
    if (typeof instructions === "string") {
        const steps = instructions
            .split(/\n|(?<=\.)\s(?=[A-Z])/)
            .map((s: string) => s.trim())
            .filter(Boolean);
        return steps;
    }
    return [];
}

const RecipeDetail = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchRecipe(Number(id));
                const ingredients = parseIngredients(data.ingredients);
                const instructions = parseInstructions(data.instructions);
                setRecipe({ ...data, ingredients, instructions });
            } catch {
                setRecipe(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    useEffect(() => {
        const checkFavorite = async () => {
            if (!user || !id) return;
            const favs = await fetchFavorites(user.$id);
            setIsFavorite(favs.includes(Number(id)));
        };
        checkFavorite();
    }, [id, user]);

    // Same signature as RecipeCard
    const onToggleFavorite = async (recipeId: number) => {
        if (!user) return;
        setFavoriteLoading(true);
        const favs = await toggleFavorite(user.$id, recipeId);
        setIsFavorite(favs.includes(recipeId));
        setFavoriteLoading(false);
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <ActivityIndicator size="large" color="#111" className="mt-10" />
            </SafeAreaView>
        );
    }

    if (!recipe) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <Text className="text-center text-gray-500 mt-20">Recipe not found.</Text>
                <TouchableOpacity onPress={() => router.push('/')} className="mt-6">
                    <Text className="text-lg text-green-600 underline">Back to Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const imgUrl = recipe.image && recipe.image.startsWith("http") ? recipe.image : fallbackImg;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row justify-between items-center absolute top-10 left-0 right-0 z-20 px-4">
                {/* Back Button */}
                <TouchableOpacity
                    className="bg-white/80 rounded-full p-2"
                    onPress={() => router.back()}
                >
                    <Text className="text-2xl font-bold text-black">←</Text>
                </TouchableOpacity>

                {/* Favorite Heart */}
                <TouchableOpacity
                    onPress={() => onToggleFavorite(recipe.id)}
                    disabled={favoriteLoading}
                    className="bg-white/80 rounded-full p-2"
                >
                    <FontAwesome
                        name={isFavorite ? "heart" : "heart-o"}
                        size={28}
                        color={isFavorite ? "#ef4444" : "#d0d0d0"}
                    />
                </TouchableOpacity>
            </View>


            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: imgUrl }} className="w-full h-56" resizeMode="cover" />

                <View className="px-6 pt-6 pb-10">
                    <Text className="text-2xl font-bold text-black mb-2">{recipe.title}</Text>

                    {recipe.diet && (
                        <Text className="text-sm text-green-600 mb-2 font-semibold">
                            {recipe.diet}
                        </Text>
                    )}

                    <View className="flex-row items-center mb-3">
                        <Text className="text-gray-500 mr-4">⏱ {recipe.total_time} min</Text>
                        <Text className="flex-1 text-right text-yellow-400 font-bold">★ {recipe.rating?.toFixed(1) ?? '4.5'}</Text>
                    </View>

                    {/* Tabs */}
                    <View className="flex-row bg-gray-100 rounded-xl mb-5">
                        <TouchableOpacity
                            className={`flex-1 py-3 rounded-xl ${activeTab === 'ingredients' ? 'bg-white' : ''}`}
                            onPress={() => setActiveTab('ingredients')}
                        >
                            <Text className={`text-center font-bold ${activeTab === 'ingredients' ? 'text-black' : 'text-gray-400'}`}>
                                Ingredients
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 py-3 rounded-xl ${activeTab === 'instructions' ? 'bg-white' : ''}`}
                            onPress={() => setActiveTab('instructions')}
                        >
                            <Text className={`text-center font-bold ${activeTab === 'instructions' ? 'text-black' : 'text-gray-400'}`}>
                                Instructions
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tab Content */}
                    {activeTab === 'ingredients' ? (
                        <View>
                            <Text className="text-gray-400 mb-2">
                                Ingredients for <Text className="font-bold text-black">{recipe.yields ?? '4 servings'}</Text>
                            </Text>
                            {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                                recipe.ingredients.map((ing: string, idx: number) => (
                                    <View className="flex-row justify-between py-2" key={idx}>
                                        <Text className="text-black">{ing}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text className="text-gray-400">No ingredients found.</Text>
                            )}
                        </View>
                    ) : (
                        <View>
                            {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
                                recipe.instructions.map((ins: string, idx: number) => (
                                    <Text className="mb-3 text-black" key={idx}>{ins.trim()}</Text>
                                ))
                            ) : (
                                <Text className="text-gray-400">No instructions available.</Text>
                            )}
                        </View>
                    )}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RecipeDetail;

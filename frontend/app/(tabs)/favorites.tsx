import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContex';
import { fetchFavorites, fetchRecipe } from '@/services/api';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/interfaces/interfaces';
import { useIsFocused } from '@react-navigation/native';

const Favorites = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user, session } = useAuth();
    const isFocused = useIsFocused();

    // Fetches favorite recipes based on current user
    const loadFavorites = useCallback(async () => {
        if (!user) return;
        if (!refreshing) setLoading(true);
        try {
            const favoriteIds = await fetchFavorites(user.$id);
            if (!favoriteIds.length) {
                setRecipes([]);
                return;
            }
            const recipePromises = favoriteIds.map((id: number) => fetchRecipe(id));
            const recipeResults = await Promise.allSettled(recipePromises);
            const recipeObjs = recipeResults
                .filter(result => result.status === "fulfilled")
                .map(result => (result as PromiseFulfilledResult<Recipe>).value);
            setRecipes(recipeObjs);
        } catch (error) {
            setRecipes([]);
            console.error('Failed to fetch favorite recipes:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user, refreshing]);

    // Refresh list when user logs in or navigates to the screen
    useEffect(() => {
        if (user && isFocused) {
            loadFavorites();
        }
    }, [user, isFocused, loadFavorites]);

    const handleToggleFavorite = async () => {
        setRefreshing(true);
        await loadFavorites();
    };

    if (!session) return <Redirect href="/login" />;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-6">
                <Text className="text-[22px] font-bold text-[#111] mt-[18px]">
                    Your Favorite Recipes
                </Text>

                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#111" className="mt-12" />
                ) : recipes.length === 0 ? (
                    <Text className="text-gray-500 text-center mt-12">
                        No favorite recipes yet. Add some from the home page!
                    </Text>
                ) : (
                    <FlatList
                        data={recipes}
                        renderItem={({ item }) => (
                            <RecipeCard
                                {...item}
                                isFavorite={true}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            loadFavorites();
                        }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default Favorites;

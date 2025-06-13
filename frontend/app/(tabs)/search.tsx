import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import SearchBar from '@/components/SearchBar';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/interfaces/interfaces';
import { fetchRecommendations } from '@/services/api';
import { useAuth } from '@/context/AuthContex';

const SearchPage = () => {
    const { user, session} = useAuth();
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ingredients.trim()) {
            setRecipes([]);
            return;
        }
        const handler = setTimeout(() => {
            const ingredientList = ingredients.split(/[, ]+/).map(item => item.trim()).filter(Boolean);
            setLoading(true);
            setError(null);
            fetchRecommendations(ingredientList)
                .then(data => setRecipes(data))
                .catch(err => setError(err.message || 'Failed to fetch recommendations'))
                .finally(() => setLoading(false));
        }, 500);
        return () => clearTimeout(handler);
    }, [ingredients]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <FlatList
                ListHeaderComponent={
                    <>
                        {/* Header */}
                        <View className="flex-row items-center justify-between mt-[18px]">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-2">
                            <FontAwesome name="user" size={22} color="#888" />
                        </View>
                        <View>
                            <Text className="text-gray-500 text-xs">
                                Hello, {user?.name ? user.name.split(' ')[0] : 'there'}!
                            </Text>
                        </View>
                    </View>
                </View>
                        {/* Tagline */}
                        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111', marginTop: 18, lineHeight: 30 }}>
                            Find recipes by ingredients
                        </Text>
                        {/* Search Bar */}
                        <View style={{ marginTop: 24 }}>
                            <SearchBar
                                placeholder="Add ingredients (comma or space separated)"
                                value={ingredients}
                                onChangeText={setIngredients}
                            />
                        </View>
                        {/* Section Title */}
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222', marginTop: 32, marginBottom: 12 }}>
                            Recommended Recipes
                        </Text>
                        {loading && <ActivityIndicator size="large" color="#111" style={{ marginTop: 40 }} />}
                        {error && <Text style={{ color: '#e57373', marginTop: 40, textAlign: 'center' }}>{error}</Text>}
                    </>
                }
                data={recipes}
                renderItem={({ item }) => <RecipeCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
            />
        </SafeAreaView>
    );
};

export default SearchPage;

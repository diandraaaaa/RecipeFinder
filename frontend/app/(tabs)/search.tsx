import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBar from '@/components/SearchBar';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/interfaces/interfaces';
import { fetchRecommendations } from '@/services/api';

const SearchPage = () => {
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
                                    style={{ width: 38, height: 38, borderRadius: 19, marginRight: 10 }}
                                />
                                <View>
                                    <Text style={{ color: '#888', fontSize: 13 }}>Hello, Teresa!</Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <Feather name="bell" size={24} color="#222" />
                            </TouchableOpacity>
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

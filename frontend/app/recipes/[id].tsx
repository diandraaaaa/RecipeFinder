import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchRecipe } from '@/services/api';
import { Recipe } from '@/interfaces/interfaces';

const RecipeDetail = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchRecipe(Number(id));
                setRecipe(data);
            } catch {
                setRecipe(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#111" style={{ marginTop: 40 }} />
            </SafeAreaView>
        );
    }

    if (!recipe) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <Text style={{ textAlign: 'center', color: '#888', marginTop: 80 }}>Recipe not found.</Text>
                <TouchableOpacity onPress={() => router.push('/')}
                    style={{ marginTop: 24 }}>
                    <Text style={{ fontSize: 18, color: '#4caf50', textDecorationLine: 'underline' }}>Back to Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const sanitized = recipe.name.replace(/[^a-zA-Z0-9 ]/g, '');
    const imgUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Back Button */}
            <View style={{ position: 'absolute', left: 16, top: 16, zIndex: 20 }}>
                <TouchableOpacity
                    style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 999, padding: 8 }}
                    onPress={() => router.back()}
                >
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111' }}>←</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: imgUrl }} style={{ width: '100%', height: 220 }} resizeMode="cover" />

                <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#111', marginBottom: 8 }}>{recipe.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ color: '#888', marginRight: 16 }}>⏱ {recipe.minutes} min</Text>
                        <Text style={{ marginLeft: 8, color: '#FFD700', fontWeight: 'bold' }}>★ {recipe.score ?? 4.8}</Text>
                        <Text style={{ marginLeft: 6, color: '#bbb' }}>(94 Reviews)</Text>
                    </View>

                    {/* Nutrition Info (colored chart) */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                        <View style={{ borderRadius: 999, backgroundColor: '#fff', padding: 24, alignItems: 'center', justifyContent: 'center', width: 100, height: 100, borderWidth: 1, borderColor: '#eee', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111' }}>550</Text>
                            <Text style={{ color: '#888', fontSize: 12 }}>kcal/serv</Text>
                        </View>
                        <View style={{ marginLeft: 24 }}>
                            <Text style={{ color: '#7DD36E', fontWeight: 'bold', fontSize: 15 }}>protein 40%</Text>
                            <Text style={{ color: '#4FC3F7', fontWeight: 'bold', fontSize: 15 }}>fat 50%</Text>
                            <Text style={{ color: '#90A4AE', fontWeight: 'bold', fontSize: 15 }}>carb 10%</Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#f5f5f5', borderRadius: 16, marginBottom: 24 }}>
                        <TouchableOpacity
                            style={{ flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: activeTab === 'ingredients' ? '#fff' : 'transparent' }}
                            onPress={() => setActiveTab('ingredients')}
                        >
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: activeTab === 'ingredients' ? '#111' : '#888' }}>
                                Ingredients
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: activeTab === 'instructions' ? '#fff' : 'transparent' }}
                            onPress={() => setActiveTab('instructions')}
                        >
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: activeTab === 'instructions' ? '#111' : '#888' }}>
                                Instructions
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tab Content */}
                    {activeTab === 'ingredients' ? (
                        <View>
                            <Text style={{ color: '#888', marginBottom: 8 }}>Ingredients for <Text style={{ fontWeight: 'bold', color: '#111' }}>4 servings</Text></Text>
                            {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                recipe.ingredients.map((ing: string, idx: number) => (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }} key={idx}>
                                        <Text style={{ color: '#111' }}>{ing}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={{ color: '#bbb' }}>No ingredients found.</Text>
                            )}
                        </View>
                    ) : (
                        <View>
                            {recipe.instructions ? (
                                recipe.instructions.split('\n').map((ins: string, idx: number) => (
                                    <Text style={{ marginBottom: 12, color: '#111' }} key={idx}>{ins.trim()}</Text>
                                ))
                            ) : (
                                <Text style={{ color: '#bbb' }}>No instructions available.</Text>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RecipeDetail;

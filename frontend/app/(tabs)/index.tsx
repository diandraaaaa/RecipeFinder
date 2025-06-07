import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router'; // ← for navigation
import { Feather } from '@expo/vector-icons';

import { fetchRecipes, fetchRecommendations } from '@/services/api';
import SearchBar from '@/components/SearchBar';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/interfaces/interfaces';

const sections = ['Popular', 'Vegan', 'Vegetarian', 'Pescatarian', 'Omnivore', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];

const Index = () => {
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState('Popular');

    useEffect(() => {
        (async () => {
            const data = await fetchRecipes();
            setRecipes(data);
            setLoading(false);
        })();
    }, []);

    // Call recommendations API every time search changes
    useEffect(() => {
        if (!search.trim()) return;
        const ingredients = search.split(/[, ]+/).map(s => s.trim()).filter(Boolean);
        setLoading(true);
        fetchRecommendations(ingredients)
            .then(data => {
                // Filter recipes based on selected section
                const filteredData = data.filter((recipe: Recipe) => {
                    if (selectedSection === 'Popular') return true;
                    return recipe.category?.toLowerCase() === selectedSection.toLowerCase();
                });
                setRecipes(filteredData);
            })
            .catch(() => setRecipes([]))
            .finally(() => setLoading(false));
    }, [search, selectedSection]);

    // Fetch by section
    const handleSectionPress = async (section: string) => {
        setSelectedSection(section);
        setLoading(true);
        try {
            const data = await fetchRecipes({ category: section.toLowerCase() });
            setRecipes(data);
        } catch (err) {
            setRecipes([]);
        }
        setLoading(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            >
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

                {/* Title */}
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111', marginTop: 18, lineHeight: 30 }}>
                    Reduce food waste,{"\n"} cook smart at{" "}
                    <Text style={{ color: '#4caf50', fontWeight: 'bold' }}>home</Text>
                </Text>

                {/* Search Bar */}
                <View className="mt-6">
                    <SearchBar
                        placeholder={`Search ${selectedSection} recipes`}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Section Selector */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={{ marginTop: 24 }}
                    contentContainerStyle={{ paddingRight: 20 }}
                >
                    {sections.map((section) => (
                        <TouchableOpacity
                            key={section}
                            style={{
                                backgroundColor: selectedSection === section ? '#111' : '#fff',
                                borderRadius: 18,
                                paddingVertical: 8,
                                paddingHorizontal: 18,
                                marginRight: 12,
                                borderWidth: 1,
                                borderColor: '#eee',
                            }}
                            onPress={() => handleSectionPress(section)}
                        >
                            <Text style={{ color: selectedSection === section ? '#fff' : '#111', fontWeight: 'bold', fontSize: 15 }}>{section}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Section Title */}
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222', marginTop: 32, marginBottom: 12 }}>
                    {selectedSection} Recipes
                </Text>

                {/* Recipe Grid */}
                {loading ? (
                    <ActivityIndicator size="large" color="#111" className="mt-12" />
                ) : (
                    <FlatList
                        data={recipes}
                        renderItem={({ item }) => <RecipeCard {...item} />}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        scrollEnabled={false}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Index;

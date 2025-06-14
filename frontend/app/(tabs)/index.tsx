import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

import { fetchRecipes, fetchRecommendations, toggleFavorite} from '@/services/api';
import SearchBar from '@/components/SearchBar';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/interfaces/interfaces';
import { useAuth } from '@/context/AuthContex';

const sections = ['Popular', 'Vegan', 'Vegetarian', 'Pescatarian', 'Omnivore', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];


const Index = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState('Popular');
    const [favorites, setFavorites] = useState<number[]>([]);

    const { user, session, signout } = useAuth();

    // Load recipes
    useEffect(() => {
        setLoading(true);
        (async () => {
            if (search.trim()) {
                const ingredients = search.split(/[, ]+/).map(s => s.trim()).filter(Boolean);
                const recs = await fetchRecommendations(ingredients);
                const filtered = selectedSection === 'Popular'
                    ? recs
                    : recs.filter(r =>
                        r.category?.toLowerCase() === selectedSection.toLowerCase()
                    );
                setRecipes(filtered);
            } else {
                const data = await fetchRecipes(
                    selectedSection === 'Popular' ? {} : { category: selectedSection.toLowerCase() }
                );
                setRecipes(data);
            }
            setLoading(false);
        })();
    }, [search, selectedSection]);

    const handleSectionPress = (section: string) => {
        setSelectedSection(section);
        setSearch('');
    };

    const handleToggleFavorite = async (id: number) => {
        if (!user) return;
        const updatedFavorites = await toggleFavorite(user.$id, id);
        setFavorites(updatedFavorites);
    };

    if (!session) return <Redirect href="/login" />;
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            >
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

                {/* Title */}
                <Text className="text-[22px] font-bold text-[#111] mt-[18px] leading-[30px]">
                    Reduce food waste,{"\n"} cook smart at
                    <Text className="text-green-600 font-bold"> home</Text>
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
                            className={`rounded-[18px] py-2 px-4 mr-3 border border-[#eee] ${selectedSection === section ? "bg-[#111]" : "bg-[#fff]"}`}
                            onPress={() => handleSectionPress(section)}
                        >
                            <Text className={`font-bold text-[15px] ${selectedSection === section ? "text-white" : "text-[#111]"}`}>
                                {section}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Section Title */}
                <Text className="text-[16px] font-bold text-[#222] mt-8 mb-3">
                    {selectedSection} Recipes
                </Text>

                {/* Recipe Grid */}
                {loading ? (
                    <ActivityIndicator size="large" color="#111" className="mt-12" />
                ) : (
                    <FlatList
                        data={recipes}
                        renderItem={({ item }) => (
                            <RecipeCard
                                {...item}
                                isFavorite={favorites.includes(item.id)}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        )}
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

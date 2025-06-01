// app/index.tsx
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router'; // ← for navigation

import { fetchRecipes } from '@/services/api';
import SearchBar from '@/components/SearchBar';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/interfaces/interfaces';

const Home = () => {
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const data = await fetchRecipes();
            setRecipes(data);
            setLoading(false);
        })();
    }, []);

    const filtered = recipes.filter((r) =>
        !search.trim() || r.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            >
                {/* — Tagline Section — */}
                <View className="mt-8">
                    <Text className="text-5xl font-extrabold text-black">Cooking</Text>
                    <Text className="text-4xl font-extrabold text-gray-400 -mt-1">
                        Delicious Like a Chef
                    </Text>
                </View>

                {/* — Search Bar: tapping pushes to "/search" — */}
                <View className="mt-6">
                    <SearchBar
                        placeholder="Search Food, groceries, drink, etc."
                        value={search}
                        onChangeText={setSearch}
                        onPress={() => router.push('/search')}
                    />
                </View>

                {/* — “Popular Now” Header — */}
                <Text className="text-lg font-bold text-black mt-8 mb-4">
                    Popular Now
                </Text>

                {/* — Recipe Grid — */}
                {loading ? (
                    <ActivityIndicator size="large" color="#111" className="mt-12" />
                ) : (
                    <FlatList
                        data={filtered}
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

export default Home;

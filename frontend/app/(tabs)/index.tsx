// app/index.tsx
import {
    View,
    Text,
    Image,
    FlatList,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';

import { fetchRecipes } from '@/services/api';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';

import SearchBar from '@/components/SearchBar';
import RecipeCard from '@/components/RecipeCard';
import {Recipe} from "@/interfaces/interfaces";

const Home = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const data = await fetchRecipes();
                setRecipes(data);
                setFilteredRecipes(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load recipes');
            } finally {
                setLoading(false);
            }
        };

        loadRecipes();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredRecipes(recipes);
        } else {
            const filtered = recipes.filter((r) =>
                r.name.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredRecipes(filtered);
        }
    }, [search, recipes]);

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="absolute w-full z-0"
                resizeMode="cover"
            />

            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ minHeight: '100%', paddingBottom: 10 }}
            >
                <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

                <SearchBar
                    placeholder="Search for a recipe"
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#FF8C42" className="mt-10" />
                ) : error ? (
                    <Text className="text-red-400 mt-10 text-center">{error}</Text>
                ) : (
                    <>
                        <Text className="text-lg text-white font-bold mt-5 mb-3">
                            Recipes
                        </Text>

                        <FlatList
                            data={filteredRecipes}
                            renderItem={({ item }) => <RecipeCard {...item} />}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}
                            columnWrapperStyle={{
                                justifyContent: 'space-between',
                            }}
                            className="pb-32"
                            scrollEnabled={false}
                        />
                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default Home;

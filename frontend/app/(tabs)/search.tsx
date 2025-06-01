// app/search/index.tsx
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';

const POPULAR_INGREDIENTS = [
    'Chicken',
    'Egg',
    'Pasta',
    'Rice',
    'Beef Mince',
    'Broccoli',
    'Tofu',
    'Salmon',
    'Spinach',
    'Milk',
    'Quinoa',
    'Canned Tomato',
    'Pork',
    'Beef',
    'Lamb',
    'Mushroom',
    'Potato',
    'Tomato',
    'Onion',
    'Garlic',
    // …you can add more strings here as needed
];

export default function SearchByIngredients() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<string[]>([]);

    // Filter POPULAR list by query
    const filteredList = useMemo(() => {
        if (!query.trim()) return POPULAR_INGREDIENTS;
        return POPULAR_INGREDIENTS.filter((ing) =>
            ing.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    const toggleSelect = (item: string) => {
        setSelected((prev) =>
            prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
        );
    };

    const clearAll = () => setSelected([]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* — Top Bar with “Back” button — */}
            <View className="flex-row items-center px-4 py-2 border-b border-gray-200">
                <TouchableOpacity
                    className="p-2"
                    activeOpacity={0.6}
                    onPress={() => router.back()}
                >
                    <Text className="text-2xl text-black">←</Text>
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black ml-2">
                    Search by ingredients
                </Text>
            </View>

            {/* — Search Input */}
            <View className="px-4 py-3 border-b border-gray-200">
                <TextInput
                    className="bg-gray-100 rounded-full px-4 py-2 text-black text-base"
                    placeholder="What’s in your pantry?"
                    placeholderTextColor="#666"
                    value={query}
                    onChangeText={setQuery}
                />
            </View>

            {/* — Selected Row — */}
            {selected.length > 0 && (
                <View className="px-4 py-3">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-gray-800 font-medium">Selected</Text>
                        <TouchableOpacity activeOpacity={0.6} onPress={clearAll}>
                            <Text className="text-blue-600 font-medium">Clear all</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mt-2"
                    >
                        {selected.map((item) => (
                            <View
                                key={item}
                                className="flex-row items-center bg-gray-100 rounded-full px-3 py-1 mr-2"
                            >
                                <Text className="text-gray-800 text-sm">{item}</Text>
                                <TouchableOpacity
                                    onPress={() => toggleSelect(item)}
                                    className="ml-2"
                                >
                                    <Text className="text-gray-500 font-bold">×</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* — Scrollable “Popular” Grid — */}
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                <Text className="text-gray-800 font-medium text-lg mb-3">
                    Popular
                </Text>

                <View className="flex-row flex-wrap justify-between">
                    {filteredList.map((item) => {
                        const isSelected = selected.includes(item);
                        return (
                            <TouchableOpacity
                                key={item}
                                onPress={() => toggleSelect(item)}
                                activeOpacity={0.7}
                                className="w-1/3 mb-6 items-center"
                            >
                                {/* — Placeholder circle: if selected, dark border, else light border — */}
                                <View
                                    className={`w-16 h-16 rounded-full justify-center items-center border ${
                                        isSelected ? 'border-black' : 'border-gray-300'
                                    }`}
                                >
                                    {/* We use the first letter of the ingredient as a stand‐in “icon” */}
                                    <Text className="text-xl font-semibold text-gray-800">
                                        {item.charAt(0)}
                                    </Text>
                                </View>
                                <Text
                                    className={`mt-2 text-center text-sm ${
                                        isSelected ? 'text-black font-medium' : 'text-gray-500'
                                    }`}
                                    numberOfLines={2}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* — “Apply” Button stuck to the bottom — */}
            <TouchableOpacity
                onPress={() => {
                    // You can read `selected` here and call your backend / pass back to Home etc.
                    // For now, just console.warn or dismiss:
                    console.log('Chosen ingredients →', selected);
                    router.back();
                }}
                className="bg-black py-4 items-center justify-center"
            >
                <Text className="text-white font-bold text-base">Apply</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

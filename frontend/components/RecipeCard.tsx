import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";

interface RecipeCardProps {
    id: number;
    name: string;
    minutes: number;
    score?: number;
    ingredients?: string[];
    servings?: number;
    category?: string;
    isFavorite: boolean;
    onToggleFavorite: (id: number) => void;
}

const RecipeCard = ({
                        id, name, minutes, score, ingredients, servings, category,
                        isFavorite, onToggleFavorite
                    }: RecipeCardProps) => {
    const sanitizedName = name.replace(/[^a-zA-Z0-9 ]/g, "");
    const imgUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";

    return (
        <Link href={`/recipes/${id}`} asChild>
            <TouchableOpacity
                className="bg-white rounded-2xl mb-4 w-[48%] shadow-sm"
                style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 3,
                }}
            >
                <Image
                    source={{ uri: imgUrl }}
                    className="w-full h-32 rounded-t-2xl"
                    resizeMode="cover"
                />
                <View className="p-4">
                    <Text className="text-base font-bold text-[#151312] mb-1" numberOfLines={1}>
                        {name}
                    </Text>
                    {category && (
                        <Text className="text-xs text-green-600 mb-1 font-medium">
                            {category}
                        </Text>
                    )}
                    <View className="flex-row items-center mb-1">
                        <Feather name="clock" size={14} color="#888" />
                        <Text className="text-xs text-gray-500 ml-1">{minutes} min</Text>
                        {ingredients && (
                            <>
                                <Feather name="list" size={14} color="#888" style={{ marginLeft: 12 }} />
                                <Text className="text-xs text-gray-500 ml-1">
                                    {ingredients.length} ingredients
                                </Text>
                            </>
                        )}
                    </View>
                    {servings && (
                        <Text className="text-xs text-gray-400 mb-1">Serves {servings}</Text>
                    )}
                    {/* Score & Heart */}
                    <View className="flex-row justify-end mt-2 items-center">
                        {score !== undefined && (
                            <Text className="text-xs text-yellow-400 font-bold mr-2">★ {score}</Text>
                        )}
                        <TouchableOpacity onPress={(e) => {
                            e.preventDefault(); // prevent navigating when tapping heart
                            onToggleFavorite(id);
                        }}>
                            <FontAwesome
                                name={isFavorite ? "heart" : "heart-o"}
                                size={16}
                                color={isFavorite ? "#ef4444" : "#d0d0d0"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default RecipeCard;

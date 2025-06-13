import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";

interface RecipeCardProps {
    id: number;
    title: string;
    ingredients?: string[] | string;
    total_time: number;
    rating?: number;
    image?: string;
    diet?: string;
    isFavorite: boolean;
    onToggleFavorite: (id: number) => void;
}

const RecipeCard = ({
                        id,
                        title,
                        ingredients,
                        total_time,
                        rating,
                        diet,
                        image,
                        isFavorite,
                        onToggleFavorite,
                    }: RecipeCardProps) => {
    // --- Fix ingredients if it's still a string
    let fixedIngredients: string[] | undefined = ingredients as string[];
    if (ingredients && typeof ingredients === "string") {
        try {
            fixedIngredients = JSON.parse((ingredients as string).replace(/'/g, '"'));
        } catch {
            fixedIngredients = [ingredients as string];
        }
    }
    const fallbackImage =
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
    const imgUrl = image && image.startsWith("http") ? image : fallbackImage;

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
                        {title}
                    </Text>

                    {diet && (
                        <Text className="text-xs text-green-600 mb-1 font-medium">
                            {diet}
                        </Text>
                    )}

                    <View className="flex-row items-center mb-1">
                        <Feather name="clock" size={14} color="#888" />
                        <Text className="text-xs text-gray-500 ml-1">{total_time} min</Text>
                        {fixedIngredients && (
                            <>
                                <Feather name="list" size={14} color="#888" style={{ marginLeft: 12 }} />
                                <Text className="text-xs text-gray-500 ml-1">
                                    {fixedIngredients.length} ingredien
                                </Text>
                            </>
                        )}
                    </View>

                    <View className="flex-row justify-end mt-2 items-center">
                        {rating !== undefined && (
                            <Text className="text-xs text-yellow-400 font-bold mr-2">★ {rating.toFixed(1)}</Text>
                        )}
                        <TouchableOpacity
                            onPress={(e) => {
                                e.preventDefault();
                                onToggleFavorite(id);
                            }}
                        >
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

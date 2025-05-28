import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";

interface RecipeCardProps {
    id: number;
    name: string;
    minutes: number;
    score?: number;
}

const RecipeCard = ({ id, name, minutes, score }: RecipeCardProps) => {
    const imgUrl = `https://source.unsplash.com/600x400/?food,${encodeURIComponent(name)}`;

    return (
        <Link href={`/recipes/${id}`} asChild>
            <TouchableOpacity className="w-[48%] mb-4">
                <Image
                    source={{ uri: imgUrl }}
                    className="w-full h-40 rounded-xl"
                    resizeMode="cover"
                />

                <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
                    {name}
                </Text>

                <View className="flex-row justify-between mt-1">
                    <Text className="text-xs text-orange-400 font-medium">
                        ⏱ {minutes} min
                    </Text>
                    {score !== undefined && (
                        <Text className="text-xs text-pink-400 font-medium">
                            ⭐ {score}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default RecipeCard;

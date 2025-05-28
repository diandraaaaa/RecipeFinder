import { Link } from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import { View, Text, TouchableOpacity, Image } from "react-native";

interface TrendingRecipeCardProps {
    recipe: {
        id: number;
        name: string;
    };
    index: number;
}

const TrendingRecipeCard = ({ recipe, index }: TrendingRecipeCardProps) => {
    const imageUrl = `https://source.unsplash.com/400x600/?food,${encodeURIComponent(recipe.name)}`;

    return (
        <Link href={`/recipes/${recipe.id}`} asChild>
            <TouchableOpacity className="w-32 relative pl-5">
                <Image
                    source={{ uri: imageUrl }}
                    className="w-32 h-48 rounded-lg"
                    resizeMode="cover"
                />

                <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
                    <MaskedView
                        maskElement={
                            <Text className="font-bold text-white text-6xl">{index + 1}</Text>
                        }
                    >
                        <Image
                            source={require("@/assets/images/ranking-gradient.png")} // Update this path if needed
                            className="w-14 h-14"
                            resizeMode="cover"
                        />
                    </MaskedView>
                </View>

                <Text
                    className="text-sm font-bold mt-2 text-pink-100"
                    numberOfLines={2}
                >
                    {recipe.name}
                </Text>
            </TouchableOpacity>
        </Link>
    );
};

export default TrendingRecipeCard;

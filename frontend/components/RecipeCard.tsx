import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons"; // Use Feather icons for a modern look

interface RecipeCardProps {
    id: number;
    name: string;
    minutes: number;
    score?: number;
    ingredients?: string[];
    servings?: number;
}

const RecipeCard = ({ id, name, minutes, score, ingredients, servings }: RecipeCardProps) => {
    const sanitizedName = name.replace(/[^a-zA-Z0-9 ]/g, "");
    const imgUrl =`https://via.placeholder.com/600x400.png?text=${encodeURIComponent(name)}`;

    return (
        <Link href={`/recipes/${id}`} asChild>
            <TouchableOpacity
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 22,
                    marginBottom: 18,
                    width: "48%",
                    shadowColor: "#000",
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 3,
                }}
            >
                <Image
                    source={{ uri: imgUrl }}
                    style={{
                        width: "100%",
                        height: 120,
                        borderTopLeftRadius: 22,
                        borderTopRightRadius: 22,
                    }}
                    resizeMode="cover"
                />
                <View style={{ padding: 14 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#151312",
                            marginBottom: 6,
                        }}
                        numberOfLines={1}
                    >
                        {name}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <Feather name="clock" size={14} color="#888" />
                        <Text style={{ fontSize: 12, color: "#888", marginLeft: 5 }}>
                            {minutes} min
                        </Text>
                        {ingredients && (
                            <>
                                <Feather name="list" size={14} color="#888" style={{ marginLeft: 12 }} />
                                <Text style={{ fontSize: 12, color: "#888", marginLeft: 5 }}>
                                    {ingredients.length} ingredients
                                </Text>
                            </>
                        )}
                    </View>
                    {/* Optional: servings */}
                    {servings && (
                        <Text style={{ fontSize: 12, color: "#aaa", marginBottom: 3 }}>
                            Serves {servings}
                        </Text>
                    )}
                    {/* Optional: Score/Favorite */}
                    <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 6 }}>
                        {score !== undefined && (
                            <Text style={{ fontSize: 12, color: "#FFD700", fontWeight: "bold", marginRight: 4 }}>
                                ★ {score}
                            </Text>
                        )}
                        {/* Placeholder for heart/favorite */}
                        <Feather name="heart" size={16} color="#d0d0d0" />
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default RecipeCard;

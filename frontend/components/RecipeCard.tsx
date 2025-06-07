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
    category?: string;
}

const RecipeCard = ({ id, name, minutes, score, ingredients, servings, category }: RecipeCardProps) => {
    const sanitizedName = name.replace(/[^a-zA-Z0-9 ]/g, "");
    const imgUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";

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
                    {category && (
                        <Text style={{ fontSize: 12, color: "#4caf50", marginBottom: 6, fontWeight: "500" }}>
                            {category}
                        </Text>
                    )}
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

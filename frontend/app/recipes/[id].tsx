import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RecipeDetail() {
    const { id } = useLocalSearchParams();

    return (
        <View className="p-5">
            <Text className="text-white text-lg">Recipe ID: {id}</Text>
        </View>
    );
}

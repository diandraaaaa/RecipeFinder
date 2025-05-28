import { View, TextInput, Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants/icons";

interface Props {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
}

const SearchBar = ({ placeholder, value, onChangeText, onPress }: Props) => {
    return (
        <View className="flex-row items-center bg-[#2A2A2A] rounded-full px-5 py-3">
            <Image
                source={icons.search}
                className="w-5 h-5"
                resizeMode="contain"
                tintColor="#FF8C42"
            />
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                onTouchStart={onPress}
                className="flex-1 ml-2 text-white"
                placeholderTextColor="#F0BFCF"
            />
        </View>
    );
};

export default SearchBar;

// components/SearchBar.tsx
import { View, TextInput, Image, TouchableOpacity } from 'react-native';
import { icons } from '@/constants/icons'; // can be any search icon you already have

interface Props {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void; // ← optional navigation callback
}

const SearchBar = ({ placeholder, value, onChangeText, onPress }: Props) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
                <Image
                    source={icons.search}
                    className="w-5 h-5"
                    tintColor="#111"
                    resizeMode="contain"
                />
                <TextInput
                    className="flex-1 ml-3 text-black text-base"
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChangeText}
                    // If you want actual typing here, remove onPress from TouchableOpacity
                    // and directly render TextInput. But for a “go‐to‐search‐screen” pattern,
                    // we intercept taps and push to a new route instead of typing in Home.
                />
            </View>
        </TouchableOpacity>
    );
};

export default SearchBar;

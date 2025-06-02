// components/SearchBar.tsx
import { View, TextInput, Image } from 'react-native';
import { icons } from '@/constants/icons'; // can be any search icon you already have

interface Props {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
}

const SearchBar = ({ placeholder, value, onChangeText }: Props) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}>
            <Image
                source={icons.search}
                style={{ width: 18, height: 18, tintColor: '#111' }}
                resizeMode="contain"
            />
            <TextInput
                style={{ flex: 1, marginLeft: 10, color: '#111', fontSize: 14, backgroundColor: 'transparent' }}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
};

export default SearchBar;

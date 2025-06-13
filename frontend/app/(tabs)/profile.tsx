import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,} from 'react-native';
import { useEffect, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContex';
import { database } from '@/lib/appwriteConfig';
import { Query } from 'react-native-appwrite';

const Profile = () => {
    const router = useRouter();
    const { user, session, signout } = useAuth();
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const response = await database.listDocuments(
                    "684408f0002252e5e9c5",
                    "684408fd0018251c68e0",
                    [Query.equal('user_id', user.$id)]
                );
                setFavoriteCount(response.total);
            } catch (error) {
                console.error('Failed to fetch favorite count:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    if (!session) return <Redirect href="/login" />;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="px-6 pt-6">
                    <Text className="text-2xl font-bold text-gray-800">Profile</Text>
                </View>

                {/* Profile Info */}
                <View className="items-center mt-6 px-6">
                    <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-4">
                        {user?.name ? (
                            <Text className="text-3xl font-bold text-green-600">
                                {user.name.charAt(0).toUpperCase()}
                            </Text>
                        ) : (
                            <Feather name="user" size={40} color="#16a34a" />
                        )}
                    </View>
                    <Text className="text-xl font-bold text-gray-800">{user?.name}</Text>
                    <Text className="text-gray-500 mt-1">{user?.email}</Text>
                    <Text className="text-gray-400 text-sm mt-1">
                        Joined {formatDate(user?.$createdAt || '')}
                    </Text>
                </View>

                {/* Stats */}
                <View className="flex-row justify-around mt-8 px-6">
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-green-600">{favoriteCount}</Text>
                        <Text className="text-gray-500">Favorites</Text>
                    </View>
                </View>

                {/* Settings */}
                <View className="mt-8 px-6">
                    <Text className="text-2xl font-semibold text-gray-800 mb-4">Settings</Text>
                    
                    <TouchableOpacity 
                        onPress={() => router.push('/edit-profile')}
                        className="flex-row items-center py-4 border-b border-gray-200"
                    >
                        <MaterialIcons name="edit" size={24} color="#16a34a" />
                        <Text className="text-gray-700 ml-4 flex-1">Edit Profile</Text>
                        <Feather name="chevron-right" size={20} color="#16a34a" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
                        <Ionicons name="notifications-outline" size={24} color="#16a34a" />
                        <Text className="text-gray-700 ml-4 flex-1">Notifications</Text>
                        <Feather name="chevron-right" size={20} color="#16a34a" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
                        <Ionicons name="lock-closed-outline" size={24} color="#16a34a" />
                        <Text className="text-gray-700 ml-4 flex-1">Privacy</Text>
                        <Feather name="chevron-right" size={20} color="#16a34a" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
                        <Ionicons name="help-circle-outline" size={24} color="#16a34a" />
                        <Text className="text-gray-700 ml-4 flex-1">Help & Support</Text>
                        <Feather name="chevron-right" size={20} color="#16a34a" />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity 
                    onPress={signout}
                    className="mx-6 mt-8 mb-8 bg-green-600 py-3 rounded-lg"
                >
                    <Text className="text-white text-center font-semibold py-3">Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;

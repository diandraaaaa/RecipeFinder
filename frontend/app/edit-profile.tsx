import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContex';
import { account } from '@/lib/appwriteConfig';

const EditProfile = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleUpdateProfile = async () => {
        if (!user) return;
        
        setLoading(true);
        setError('');

        try {
            // Update name
            if (name !== user.name) {
                await account.updateName(name);
            }

            // Update email if changed
            if (email !== user.email) {
                await account.updateEmail(email, currentPassword);
            }

            // Update password if provided
            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    setError('New passwords do not match');
                    return;
                }
                await account.updatePassword(newPassword, currentPassword);
            }

            router.back();
        } catch (error: any) {
            setError(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center px-6 pt-6 pb-4 border-b border-gray-200">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="#16a34a" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800 ml-4">Edit Profile</Text>
                </View>

                {/* Form */}
                <View className="px-6 mt-6">
                    {error ? (
                        <Text className="text-red-500 mb-4">{error}</Text>
                    ) : null}

                    {/* Name */}
                    <View className="mb-6">
                        <Text className="text-gray-700 mb-2">Name</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3"
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                        />
                    </View>

                    {/* Email */}
                    <View className="mb-6">
                        <Text className="text-gray-700 mb-2">Email</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Current Password */}
                    <View className="mb-6">
                        <Text className="text-gray-700 mb-2">Current Password</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Enter current password"
                            secureTextEntry
                        />
                    </View>

                    {/* New Password */}
                    <View className="mb-6">
                        <Text className="text-gray-700 mb-2">New Password</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Enter new password"
                            secureTextEntry
                        />
                    </View>

                    {/* Confirm New Password */}
                    <View className="mb-6">
                        <Text className="text-gray-700 mb-2">Confirm New Password</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm new password"
                            secureTextEntry
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleUpdateProfile}
                        disabled={loading}
                        className="bg-green-600 py-3 rounded-lg mt-4 mb-8"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-center font-semibold">
                                Save Changes
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile; 
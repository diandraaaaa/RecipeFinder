import {Redirect, Tabs} from "expo-router";
import { Image, Text, View} from "react-native";
import { icons } from "@/constants/icons";
import { useAuth } from '@/context/AuthContex';

const sections = [
    { name: "index", title: "Home", icon: icons.home },
    { name: "search", title: "Search", icon: icons.search },
    { name: "favorites", title: "Save", icon: icons.save },
    { name: "profile", title: "Profile", icon: icons.person },
];

function TabIcon({ focused, icon, title }: any) {
    return (
        <View className={
            focused
                ? "flex-row w-full flex-1 min-w-[112px] min-h-[56px] mt-4 justify-center items-center rounded-full bg-gray-200 overflow-hidden"
                : "w-full h-full justify-center items-center mt-4 rounded-full"
        }>
            <Image
                source={icon}
                style={{ width: 20, height: 20 }}
                tintColor={focused ? "#059669" : "#A8B5BB"}
            />
            {focused && (
                <Text className="font-semibold text-base ml-2 text-green-600">
                    {title}
                </Text>
            )}
        </View>
    );
}

export default function TabsLayout() {
    const { session } = useAuth();
    if (!session) return <Redirect href="/login" />;

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarStyle: {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 50,
                    marginHorizontal: 20,
                    marginBottom: 36,
                    height: 52,
                    position: 'absolute',
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: '#e0e0e0',
                },
            }}
        >
            {sections.map((section) => (
                <Tabs.Screen
                    key={section.name}
                    name={section.name}
                    options={{
                        title: section.title,
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={section.icon} title={section.title} />
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
}

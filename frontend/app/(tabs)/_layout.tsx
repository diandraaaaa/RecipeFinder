import { Tabs } from "expo-router";
import { ImageBackground, Image, Text, View } from "react-native";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";


function TabIcon({ focused, icon, title }: any) {
    if (focused) {
        return (
            <View
                style={{ flexDirection: 'row', width: '100%', flex: 1, minWidth: 112, minHeight: 56, marginTop: 16, justifyContent: 'center', alignItems: 'center', borderRadius: 999, overflow: 'hidden', backgroundColor: '#e0e0e0' }}
            >
                <Image source={icon} tintColor="#151312" style={{ width: 20, height: 20 }} />
                <Text style={{ color: '#222', fontWeight: '600', fontSize: 16, marginLeft: 8 }}>{title}</Text>
            </View>
        );
    }
    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 16, borderRadius: 999 }}>
            <Image source={icon} tintColor="#A8B5BB" style={{ width: 20, height: 20 }} />
        </View>
    );
}

export default function TabsLayout() {
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
                tabBarBackground: undefined,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.home} title="Home" />
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.search} title="Search" />
                    ),
                }}
            />

            <Tabs.Screen
                name="favorites"
                options={{
                    title: "Save",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.save} title="Save" />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.person} title="Profile" />
                    ),
                }}
            />
        </Tabs>
    );
}
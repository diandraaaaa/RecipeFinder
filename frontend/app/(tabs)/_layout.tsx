import {Redirect, Tabs} from "expo-router";
import { Image, Text, View} from "react-native";

import { icons } from "@/constants/icons";
import { useAuth } from '@/context/AuthContex'

const sections = [
    { name: "index", title: "Home", icon: icons.home },
    { name: "search", title: "Search", icon: icons.search },
    { name: "favorites", title: "Save", icon: icons.save },
    { name: "profile", title: "Profile", icon: icons.person },
];

function TabIcon({ focused, icon, title }: any) {
    if (focused) {
        return (
            <View
                style={{ flexDirection: 'row', width: '100%', flex: 1, minWidth: 112, minHeight: 56, marginTop: 16, justifyContent: 'center', alignItems: 'center', borderRadius: 999, overflow: 'hidden', backgroundColor: '#e0e0e0' }}
            >
                <Image source={icon} tintColor="#000000" style={{ width: 20, height: 20 }} />
                <Text style={{ color: '#000000', fontWeight: '600', fontSize: 16, marginLeft: 8 }}>{title}</Text>
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
    const session = useAuth();
    return !session ? <Redirect  href="/login"/> :
     (
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
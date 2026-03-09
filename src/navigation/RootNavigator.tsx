import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import RecentScreen from '../screens/RecentScreen';
import SettingsStack from './SettingsStack';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';

export type RootTabParamList = {
    Home: undefined;
    Recent: undefined;
    Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
    Home: { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
    Recent: { active: 'time', inactive: 'time-outline' },
    Settings: { active: 'settings', inactive: 'settings-outline' },
};

export default function RootNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = TAB_ICONS[route.name];
                    const iconName = focused ? icons.active : icons.inactive;
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.tabInactive,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabLabel,
                tabBarItemStyle: styles.tabItem,
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.white,
                headerTitleStyle: { fontWeight: '700', fontSize: FONT_SIZES.lg },
                headerShadowVisible: false,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'QuickChat WA',
                    tabBarLabel: 'Message',
                }}
            />
            <Tab.Screen
                name="Recent"
                component={RecentScreen}
                options={{
                    title: 'Recent Numbers',
                    tabBarLabel: 'Recent',
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsStack}
                options={{
                    title: 'Settings',
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        height: Platform.OS === 'ios' ? 85 : 60,
        paddingBottom: Platform.OS === 'ios' ? 20 : SPACING.sm,
        paddingTop: SPACING.sm,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
    },
    tabLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
    },
    tabItem: {
        paddingTop: 2,
    },
});

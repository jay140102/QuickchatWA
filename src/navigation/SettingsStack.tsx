import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/SettingsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import { COLORS, FONT_SIZES } from '../constants/theme';

export type SettingsStackParamList = {
    SettingsMain: undefined;
    PrivacyPolicy: undefined;
    TermsConditions: undefined;
    ContactUs: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const commonHeaderStyle = {
    headerStyle: { backgroundColor: COLORS.primary },
    headerTintColor: COLORS.white,
    headerTitleStyle: { fontWeight: '700' as const, fontSize: FONT_SIZES.lg },
    headerShadowVisible: false,
};

export default function SettingsStack() {
    return (
        <Stack.Navigator screenOptions={commonHeaderStyle}>
            <Stack.Screen
                name="SettingsMain"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
            />
            <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicyScreen}
                options={{ title: 'Privacy Policy' }}
            />
            <Stack.Screen
                name="TermsConditions"
                component={TermsConditionsScreen}
                options={{ title: 'Terms & Conditions' }}
            />
            <Stack.Screen
                name="ContactUs"
                component={ContactUsScreen}
                options={{ title: 'Contact Us' }}
            />
        </Stack.Navigator>
    );
}

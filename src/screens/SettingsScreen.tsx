import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Linking,
    Share,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import { APP_CONFIG } from '../constants';

type SettingsStackParamList = {
    SettingsMain: undefined;
    PrivacyPolicy: undefined;
    TermsConditions: undefined;
    ContactUs: undefined;
};

interface SettingsItem {
    id: string;
    icon: string;
    label: string;
    subtitle?: string;
    onPress: () => void;
    color?: string;
    showChevron?: boolean;
}

export default function SettingsScreen() {
    const navigation = useNavigation<NavigationProp<SettingsStackParamList>>();

    const settingsGroups: { title: string; items: SettingsItem[] }[] = [
        {
            title: 'Legal',
            items: [
                {
                    id: 'privacy',
                    icon: 'shield-checkmark-outline',
                    label: 'Privacy Policy',
                    subtitle: 'How we handle your data',
                    onPress: () => navigation.navigate('PrivacyPolicy'),
                    showChevron: true,
                },
                {
                    id: 'terms',
                    icon: 'document-text-outline',
                    label: 'Terms & Conditions',
                    subtitle: 'Usage terms and disclaimer',
                    onPress: () => navigation.navigate('TermsConditions'),
                    showChevron: true,
                },
            ],
        },
        {
            title: 'Support',
            items: [
                {
                    id: 'contact',
                    icon: 'mail-outline',
                    label: 'Contact Us',
                    subtitle: 'Get help or send feedback',
                    onPress: () => navigation.navigate('ContactUs'),
                    showChevron: true,
                },
                {
                    id: 'rate',
                    icon: 'star-outline',
                    label: 'Rate the App',
                    subtitle: 'Leave us a review on Google Play',
                    onPress: () =>
                        Linking.openURL(
                            'https://play.google.com/store/apps/details?id=com.quickchatwa.app'
                        ),
                    color: COLORS.warning,
                    showChevron: false,
                },
                {
                    id: 'share',
                    icon: 'share-social-outline',
                    label: 'Share App',
                    subtitle: 'Tell a friend about QuickChat WA',
                    onPress: () => {
                        Share.share({
                            message:
                                'Try QuickChat WA — send WhatsApp messages without saving contacts!\nhttps://play.google.com/store/apps/details?id=com.quickchatwa.app',
                            title: 'QuickChat WA',
                        }).catch(() => { });
                    },
                    color: COLORS.primary,
                    showChevron: false,
                },
            ],
        },
        {
            title: 'App',
            items: [
                {
                    id: 'version',
                    icon: 'information-circle-outline',
                    label: 'App Version',
                    subtitle: `v${APP_CONFIG.version} (Build ${APP_CONFIG.buildNumber})`,
                    onPress: () => { },
                    showChevron: false,
                },
            ],
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Banner */}
                <View style={styles.profileBanner}>
                    <View style={styles.appIconWrap}>
                        <Ionicons name="logo-whatsapp" size={40} color={COLORS.white} />
                    </View>
                    <Text style={styles.appName}>{APP_CONFIG.name}</Text>
                    <Text style={styles.appTagline}>
                        Direct message anyone on WhatsApp, instantly.
                    </Text>
                </View>

                {settingsGroups.map((group) => (
                    <View key={group.title} style={styles.group}>
                        <Text style={styles.groupTitle}>{group.title}</Text>
                        <View style={styles.groupCard}>
                            {group.items.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <TouchableOpacity
                                        style={styles.row}
                                        onPress={item.onPress}
                                        activeOpacity={0.7}
                                        accessibilityLabel={item.label}
                                    >
                                        <View
                                            style={[
                                                styles.rowIconWrap,
                                                { backgroundColor: `${item.color || COLORS.primary}18` },
                                            ]}
                                        >
                                            <Ionicons
                                                name={item.icon as any}
                                                size={20}
                                                color={item.color || COLORS.primary}
                                            />
                                        </View>
                                        <View style={styles.rowContent}>
                                            <Text style={styles.rowLabel}>{item.label}</Text>
                                            {item.subtitle && (
                                                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                                            )}
                                        </View>
                                        {item.showChevron && (
                                            <Ionicons
                                                name="chevron-forward"
                                                size={18}
                                                color={COLORS.textLight}
                                            />
                                        )}
                                    </TouchableOpacity>
                                    {index < group.items.length - 1 && (
                                        <View style={styles.rowDivider} />
                                    )}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                ))}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Made with ❤️ · Not affiliated with WhatsApp Inc.
                    </Text>
                    <Text style={styles.footerVersion}>
                        © 2025 QuickChat WA · All rights reserved
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    profileBanner: {
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
        paddingHorizontal: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    appIconWrap: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    appName: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: -0.5,
    },
    appTagline: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.75)',
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    group: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    groupTitle: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
        color: COLORS.textLight,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
    },
    groupCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md + 2,
        gap: SPACING.md,
    },
    rowIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowContent: {
        flex: 1,
    },
    rowLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    rowSubtitle: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginTop: 1,
    },
    rowDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginLeft: SPACING.lg + 38 + SPACING.md,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
        paddingHorizontal: SPACING.xl,
        gap: SPACING.xs,
    },
    footerText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    footerVersion: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
        textAlign: 'center',
    },
});

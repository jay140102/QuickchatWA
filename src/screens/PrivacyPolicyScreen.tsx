import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

interface PolicySection {
    title: string;
    content: string;
}

const SECTIONS: PolicySection[] = [
    {
        title: '1. Introduction',
        content:
            'Welcome to QuickChat WA ("we," "our," or "the App"). This Privacy Policy explains how we handle information when you use our mobile application. By using the App, you agree to the practices described in this policy.',
    },
    {
        title: '2. Information We Do Not Collect',
        content:
            'QuickChat WA does not collect, store, or transmit any personally identifiable information (PII). We do not register accounts, store phone numbers on our servers, or collect names, emails, or any contact information you enter in the app. All data you enter (phone numbers and messages) is processed locally on your device and sent directly to WhatsApp via deep linking.',
    },
    {
        title: '3. Local Storage',
        content:
            'To provide the "Recent Numbers" feature, the App stores phone numbers locally on your device using AsyncStorage. This data never leaves your device and is not accessible to us or any third party. You can clear this data at any time from within the app.',
    },
    {
        title: '4. Advertising (Google AdMob)',
        content:
            'The App uses Google AdMob to display advertisements. AdMob may collect certain device information for the purpose of serving relevant ads. This includes device identifiers and usage data. We configure AdMob to request non-personalized ads where required. For more information on how Google processes data for advertising, please review Google\'s Privacy Policy at https://policies.google.com/privacy.',
    },
    {
        title: '5. Analytics',
        content:
            'We may use anonymous, aggregated analytics to understand general usage patterns, such as how often the app is opened or what features are used most. This data is entirely anonymous and cannot be linked to any individual user.',
    },
    {
        title: '6. Third-Party Links & Services',
        content:
            'The App communicates with WhatsApp through publicly available deep links (wa.me). When you tap "Open in WhatsApp," you are redirected to WhatsApp, which is subject to its own Privacy Policy and Terms of Service. We are not responsible for the data practices of WhatsApp or any other third-party service.',
    },
    {
        title: '7. Children\'s Privacy',
        content:
            'The App is not directed to children under the age of 13. We do not knowingly collect any personal information from children. If you are a parent or guardian and believe your child has provided personal information through the App, please contact us immediately.',
    },
    {
        title: '8. Changes to This Policy',
        content:
            'We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the "Last Updated" date below. Your continued use of the App after any changes constitutes your acceptance of the updated policy.',
    },
    {
        title: '9. Contact Us',
        content:
            'If you have questions about this Privacy Policy, please contact us at support@quickchatwa.app.',
    },
];

export default function PrivacyPolicyScreen() {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Banner */}
                <View style={styles.banner}>
                    <View style={styles.bannerIcon}>
                        <Ionicons name="shield-checkmark" size={32} color={COLORS.white} />
                    </View>
                    <Text style={styles.bannerTitle}>Privacy Policy</Text>
                    <Text style={styles.bannerDate}>Last Updated: March 2025</Text>
                </View>

                <View style={styles.body}>
                    {SECTIONS.map((section, index) => (
                        <View key={index} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.sectionContent}>{section.content}</Text>
                        </View>
                    ))}
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
    content: {
        paddingBottom: SPACING.xxxl,
    },
    banner: {
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
        paddingHorizontal: SPACING.xl,
    },
    bannerIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    bannerTitle: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: -0.5,
    },
    bannerDate: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.7)',
        marginTop: SPACING.xs,
    },
    body: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        gap: SPACING.md,
    },
    section: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: SPACING.sm,
    },
    sectionContent: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
});

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

interface Section {
    title: string;
    content: string;
}

const SECTIONS: Section[] = [
    {
        title: '1. Acceptance of Terms',
        content:
            'By downloading, installing, or using QuickChat WA ("the App"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the App.',
    },
    {
        title: '2. App Purpose & Usage',
        content:
            'QuickChat WA is a utility application that helps you open WhatsApp conversations with any phone number without needing to save the contact first. The App uses publicly available deep links (wa.me) provided by WhatsApp to achieve this functionality.',
    },
    {
        title: '3. Not Affiliated with WhatsApp',
        content:
            'IMPORTANT: QuickChat WA is an independent third-party application and is NOT affiliated with, endorsed by, sponsored by, or in any way officially connected with WhatsApp Inc., Meta Platforms, Inc., or any of their subsidiaries or affiliates. The WhatsApp brand name and logo are trademarks of WhatsApp Inc.',
    },
    {
        title: '4. Responsible Usage',
        content:
            'You agree to use this App only for lawful purposes and in compliance with all applicable local, national, and international laws and regulations. You must not use this App to:\n\n• Send spam, unsolicited, or bulk messages\n• Harass, threaten, or intimidate other users\n• Engage in any fraudulent activity\n• Violate WhatsApp\'s own Terms of Service\n• Send any illegal or harmful content',
    },
    {
        title: '5. WhatsApp Terms Compliance',
        content:
            'By using this App, you acknowledge that your use of WhatsApp through this App is subject to WhatsApp\'s own Terms of Service and Privacy Policy. You are solely responsible for ensuring your messages comply with WhatsApp\'s terms. We have no control over and assume no responsibility for the content you send through WhatsApp.',
    },
    {
        title: '6. Disclaimer of Warranties',
        content:
            'The App is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties, express or implied. We do not warrant that the App will be uninterrupted, error-free, or free of viruses. We make no guarantee that WhatsApp deep links will function at all times, as WhatsApp may change their URL schemes without notice.',
    },
    {
        title: '7. Limitation of Liability',
        content:
            'To the maximum extent permitted by law, QuickChat WA and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use or inability to use the App, including but not limited to loss of data, profits, or goodwill.',
    },
    {
        title: '8. Advertising',
        content:
            'The App displays advertisements provided by Google AdMob to support free access to the App. By using the App, you consent to the display of these advertisements in accordance with our Privacy Policy.',
    },
    {
        title: '9. Changes to Terms',
        content:
            'We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting the updated Terms in the App. Your continued use of the App after any changes constitutes your acceptance of those changes.',
    },
    {
        title: '10. Governing Law',
        content:
            'These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the App shall be subject to the jurisdiction of the courts in your country of residence.',
    },
];

export default function TermsConditionsScreen() {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.banner}>
                    <View style={styles.bannerIcon}>
                        <Ionicons name="document-text" size={32} color={COLORS.white} />
                    </View>
                    <Text style={styles.bannerTitle}>Terms & Conditions</Text>
                    <Text style={styles.bannerDate}>Last Updated: March 2025</Text>
                </View>

                {/* Important Notice */}
                <View style={styles.noticeCard}>
                    <Ionicons name="information-circle" size={22} color={COLORS.warning} />
                    <Text style={styles.noticeText}>
                        Please read these terms carefully before using the app.
                    </Text>
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
    noticeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        backgroundColor: '#FFF9E6',
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.warning,
    },
    noticeText: {
        flex: 1,
        fontSize: FONT_SIZES.sm,
        color: COLORS.warning,
        fontWeight: '600',
    },
    body: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
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

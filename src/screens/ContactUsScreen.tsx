import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Alert,
    Linking,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import { APP_CONFIG } from '../constants';

const FEEDBACK_CATEGORIES = [
    { id: 'bug', label: '🐛 Bug Report', icon: 'bug-outline' },
    { id: 'feature', label: '💡 Feature Request', icon: 'bulb-outline' },
    { id: 'general', label: '💬 General Feedback', icon: 'chatbubble-outline' },
    { id: 'other', label: '❓ Other', icon: 'help-circle-outline' },
];

export default function ContactUsScreen() {
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [subject, setSubject] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEmailSupport = () => {
        const mailto = `mailto:${APP_CONFIG.supportEmail}?subject=QuickChat WA Support`;
        Linking.openURL(mailto).catch(() => {
            Alert.alert('Error', 'Could not open email client. Please email us at ' + APP_CONFIG.supportEmail);
        });
    };

    const handleSubmitFeedback = async () => {
        if (!feedbackText.trim()) {
            Alert.alert('Required', 'Please enter your feedback message.');
            return;
        }

        setIsSubmitting(true);

        // Compose email with feedback
        const cat = FEEDBACK_CATEGORIES.find((c) => c.id === selectedCategory);
        const emailSubject = `[${cat?.label.replace(/[^\w\s]/g, '').trim()}] ${subject || 'QuickChat WA Feedback'}`;
        const emailBody = `Category: ${cat?.label}\n\n${feedbackText}`;
        const mailto = `mailto:${APP_CONFIG.supportEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        setTimeout(async () => {
            setIsSubmitting(false);
            try {
                await Linking.openURL(mailto);
                setFeedbackText('');
                setSubject('');
            } catch {
                Alert.alert(
                    'Email Required',
                    `Please email us directly at ${APP_CONFIG.supportEmail}`,
                    [{ text: 'Copy Email', onPress: () => { } }, { text: 'OK' }]
                );
            }
        }, 600);
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Banner */}
                    <View style={styles.banner}>
                        <View style={styles.bannerIcon}>
                            <Ionicons name="mail" size={32} color={COLORS.white} />
                        </View>
                        <Text style={styles.bannerTitle}>Contact Us</Text>
                        <Text style={styles.bannerSubtitle}>
                            We'd love to hear from you!
                        </Text>
                    </View>

                    {/* Quick Email Support */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeading}>Email Support</Text>
                        <TouchableOpacity
                            style={styles.emailCard}
                            onPress={handleEmailSupport}
                            activeOpacity={0.8}
                        >
                            <View style={styles.emailIconWrap}>
                                <Ionicons name="mail-open" size={24} color={COLORS.primary} />
                            </View>
                            <View style={styles.emailContent}>
                                <Text style={styles.emailLabel}>Reach us directly</Text>
                                <Text style={styles.emailAddress}>{APP_CONFIG.supportEmail}</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
                        </TouchableOpacity>

                        <View style={styles.responseInfo}>
                            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.responseText}>
                                We typically respond within 24–48 hours on business days.
                            </Text>
                        </View>
                    </View>

                    {/* Feedback Form */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeading}>Send Feedback</Text>
                        <View style={styles.formCard}>
                            {/* Category */}
                            <Text style={styles.formLabel}>Category</Text>
                            <View style={styles.categoryGrid}>
                                {FEEDBACK_CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.categoryBtn,
                                            selectedCategory === cat.id && styles.categoryBtnActive,
                                        ]}
                                        onPress={() => setSelectedCategory(cat.id)}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryBtnText,
                                                selectedCategory === cat.id && styles.categoryBtnTextActive,
                                            ]}
                                        >
                                            {cat.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Subject */}
                            <Text style={[styles.formLabel, { marginTop: SPACING.lg }]}>
                                Subject{' '}
                                <Text style={styles.optional}>(optional)</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Brief subject..."
                                placeholderTextColor={COLORS.textLight}
                                value={subject}
                                onChangeText={setSubject}
                                maxLength={100}
                                returnKeyType="next"
                                accessibilityLabel="Feedback subject"
                            />

                            {/* Message */}
                            <Text style={[styles.formLabel, { marginTop: SPACING.lg }]}>
                                Message <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.textAreaWrap}>
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="Tell us about your experience, report a bug, or suggest a feature..."
                                    placeholderTextColor={COLORS.textLight}
                                    value={feedbackText}
                                    onChangeText={setFeedbackText}
                                    multiline
                                    numberOfLines={6}
                                    maxLength={2000}
                                    textAlignVertical="top"
                                    accessibilityLabel="Feedback message"
                                />
                                <Text style={styles.charCount}>{feedbackText.length}/2000</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                                onPress={handleSubmitFeedback}
                                disabled={isSubmitting}
                                activeOpacity={0.85}
                                accessibilityLabel="Submit feedback"
                            >
                                <Ionicons
                                    name={isSubmitting ? 'hourglass-outline' : 'send'}
                                    size={18}
                                    color={COLORS.white}
                                />
                                <Text style={styles.submitBtnText}>
                                    {isSubmitting ? 'Opening Email...' : 'Send Feedback'}
                                </Text>
                            </TouchableOpacity>

                            <Text style={styles.formNote}>
                                Tapping "Send Feedback" will open your email app with your feedback pre-filled.
                            </Text>
                        </View>
                    </View>

                    {/* Social Links */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeading}>Other Ways to Reach Us</Text>
                        <TouchableOpacity
                            style={styles.socialCard}
                            onPress={() => Linking.openURL('https://jaypratapsingh.vercel.app/')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.socialItem}>
                                <View style={[styles.socialIcon, { backgroundColor: '#E8F5E9' }]}>
                                    <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={styles.socialLabel}>Website</Text>
                                    <Text style={styles.socialValue}>jaypratapsingh.vercel.app</Text>
                                </View>
                            </View>
                            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
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
    bannerSubtitle: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.75)',
        marginTop: SPACING.xs,
    },
    section: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
    },
    sectionHeading: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
        color: COLORS.textLight,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
    },
    emailCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    emailIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emailContent: {
        flex: 1,
    },
    emailLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    emailAddress: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.primary,
        marginTop: 2,
    },
    responseInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.sm,
        marginLeft: SPACING.xs,
    },
    responseText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        flex: 1,
    },
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    formLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    optional: {
        fontWeight: '400',
        color: COLORS.textLight,
        fontSize: FONT_SIZES.xs,
    },
    required: {
        color: COLORS.error,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    categoryBtn: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.inputBg,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    categoryBtnActive: {
        backgroundColor: '#E8F5E9',
        borderColor: COLORS.primary,
    },
    categoryBtnText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    categoryBtnTextActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    input: {
        backgroundColor: COLORS.inputBg,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
    },
    textAreaWrap: {
        backgroundColor: COLORS.inputBg,
        borderRadius: BORDER_RADIUS.sm,
        overflow: 'hidden',
    },
    textArea: {
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.sm,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        minHeight: 130,
    },
    charCount: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
        textAlign: 'right',
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.xl,
        gap: SPACING.sm,
    },
    submitBtnDisabled: {
        opacity: 0.65,
    },
    submitBtnText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
    },
    formNote: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: SPACING.md,
        lineHeight: 18,
    },
    socialCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    socialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        flex: 1,
    },
    socialIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    socialValue: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginTop: 1,
    },
});

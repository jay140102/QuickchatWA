import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    FlatList,
    Alert,
    Linking,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import { COUNTRY_CODES } from '../constants';
import { validatePhoneNumber, buildWhatsAppUrl } from '../utils/phoneUtils';
import { StorageService } from '../services/storageService';
import { adMobService } from '../services/adMobService';
import BannerAdComponent from '../components/BannerAdComponent';

const DEFAULT_COUNTRY = COUNTRY_CODES.find((c) => c.code === '+91') || COUNTRY_CODES[0];

export default function HomeScreen() {
    const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [buttonScale] = useState(new Animated.Value(1));

    useFocusEffect(
        useCallback(() => {
            // Initialize AdMob on first focus
            adMobService.initialize();
        }, [])
    );

    const filteredCountries = COUNTRY_CODES.filter(
        (c) =>
            c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
            c.code.includes(countrySearch) ||
            c.country.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const handlePhoneChange = (text: string) => {
        // Only allow digits, spaces, and dashes
        const cleaned = text.replace(/[^0-9\s\-]/g, '');
        setPhoneNumber(cleaned);
        if (phoneError) setPhoneError('');
    };

    const animateButton = () => {
        Animated.sequence([
            Animated.timing(buttonScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
            Animated.timing(buttonScale, { toValue: 1, duration: 80, useNativeDriver: true }),
        ]).start();
    };

    const handleOpenWhatsApp = async () => {
        const trimmed = phoneNumber.trim().replace(/\s/g, '');
        if (!trimmed) {
            setPhoneError('Please enter a phone number');
            return;
        }
        if (!validatePhoneNumber(trimmed)) {
            setPhoneError('Please enter a valid phone number (7–15 digits)');
            return;
        }

        animateButton();
        setIsLoading(true);

        try {
            const url = buildWhatsAppUrl(selectedCountry.code, trimmed, message);
            const canOpen = await Linking.canOpenURL(url);

            if (!canOpen) {
                Alert.alert(
                    'WhatsApp Not Found',
                    'WhatsApp is not installed on this device. Please install WhatsApp and try again.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Save to recent numbers
            await StorageService.saveRecentNumber(selectedCountry.code, trimmed, message);

            // Track send count & show interstitial if needed
            const newCount = await StorageService.incrementSendCount();
            await adMobService.showIfReady(newCount);

            await Linking.openURL(url);
        } catch (err) {
            Alert.alert('Error', 'Failed to open WhatsApp. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setPhoneNumber('');
        setMessage('');
        setPhoneError('');
    };

    return (
        <View style={styles.outerContainer}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    style={styles.flex}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <View style={styles.heroIconWrap}>
                            <Ionicons name="chatbubble-ellipses" size={36} color={COLORS.white} />
                        </View>
                        <Text style={styles.heroTitle}>Send Without Saving</Text>
                        <Text style={styles.heroSubtitle}>
                            Message anyone on WhatsApp instantly — no need to save their contact.
                        </Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        {/* Phone Number Label */}
                        <Text style={styles.label}>
                            <Ionicons name="call-outline" size={14} color={COLORS.textSecondary} />
                            {'  '}Phone Number
                        </Text>

                        {/* Phone Input Row */}
                        <View style={[styles.phoneRow, phoneError ? styles.phoneRowError : null]}>
                            {/* Country Code Picker */}
                            <TouchableOpacity
                                style={styles.countryBtn}
                                onPress={() => setShowCountryPicker(true)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.flag}>{selectedCountry.flag}</Text>
                                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                                <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            <TextInput
                                style={styles.phoneInput}
                                placeholder="Enter number"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={handlePhoneChange}
                                maxLength={15}
                                returnKeyType="done"
                                accessibilityLabel="Phone number input"
                            />

                            {phoneNumber.length > 0 && (
                                <TouchableOpacity onPress={() => setPhoneNumber('')} style={styles.clearBtn}>
                                    <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {phoneError ? (
                            <View style={styles.errorRow}>
                                <Ionicons name="alert-circle-outline" size={14} color={COLORS.error} />
                                <Text style={styles.errorText}>{phoneError}</Text>
                            </View>
                        ) : null}

                        {/* Message Input */}
                        <Text style={[styles.label, { marginTop: SPACING.lg }]}>
                            <Ionicons name="chatbubble-outline" size={14} color={COLORS.textSecondary} />
                            {'  '}Message{' '}
                            <Text style={styles.optional}>(optional)</Text>
                        </Text>
                        <View style={styles.messageContainer}>
                            <TextInput
                                style={styles.messageInput}
                                placeholder="Type a pre-filled message..."
                                placeholderTextColor={COLORS.textLight}
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                numberOfLines={4}
                                maxLength={1000}
                                textAlignVertical="top"
                                accessibilityLabel="Message input"
                            />
                            <Text style={styles.charCount}>{message.length}/1000</Text>
                        </View>

                        {/* Action Buttons */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                style={[styles.openBtn, isLoading && styles.openBtnDisabled]}
                                onPress={handleOpenWhatsApp}
                                disabled={isLoading}
                                activeOpacity={0.85}
                                accessibilityLabel="Open in WhatsApp"
                            >
                                <Ionicons
                                    name="logo-whatsapp"
                                    size={22}
                                    color={COLORS.white}
                                    style={styles.openBtnIcon}
                                />
                                <Text style={styles.openBtnText}>
                                    {isLoading ? 'Opening...' : 'Open in WhatsApp'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {(phoneNumber.length > 0 || message.length > 0) && (
                            <TouchableOpacity
                                style={styles.clearAllBtn}
                                onPress={handleClear}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="refresh-outline" size={16} color={COLORS.textSecondary} />
                                <Text style={styles.clearAllText}>Clear All</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <View style={styles.infoIconWrap}>
                                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.infoTitle}>No Contact Saving</Text>
                                <Text style={styles.infoDesc}>Message without adding to contacts</Text>
                            </View>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoItem}>
                            <View style={styles.infoIconWrap}>
                                <Ionicons name="flash-outline" size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.infoTitle}>Instant & Fast</Text>
                                <Text style={styles.infoDesc}>Opens WhatsApp chat instantly</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Banner Ad */}
            <BannerAdComponent />

            {/* Country Picker Modal */}
            <Modal
                visible={showCountryPicker}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Country</Text>
                        <TouchableOpacity
                            onPress={() => setShowCountryPicker(false)}
                            style={styles.modalClose}
                        >
                            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search country or code..."
                            placeholderTextColor={COLORS.textLight}
                            value={countrySearch}
                            onChangeText={setCountrySearch}
                            autoFocus
                            accessibilityLabel="Country search input"
                        />
                        {countrySearch.length > 0 && (
                            <TouchableOpacity onPress={() => setCountrySearch('')}>
                                <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        data={filteredCountries}
                        keyExtractor={(item) => item.code + item.country}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.countryItem,
                                    selectedCountry.code === item.code &&
                                    selectedCountry.country === item.country &&
                                    styles.countryItemSelected,
                                ]}
                                onPress={() => {
                                    setSelectedCountry(item);
                                    setShowCountryPicker(false);
                                    setCountrySearch('');
                                }}
                            >
                                <Text style={styles.countryItemFlag}>{item.flag}</Text>
                                <Text style={styles.countryItemName}>{item.name}</Text>
                                <Text style={styles.countryItemCode}>{item.code}</Text>
                                {selectedCountry.code === item.code &&
                                    selectedCountry.country === item.country && (
                                        <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                                    )}
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    outerContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: SPACING.xxl,
    },
    heroSection: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.xxxl,
        alignItems: 'center',
    },
    heroIconWrap: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    heroTitle: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.white,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.78)',
        textAlign: 'center',
        marginTop: SPACING.xs,
        lineHeight: 20,
        maxWidth: 280,
    },
    card: {
        backgroundColor: COLORS.white,
        marginHorizontal: SPACING.lg,
        marginTop: -SPACING.xl,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 8,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
        letterSpacing: 0.3,
    },
    optional: {
        fontWeight: '400',
        color: COLORS.textLight,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1.5,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    phoneRowError: {
        borderColor: COLORS.error,
        backgroundColor: COLORS.errorLight,
    },
    countryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        gap: SPACING.xs,
    },
    flag: {
        fontSize: 20,
    },
    countryCode: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    divider: {
        width: 1,
        height: 28,
        backgroundColor: COLORS.border,
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.lg,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    clearBtn: {
        paddingRight: SPACING.sm,
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.xs,
    },
    errorText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.error,
        fontWeight: '500',
    },
    messageContainer: {
        backgroundColor: COLORS.inputBg,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
    },
    messageInput: {
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.sm,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        minHeight: 100,
    },
    charCount: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
        textAlign: 'right',
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    openBtn: {
        backgroundColor: COLORS.accent,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.xl,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    openBtnDisabled: {
        opacity: 0.65,
    },
    openBtnIcon: {
        marginRight: SPACING.sm,
    },
    openBtnText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    clearAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.md,
        gap: SPACING.xs,
        paddingVertical: SPACING.sm,
    },
    clearAllText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    infoCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 6,
        elevation: 3,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    infoIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        flex: 1,
    },
    infoTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    infoDesc: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    infoDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.md,
    },
    // Modal
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    modalClose: {
        padding: SPACING.xs,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        marginHorizontal: SPACING.xl,
        marginVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        gap: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        gap: SPACING.md,
    },
    countryItemSelected: {
        backgroundColor: '#E8F5E9',
    },
    countryItemFlag: {
        fontSize: 22,
    },
    countryItemName: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    countryItemCode: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontWeight: '600',
        marginRight: SPACING.sm,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.borderLight,
        marginLeft: SPACING.xl + 22 + SPACING.md,
    },
});

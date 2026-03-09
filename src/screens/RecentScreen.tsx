import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    StatusBar,
    RefreshControl,
    Animated,
} from 'react-native';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import { StorageService, RecentNumber } from '../services/storageService';
import { formatTimestamp, buildWhatsAppUrl } from '../utils/phoneUtils';
import { Linking } from 'react-native';

type RootStackParamList = {
    HomeTab: { countryCode?: string; phoneNumber?: string };
};

export default function RecentScreen() {
    const [recentNumbers, setRecentNumbers] = useState<RecentNumber[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const loadRecents = useCallback(async () => {
        const data = await StorageService.getRecentNumbers();
        setRecentNumbers(data);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadRecents();
        }, [loadRecents])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadRecents();
        setRefreshing(false);
    }, [loadRecents]);

    const handleDelete = (item: RecentNumber) => {
        Alert.alert(
            'Remove Number',
            `Remove ${item.countryCode} ${item.phoneNumber} from recent?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        const updated = await StorageService.deleteRecentNumber(item.id);
                        setRecentNumbers(updated);
                    },
                },
            ]
        );
    };

    const handleClearAll = () => {
        if (recentNumbers.length === 0) return;
        Alert.alert(
            'Clear All',
            'Are you sure you want to remove all recent numbers?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        await StorageService.clearAllRecentNumbers();
                        setRecentNumbers([]);
                    },
                },
            ]
        );
    };

    const handleOpenWhatsApp = async (item: RecentNumber) => {
        try {
            const url = buildWhatsAppUrl(item.countryCode, item.phoneNumber, item.lastMessage);
            const canOpen = await Linking.canOpenURL(url);
            if (!canOpen) {
                Alert.alert('WhatsApp Not Found', 'Please install WhatsApp and try again.');
                return;
            }
            await StorageService.saveRecentNumber(item.countryCode, item.phoneNumber, item.lastMessage);
            await loadRecents();
            await Linking.openURL(url);
        } catch {
            Alert.alert('Error', 'Failed to open WhatsApp.');
        }
    };

    const renderItem = ({ item }: { item: RecentNumber }) => (
        <View style={styles.itemCard}>
            <View style={styles.itemAvatar}>
                <Text style={styles.itemAvatarText}>
                    {item.countryCode.replace('+', '')}
                </Text>
            </View>

            <View style={styles.itemContent}>
                <Text style={styles.itemNumber}>
                    {item.countryCode} {item.phoneNumber}
                </Text>
                {item.lastMessage ? (
                    <Text style={styles.itemMessage} numberOfLines={1}>
                        "{item.lastMessage}"
                    </Text>
                ) : (
                    <Text style={styles.itemNoMessage}>No message</Text>
                )}
                <View style={styles.itemMeta}>
                    <Ionicons name="time-outline" size={11} color={COLORS.textLight} />
                    <Text style={styles.itemTime}>{formatTimestamp(item.timestamp)}</Text>
                    {item.useCount > 1 && (
                        <>
                            <Text style={styles.itemDot}>·</Text>
                            <Text style={styles.itemUseCount}>Used {item.useCount}×</Text>
                        </>
                    )}
                </View>
            </View>

            <View style={styles.itemActions}>
                <TouchableOpacity
                    style={styles.whatsappBtn}
                    onPress={() => handleOpenWhatsApp(item)}
                    accessibilityLabel={`Open WhatsApp for ${item.countryCode} ${item.phoneNumber}`}
                >
                    <Ionicons name="logo-whatsapp" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item)}
                    accessibilityLabel="Delete number"
                >
                    <Ionicons name="trash-outline" size={18} color={COLORS.textLight} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
                <Ionicons name="time-outline" size={48} color={COLORS.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No Recent Numbers</Text>
            <Text style={styles.emptySubtitle}>
                Numbers you message will appear here for quick access.
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

            {recentNumbers.length > 0 && (
                <View style={styles.headerRow}>
                    <Text style={styles.headerCount}>{recentNumbers.length} saved</Text>
                    <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
                        <Ionicons name="trash-outline" size={15} color={COLORS.error} />
                        <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={recentNumbers}
                renderItem={renderItem}
                keyExtractor={(item) => item.id + item.timestamp}
                contentContainerStyle={[
                    styles.listContent,
                    recentNumbers.length === 0 && styles.listContentEmpty,
                ]}
                ListEmptyComponent={<EmptyState />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerCount: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    clearAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        padding: SPACING.xs,
    },
    clearAllText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
        fontWeight: '600',
    },
    listContent: {
        padding: SPACING.lg,
    },
    listContentEmpty: {
        flex: 1,
    },
    itemCard: {
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
        gap: SPACING.md,
    },
    itemSeparator: {
        height: SPACING.sm,
    },
    itemAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemAvatarText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        color: COLORS.white,
    },
    itemContent: {
        flex: 1,
        gap: 2,
    },
    itemNumber: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    itemMessage: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    itemNoMessage: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textLight,
    },
    itemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    itemTime: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
    },
    itemDot: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
    },
    itemUseCount: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.primaryLight,
        fontWeight: '600',
    },
    itemActions: {
        gap: SPACING.sm,
        alignItems: 'center',
    },
    whatsappBtn: {
        backgroundColor: COLORS.accent,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
        elevation: 4,
    },
    deleteBtn: {
        padding: SPACING.xs,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xxl,
        gap: SPACING.md,
    },
    emptyIconWrap: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: COLORS.inputBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    emptyTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});

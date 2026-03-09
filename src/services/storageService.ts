import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../constants';

export interface RecentNumber {
    id: string;
    countryCode: string;
    phoneNumber: string;
    lastMessage?: string;
    timestamp: number;
    useCount: number;
}

const RECENT_NUMBERS_KEY = '@quickchatwa_recent_numbers';
const SEND_COUNT_KEY = '@quickchatwa_send_count';

export const StorageService = {
    // Recent Numbers
    async getRecentNumbers(): Promise<RecentNumber[]> {
        try {
            const data = await AsyncStorage.getItem(RECENT_NUMBERS_KEY);
            if (!data) return [];
            return JSON.parse(data) as RecentNumber[];
        } catch {
            return [];
        }
    },

    async saveRecentNumber(
        countryCode: string,
        phoneNumber: string,
        message?: string
    ): Promise<void> {
        try {
            const existing = await this.getRecentNumbers();
            const fullNumber = `${countryCode}${phoneNumber}`;

            // Check if number already exists
            const existingIndex = existing.findIndex(
                (n) => `${n.countryCode}${n.phoneNumber}` === fullNumber
            );

            const newEntry: RecentNumber = {
                id: fullNumber,
                countryCode,
                phoneNumber,
                lastMessage: message,
                timestamp: Date.now(),
                useCount: existingIndex >= 0 ? existing[existingIndex].useCount + 1 : 1,
            };

            let updated: RecentNumber[];
            if (existingIndex >= 0) {
                updated = [...existing];
                updated.splice(existingIndex, 1);
                updated.unshift(newEntry);
            } else {
                updated = [newEntry, ...existing];
            }

            // Keep only max recent numbers
            if (updated.length > APP_CONFIG.maxRecentNumbers) {
                updated = updated.slice(0, APP_CONFIG.maxRecentNumbers);
            }

            await AsyncStorage.setItem(RECENT_NUMBERS_KEY, JSON.stringify(updated));
        } catch (err) {
            console.error('Failed to save recent number:', err);
        }
    },

    async deleteRecentNumber(id: string): Promise<RecentNumber[]> {
        try {
            const existing = await this.getRecentNumbers();
            const updated = existing.filter((n) => n.id !== id);
            await AsyncStorage.setItem(RECENT_NUMBERS_KEY, JSON.stringify(updated));
            return updated;
        } catch {
            return [];
        }
    },

    async clearAllRecentNumbers(): Promise<void> {
        try {
            await AsyncStorage.removeItem(RECENT_NUMBERS_KEY);
        } catch (err) {
            console.error('Failed to clear recent numbers:', err);
        }
    },

    // Send count for interstitial ad
    async getSendCount(): Promise<number> {
        try {
            const data = await AsyncStorage.getItem(SEND_COUNT_KEY);
            return data ? parseInt(data, 10) : 0;
        } catch {
            return 0;
        }
    },

    async incrementSendCount(): Promise<number> {
        try {
            const count = await this.getSendCount();
            const newCount = count + 1;
            await AsyncStorage.setItem(SEND_COUNT_KEY, String(newCount));
            return newCount;
        } catch {
            return 0;
        }
    },
};

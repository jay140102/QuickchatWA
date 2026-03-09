import { Platform } from 'react-native';
import { ADMOB_IDS, APP_CONFIG } from '../constants';

// Conditionally import AdMob
let InterstitialAd: any = null;
let AdEventType: any = null;

try {
    const admob = require('react-native-google-mobile-ads');
    InterstitialAd = admob.InterstitialAd;
    AdEventType = admob.AdEventType;
} catch {
    // AdMob not available
}

class AdMobService {
    private interstitial: any = null;
    private isLoaded = false;

    initialize() {
        if (!InterstitialAd || !AdEventType) return;

        const adUnitId =
            Platform.OS === 'android'
                ? ADMOB_IDS.android.interstitial
                : ADMOB_IDS.ios.interstitial;

        this.interstitial = InterstitialAd.createForAdRequest(adUnitId, {
            requestNonPersonalizedAdsOnly: true,
        });

        this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
            this.isLoaded = true;
            console.log('Interstitial ad loaded');
        });

        this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            this.isLoaded = false;
            this.loadAd(); // reload after close
        });

        this.interstitial.addAdEventListener(
            AdEventType.ERROR,
            (error: Error) => {
                console.warn('Interstitial error:', error.message);
                this.isLoaded = false;
            }
        );

        this.loadAd();
    }

    loadAd() {
        if (!this.interstitial) return;
        try {
            this.interstitial.load();
        } catch (err) {
            console.warn('Failed to load interstitial:', err);
        }
    }

    async showIfReady(sendCount: number): Promise<void> {
        if (sendCount % APP_CONFIG.interstitialInterval !== 0) return;
        if (!this.interstitial || !this.isLoaded) return;

        try {
            await this.interstitial.show();
        } catch (err) {
            console.warn('Failed to show interstitial:', err);
        }
    }
}

export const adMobService = new AdMobService();

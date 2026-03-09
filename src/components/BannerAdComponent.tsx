import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ADMOB_IDS } from '../constants';

// Conditionally import AdMob to avoid crashes if package not installed
let BannerAd: any = null;
let BannerAdSize: any = null;

try {
    const admob = require('react-native-google-mobile-ads');
    BannerAd = admob.BannerAd;
    BannerAdSize = admob.BannerAdSize;
} catch {
    // AdMob not available
}

interface BannerAdComponentProps {
    style?: object;
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({ style }) => {
    const adUnitId =
        Platform.OS === 'android' ? ADMOB_IDS.android.banner : ADMOB_IDS.ios.banner;

    if (!BannerAd || !BannerAdSize) {
        // Return empty view if AdMob not available (dev mode)
        return <View style={[styles.placeholder, style]} />;
    }

    return (
        <View style={[styles.container, style]}>
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                onAdLoaded={() => console.log('Banner ad loaded')}
                onAdFailedToLoad={(error: Error) =>
                    console.warn('Banner ad failed:', error.message)
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F2F5',
    },
    placeholder: {
        height: 50,
        backgroundColor: '#F0F2F5',
    },
});

export default BannerAdComponent;

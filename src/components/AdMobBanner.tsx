import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';

// Google sample banner test ID. Replace with your own only after testing and policy review.
const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
const LIVE_BANNER_ID = 'ca-app-pub-2644668055426386/3295378520';
const USE_TEST_ADS = true;

export default function AdMobBanner() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return;

    let mounted = true;
    const show = async () => {
      try {
        await AdMob.initialize();
        if (!mounted) return;
        const options: BannerAdOptions = {
          adId: USE_TEST_ADS ? TEST_BANNER_ID : LIVE_BANNER_ID,
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: USE_TEST_ADS,
        };
        await AdMob.showBanner(options);
      } catch (error) {
        console.error('AdMob banner initialization failed:', error);
      }
    };
    void show();

    return () => {
      mounted = false;
      void AdMob.removeBanner().catch((error) => {
        console.warn('Could not remove AdMob banner:', error);
      });
    };
  }, []);

  return null;
}

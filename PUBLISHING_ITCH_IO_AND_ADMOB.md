# OmniPost AI — Android AdMob + itch.io preparation

This project has two different delivery targets:

- **Android app:** Capacitor wrapper + Google AdMob native banner. The code is configured to use Google's test banner first.
- **itch.io HTML5:** a browser build. Native AdMob does **not** run in the itch.io browser player. Do not expect the Android banner to appear on itch.io.

## AdMob IDs supplied for this project

- App ID: `ca-app-pub-2644668055426386~9804946552`
- Live banner unit: `ca-app-pub-2644668055426386/3295378520`

The source currently uses Google's official test banner ID. Keep test ads enabled during development. Only switch `USE_TEST_ADS` to `false` after the Android app is correctly configured, tested, and compliant with AdMob policies.

## Android setup

Requirements: Node.js/npm, Android Studio, Android SDK, and a JDK supported by the installed Android Gradle plugin.

1. `npm install`
2. `npx cap add android`
3. In `android/app/src/main/AndroidManifest.xml`, add this inside the `<application>` element:

   ```xml
   <meta-data
       android:name="com.google.android.gms.ads.APPLICATION_ID"
       android:value="ca-app-pub-2644668055426386~9804946552" />
   ```

4. `npm run android:sync`
5. `npm run android:open`
6. In Android Studio, build and run on a real Android device or emulator with Google Play services.

The AdMob banner component is native-only and does nothing in a normal browser. It uses the official Google test banner ID by default. The live Ad Unit ID is already recorded in the component but is not active while `USE_TEST_ADS = true`.

## itch.io HTML5 publishing

1. `npm install`
2. `npm run build:itch`
3. Upload the **contents of the `dist` folder** as an HTML5 project ZIP on itch.io. `index.html` must be at the ZIP root.
4. In the itch.io project edit page, set Kind of project to **HTML** and enable **This file will be played in the browser**.

### Important backend limitation

This project is not a purely static website. The UI calls these Express endpoints:

- `/api/generate-campaign`
- `/api/generate-image`
- `/api/generate-video`
- `/api/deep-analysis`
- `/api/quick-edit`
- `/api/health`

An itch.io HTML5 upload cannot run `server.ts` or its Express server. Therefore, the HTML5 build needs the backend deployed separately to a public HTTPS host, and the frontend API requests must be configured to use that backend URL with suitable CORS settings. Do not upload a Gemini API key in the browser bundle. Keep `GEMINI_API_KEY` on the backend only.

If you do not deploy the backend, the static page may open on itch.io but AI generation features that call `/api/...` will fail.

## Before publishing

- Test Android with Google's test ad ID; never click your own live ads.
- Verify the live AdMob app and ad unit in your AdMob account before release.
- Complete any required app-ads.txt, privacy policy, consent, and store/account declarations that apply to your app and audience.
- Test the itch.io HTML5 build separately; native AdMob is Android-only.

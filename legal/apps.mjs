// Per-app legal content. Each app gets its own Privacy Policy and Terms of Use.
// Apps with a hand-written document use `fragments` (HTML in legal/fragments/).
// The rest are generated from the structured data below by legal/build.mjs.
//
// ⚠️ Before publishing, check each app's `thirdParties`, `permissions` and `subscription`
// against what the app really does (App Store "App Privacy" answers must match).

export const DEVELOPER = {
  name: 'Rıza Erdi Karakuş',
  email: 'karakusapp@gmail.com',
  country: 'Turkey',
};

export const UPDATED = 'November 26, 2026';

const FIREBASE = {
  name: 'Google Firebase (Analytics & Crashlytics)',
  purpose: 'Anonymous usage statistics, app performance monitoring and crash reports.',
  data: 'Device and app information, app interactions, crash logs, approximate region.',
};
const APPLE = {
  name: 'Apple (App Store & StoreKit)',
  purpose: 'App distribution, in-app purchases and subscription billing.',
  data: 'Purchase and subscription status. Payment card details are handled by Apple and never reach us.',
};
const AI_PROVIDER = (what) => ({
  name: 'AI processing provider',
  purpose: `Analyzes the ${what} you submit and returns the result to the App.`,
  data: `The ${what} you choose to submit, sent over an encrypted HTTPS/TLS connection.`,
});

export const apps = {
  'newborn-ai': {
    fragments: { privacy: 'newbornai-privacy.html', terms: 'newbornai-terms.html' },
    updated: { privacy: 'August 18, 2026', terms: 'December 16, 2024' },
  },

  kcal: {
    summary: [
      'Food photos are sent for AI analysis only when you tap Scan.',
      'Your meals, weight and goals stay on your device.',
      'We never sell your data or use it for advertising.',
    ],
    collect: [
      ['Food photos', 'A photo you take or pick when you ask the App to recognize a meal.'],
      ['Profile & goals', 'Age, height, weight, activity level and calorie goals you enter to personalize targets.'],
      ['Food & activity logs', 'Meals, nutrients, water and activities you record.'],
    ],
    permissions: [
      ['Camera', 'To scan your meal. Optional: you can add food manually.'],
      ['Photo Library', 'To pick an existing food photo. The App only sees the photos you select.'],
      ['Apple Health (if enabled)', 'To read activity or write nutrition data, only with your explicit permission in iOS settings. Health data is never used for advertising and is never shared with third parties.'],
    ],
    special: {
      title: 'AI Food Recognition',
      body: [
        'When you tap Scan, the selected photo is sent over an encrypted connection to our AI processing provider, which estimates the foods, portion sizes and nutrition values and returns the result to the App.',
        'Photos are used only to produce that estimate. They are not used for facial recognition, are not sold, and are not used by us to train AI models.',
      ],
    },
    thirdParties: [AI_PROVIDER('food photo'), FIREBASE, APPLE],
    retention: [
      ['Food photos', 'Processed in real time and not stored on our servers after the result is returned.'],
      ['Logs, profile & goals', 'Stored on your device until you delete them or delete the App.'],
    ],
    children: 13,
    subscription: true,
    features: ['AI food recognition from photos', 'Calorie and macronutrient tracking', 'Goals, weight progress and weekly summaries'],
    notice: {
      title: 'Not Medical Advice',
      body: 'KCal provides estimates for general wellness and informational purposes only. Calorie and nutrition values produced by AI may be inaccurate. The App is not a medical device and does not diagnose, treat or prevent any condition. Consult a doctor or registered dietitian before making dietary changes, especially if you are pregnant, have an eating disorder, diabetes or any other medical condition.',
    },
    userContent: true,
  },

  'area-measure': {
    // Hand-written: the App runs on iOS and Android with different providers (MapKit/iCloud vs.
    // Google Maps/AdMob/Android backup), which the generated Apple-only template can't express.
    fragments: { privacy: 'area-measure-privacy.html', terms: 'area-measure-terms.html' },
    updated: { privacy: 'November 27, 2026', terms: 'November 27, 2026' },
    summary: [
      'No account. Your measurements, photos and notes stay on your device.',
      'Location is used on your device while you measure, never sold or tracked by us.',
      'The free Android version shows ads from Google AdMob; Pro has none.',
    ],
  },

  'dog-translator': {
    summary: [
      'The microphone is used only while you record.',
      'Translations are for fun — not real animal communication.',
      'Recordings are not stored on our servers.',
    ],
    collect: [
      ['Audio recordings', 'Short clips you record of your dog or yourself to generate a playful “translation”.'],
    ],
    permissions: [
      ['Microphone', 'To record barks or your voice when you press record. The App never listens in the background.'],
    ],
    special: {
      title: 'Audio Processing',
      body: [
        'Recordings are processed to produce an entertaining translation and sound effects. Clips are used only for that purpose and are not used to identify you.',
        'Dog whistle and clicker sounds are generated on your device. Avoid playing them at high volume close to animals or people.',
      ],
    },
    thirdParties: [AI_PROVIDER('audio clip'), FIREBASE, APPLE],
    retention: [
      ['Audio recordings', 'Not kept on our servers after processing. Clips you save stay on your device until you delete them.'],
    ],
    children: 13,
    subscription: true,
    features: ['Playful dog-to-human and human-to-dog translations', 'Dog whistle with adjustable frequency', 'Clicker and training sounds'],
    notice: {
      title: 'For Entertainment Only',
      body: 'Dog Translator does not actually translate animal language. Results are generated for entertainment and should not be relied on to understand your pet’s health, behavior or needs. If you are worried about your pet, contact a veterinarian. High-frequency sounds may cause discomfort to animals — use the whistle responsibly.',
    },
    userContent: false,
  },

};

// Generic policies kept at the old URLs (app-privacy.html / app-terms.html) so links that
// were already submitted to App Store Connect keep working.
export const generic = {
  title: 'KarakusApp',
  summary: [
    'We collect only what an app needs to work.',
    'Photos you submit for AI features are deleted after processing.',
    'We never sell your data.',
  ],
  collect: [
    ['Content you submit', 'Photos, text or audio you choose to submit to use an app feature.'],
    ['Support messages', 'Your email and message when you contact us.'],
  ],
  permissions: [
    ['Camera / Photos / Microphone / Location', 'Requested only when a feature needs it, and only with your permission. Each is optional.'],
  ],
  special: {
    title: 'AI Processing',
    body: [
      'If an app offers AI features, the content you submit is sent over an encrypted connection to an AI processing provider solely to produce the result you requested. It is not used for facial recognition, is not sold, and is not used by us to train AI models.',
    ],
  },
  thirdParties: [AI_PROVIDER('content'), FIREBASE, APPLE],
  retention: [
    ['Submitted content', 'Deleted from processing servers after the result is returned (at most 24 hours).'],
    ['On-device data', 'Kept on your device until you delete it or delete the app.'],
  ],
  children: 13,
  subscription: true,
  features: ['AI-powered tools', 'Photo, audio and utility features', 'Optional premium subscriptions'],
  notice: null,
  userContent: true,
};

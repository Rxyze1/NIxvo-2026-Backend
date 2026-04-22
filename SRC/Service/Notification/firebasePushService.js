import admin from '../../Config/firebase.js';
import PushToken from '../../Models/Notification-Model/PushToken-Model.js';
import axios from 'axios';

const EXPO_API = 'https://exp.host/--/api/v2/push/send';

// ═══════════════════════════════════════════════════════════════
// 🚀 THE ONLY FUNCTION YOU WILL EVER NEED
// ═══════════════════════════════════════════════════════════════



export const sendPush = async ({ userId, title, body, data = {} }) => {
  console.log('\n🔥 ━━━━━━━━━ FIREBASE PUSH SERVICE ━━━━━━━━━');
  console.log(`📍 Target User ID: ${userId}`);
  console.log(`📝 Title: ${title} | Body: ${body}`);

  try {
    // 1. GET TOKENS FROM DB
    const tokens = await PushToken.find({ userId, isActive: true }).lean();
    if (!tokens.length) {
      console.log('❌ NO ACTIVE TOKENS FOUND. Push aborted.');
      return;
    }

    console.log(`📱 Found ${tokens.length} tokens.`);
    
    // 2. SEPARATE EXPO vs FCM (Dev Client / Production)
    const expoTokens = tokens.filter(t => t.token.startsWith('ExponentPushToken'));
    const fcmTokens = tokens.filter(t => !t.token.startsWith('ExponentPushToken'));

    // 3. SEND TO EXPO GO
    if (expoTokens.length > 0) {
      await sendViaExpo(expoTokens, title, body, data);
    }

    // 4. SEND TO DEV CLIENT / PRODUCTION
    if (fcmTokens.length > 0) {
      await sendViaFirebase(fcmTokens, title, body, data);
    }

    console.log('━━━━━━━━━━ PUSH SERVICE COMPLETE ━━━━━━━━━\n');

  } catch (error) {
    console.error('💥 FATAL PUSH ERROR:', error.message);
  }
};


// ═══════════════════════════════════════════════════════════════
// 📲 EXPO GO SENDER
// ═══════════════════════════════════════════════════════════════
const sanitizeData = (data) =>
  Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, String(v ?? '')])
  );

const sendViaExpo = async (tokens, title, body, data) => {
  console.log(`📲 Sending to ${tokens.length} Expo Go devices...`);
  
  const payload = tokens.map(t => ({
    to: t.token,
    title,
    body,
    data: sanitizeData(data), // ✅ sanitized
    ios: { sound: true, badge: 1 }
  }));

  const res = await axios.post(EXPO_API, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
  });

  res.data.data.forEach((r, i) => {
    if (r.status === 'ok') console.log(`   ✅ Expo ${i+1} Success`);
    else console.log(`   ❌ Expo ${i+1} Failed: ${r.message}`);
  });
};

const sendViaFirebase = async (tokens, title, body, data) => {
  console.log(`🔥 Sending to ${tokens.length} Dev/Production devices via Firebase...`);

  const messages = tokens.map(t => ({
    token: t.token,
    notification: { title, body },
    data: sanitizeData(data), // ✅ sanitized
 android: {
  priority: 'high',
  notification: {
    channelId: 'default',
    sound: 'default',
  }
},
    apns: {
      payload: { aps: { sound: 'default', badge: 1 } }
    }
  }));

  try {
    const response = await admin.messaging().sendEach(messages);
    console.log(`   📊 Firebase Result: ${response.successCount} Sent, ${response.failureCount} Failed`);
    
    response.responses.forEach((r, i) => {
      if (!r.success) {
        console.log(`   ❌ Firebase ${i+1} Error: ${r.error.message}`);
        if (
          r.error.code === 'messaging/invalid-registration-token' || 
          r.error.code === 'messaging/registration-token-not-registered'
        ) {
          PushToken.findOneAndUpdate({ token: tokens[i].token }, { isActive: false }).exec();
        }
      } else {
        console.log(`   ✅ Firebase ${i+1} Success`);
      }
    });
  } catch (error) {
    console.error('   💥 Firebase Admin Crash:', error.message);
  }
};


// ═══════════════════════════════════════════════════════════════
// 🛠️ INTEGRATION WITH NOTIFICATION MODEL
// ═══════════════════════════════════════════════════════════════
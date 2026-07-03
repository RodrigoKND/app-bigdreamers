import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getSupabaseClient } from '@/services/supabase/supabase';

export function setupNotificationHandler() {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (e) {
    console.warn('Failed to set notification handler:', e);
  }
}

export async function registerForPushNotifications(): Promise<string | null> {
  const existingPerm: any = await Notifications.getPermissionsAsync();
  let granted = existingPerm.granted;

  if (!granted) {
    const result: any = await Notifications.requestPermissionsAsync();
    granted = result.granted;
  }

  if (!granted) {
    console.warn('Push notification permission not granted');
    return null;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: undefined,
    });
    const pushToken = tokenData.data;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFD740',
      });
    }

    return pushToken;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

export async function savePushToken(userId: string, pushToken: string): Promise<void> {
  const supabase = await getSupabaseClient();
  await supabase
    .from('users')
    .update({ push_token: pushToken })
    .eq('id', userId);
}

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: data || {},
        priority: 'high',
      }),
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

export async function sendGemRequestNotification(
  userPushToken: string,
  status: 'approved' | 'rejected',
  gems: number,
  reason?: string
): Promise<void> {
  const title = status === 'approved'
    ? '✅ ¡Gemas aprobadas!'
    : '❌ Solicitud rechazada';

  const body = status === 'approved'
    ? `¡Felicidades! Tu solicitud de ${gems} gemas fue aprobada. Ya están disponibles en tu cuenta.`
    : reason
      ? `Tu solicitud de ${gems} gemas fue rechazada. Motivo: ${reason}`
      : `Tu solicitud de ${gems} gemas fue rechazada. Contacta al administrador para más información.`;

  await sendPushNotification(userPushToken, title, body, {
    type: 'gem_request',
    status,
    gems,
  });
}

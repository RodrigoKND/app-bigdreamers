import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getSupabaseClient } from '@/services/supabase/supabase';

// En Expo Go (SDK 53+) el módulo expo-notifications lanza un error FATAL al
// evaluarse porque el push remoto fue removido de Expo Go. Por eso NO lo
// importamos estáticamente: lo cargamos de forma perezosa y sólo fuera de Expo Go.
// En un development build o en el APK, expo-notifications funciona normal.
const isExpoGo = Constants.appOwnership === 'expo';

async function loadNotifications() {
  if (isExpoGo) return null;
  try {
    return await import('expo-notifications');
  } catch {
    return null;
  }
}

export function setupNotificationHandler() {
  if (isExpoGo) return;
  loadNotifications()
    .then((Notifications) => {
      if (!Notifications) return;
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    })
    .catch((e) => console.warn('Failed to set notification handler:', e));
}

export async function registerForPushNotifications(): Promise<string | null> {
  const Notifications = await loadNotifications();
  if (!Notifications) return null;

  try {
    const existingPerm: any = await Notifications.getPermissionsAsync();
    let granted = existingPerm.granted;

    if (!granted) {
      const result: any = await Notifications.requestPermissionsAsync();
      granted = result.granted;
    }

    if (!granted) return null;

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
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
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
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
    const result = await response.json();
    const ticket = Array.isArray(result?.data) ? result.data[0] : result?.data;
    if (ticket?.status === 'error') {
      console.error('Expo push error:', ticket.message, ticket.details);
    }
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

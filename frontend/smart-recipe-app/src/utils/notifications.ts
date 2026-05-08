// src/utils/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert, Linking } from 'react-native';

/**
 * Configures how notifications are handled when the app is foregrounded.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Toggles push notification permissions and retrieves the Expo Push Token.
 */
export const togglePushNotifications = async (enable: boolean): Promise<boolean> => {
  if (!enable) {
    // We don't necessarily "unregister" hardware here, but we return false to indicate it's off in context
    return false;
  }

  if (!Device.isDevice) {
    Alert.alert('Simulator Detected', 'Push notifications require a physical device.');
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'ChefSync needs notification access to alert you about grocery deals and recipe updates. Please enable them in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }

    // Get the token
    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: undefined, // Will use app.json config
    })).data;

    console.log("[NOTIFICATIONS] Expo Push Token:", token);
    
    // Simulate API call to backend
    // await saveTokenToBackend(token);

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error("[NOTIFICATIONS] Error enabling push:", error);
    return false;
  }
};

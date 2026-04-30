import { Capacitor } from '@capacitor/core';
import {
  LocalNotifications,
  type LocalNotificationSchema,
  type ScheduleOptions,
  type ActionPerformed as LocalActionPerformed,
} from '@capacitor/local-notifications';
import {
  PushNotifications,
  type Token,
  type PushNotificationSchema,
  type ActionPerformed as PushActionPerformed,
} from '@capacitor/push-notifications';

// ─── Types ──────────────────────────────────────────────────────────────

export type NotificationPermissionStatus = 'granted' | 'denied' | 'prompt';

export interface NotificationPayload {
  title: string;
  body: string;
  id?: number;
  /** Optional data payload attached to the notification */
  data?: Record<string, unknown>;
  /** Schedule delay in seconds (local notifications only) */
  scheduleInSeconds?: number;
}

export interface NotificationListeners {
  onPushTokenReceived?: (token: string) => void;
  onPushNotificationReceived?: (notification: PushNotificationSchema) => void;
  onPushNotificationTapped?: (action: PushActionPerformed) => void;
  onLocalNotificationReceived?: (notification: LocalNotificationSchema) => void;
  onLocalNotificationTapped?: (action: LocalActionPerformed) => void;
}

// ─── Permission Helpers ─────────────────────────────────────────────────

/**
 * Check current local notification permission status.
 */
export const checkLocalPermissions = async (): Promise<NotificationPermissionStatus> => {
  const result = await LocalNotifications.checkPermissions();
  return result.display as NotificationPermissionStatus;
};

/**
 * Request local notification permissions from the user.
 */
export const requestLocalPermissions = async (): Promise<NotificationPermissionStatus> => {
  const result = await LocalNotifications.requestPermissions();
  return result.display as NotificationPermissionStatus;
};

/**
 * Check current push notification permission status.
 * Only available on native platforms (iOS/Android).
 */
export const checkPushPermissions = async (): Promise<NotificationPermissionStatus> => {
  if (!Capacitor.isNativePlatform()) return 'denied';
  const result = await PushNotifications.checkPermissions();
  return result.receive as NotificationPermissionStatus;
};

/**
 * Request push notification permissions and register with FCM/APNs.
 * Only available on native platforms (iOS/Android).
 */
export const requestPushPermissions = async (): Promise<NotificationPermissionStatus> => {
  if (!Capacitor.isNativePlatform()) return 'denied';
  const result = await PushNotifications.requestPermissions();
  if (result.receive === 'granted') {
    await PushNotifications.register();
  }
  return result.receive as NotificationPermissionStatus;
};

// ─── Local Notifications ────────────────────────────────────────────────

let localNotificationIdCounter = 1000;

/**
 * Schedule a local notification immediately or after a delay.
 */
export const scheduleLocalNotification = async (
  payload: NotificationPayload,
): Promise<void> => {
  const permission = await requestLocalPermissions();
  if (permission !== 'granted') {
    console.warn('[Notifications] Local notification permission denied');
    return;
  }

  const notificationId = payload.id ?? localNotificationIdCounter++;

  const scheduleOptions: ScheduleOptions = {
    notifications: [
      {
        id: notificationId,
        title: payload.title,
        body: payload.body,
        extra: payload.data,
        ...(payload.scheduleInSeconds
          ? {
              schedule: {
                at: new Date(Date.now() + payload.scheduleInSeconds * 1000),
              },
            }
          : {}),
      },
    ],
  };

  await LocalNotifications.schedule(scheduleOptions);
  console.log(`[Notifications] Scheduled local notification #${notificationId}`);
};

/**
 * Cancel all pending local notifications.
 */
export const cancelAllLocalNotifications = async (): Promise<void> => {
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel({
      notifications: pending.notifications.map(n => ({ id: n.id })),
    });
  }
};

// ─── Push Notifications ─────────────────────────────────────────────────

/**
 * Register for push notifications (native only).
 * Returns the device token on success, null on web or failure.
 */
export const registerForPush = async (): Promise<string | null> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Notifications] Push not available on web');
    return null;
  }

  const permission = await requestPushPermissions();
  if (permission !== 'granted') {
    console.warn('[Notifications] Push notification permission denied');
    return null;
  }

  return new Promise(resolve => {
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('[Notifications] Push token:', token.value);
      resolve(token.value);
    });

    PushNotifications.addListener('registrationError', err => {
      console.error('[Notifications] Push registration failed:', err);
      resolve(null);
    });
  });
};

// ─── Listener Management ────────────────────────────────────────────────

/**
 * Set up all notification listeners (push + local).
 * Call this once during app initialization.
 * Returns a cleanup function to remove all listeners.
 */
export const setupNotificationListeners = (
  listeners: NotificationListeners,
): (() => void) => {
  const cleanupFns: Array<() => void> = [];

  // Local notification listeners
  LocalNotifications.addListener(
    'localNotificationReceived',
    (notification: LocalNotificationSchema) => {
      console.log('[Notifications] Local received:', notification);
      listeners.onLocalNotificationReceived?.(notification);
    },
  ).then(handle => cleanupFns.push(() => handle.remove()));

  LocalNotifications.addListener(
    'localNotificationActionPerformed',
    (action) => {
      console.log('[Notifications] Local tapped:', action);
      listeners.onLocalNotificationTapped?.(action);
    },
  ).then(handle => cleanupFns.push(() => handle.remove()));

  // Push notification listeners (native only)
  if (Capacitor.isNativePlatform()) {
    PushNotifications.addListener(
      'registration',
      (token: Token) => {
        console.log('[Notifications] Push token:', token.value);
        listeners.onPushTokenReceived?.(token.value);
      },
    ).then(handle => cleanupFns.push(() => handle.remove()));

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('[Notifications] Push received:', notification);
        listeners.onPushNotificationReceived?.(notification);
      },
    ).then(handle => cleanupFns.push(() => handle.remove()));

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action) => {
        console.log('[Notifications] Push tapped:', action);
        listeners.onPushNotificationTapped?.(action);
      },
    ).then(handle => cleanupFns.push(() => handle.remove()));
  }

  return () => {
    cleanupFns.forEach(fn => fn());
  };
};

// ─── Convenience ────────────────────────────────────────────────────────

/**
 * Initialize the full notification system.
 * - Requests local notification permissions
 * - Registers for push on native platforms
 * - Sets up all listeners
 *
 * Returns a cleanup function and the push token (if available).
 */
export const initializeNotifications = async (
  listeners: NotificationListeners = {},
): Promise<{ cleanup: () => void; pushToken: string | null }> => {
  // Set up listeners first
  const cleanup = setupNotificationListeners(listeners);

  // Request permissions
  await requestLocalPermissions();
  const pushToken = await registerForPush();

  return { cleanup, pushToken };
};

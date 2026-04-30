import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonToggle,
  IonLabel,
  IonNote,
  IonListHeader,
  IonBadge,
} from '@ionic/react';
import { Capacitor } from '@capacitor/core';

import Store from '../../store';
import * as selectors from '../../store/selectors';
import { setSettings, setNotificationPermission, setPushToken } from '../../store/actions';
import {
  requestLocalPermissions,
  registerForPush,
  cancelAllLocalNotifications,
  scheduleLocalNotification,
} from '../../services/notifications';

const Settings = () => {
  const settings = Store.useState(selectors.selectSettings);
  const permissionStatus = Store.useState(s => s.notificationPermission);
  const pushToken = Store.useState(s => s.pushToken);
  const [loading, setLoading] = useState(false);

  const handleNotificationToggle = async (checked: boolean) => {
    setLoading(true);

    try {
      if (checked) {
        // Request local notification permissions
        const localPerm = await requestLocalPermissions();
        setNotificationPermission(localPerm);

        // Register for push on native
        if (Capacitor.isNativePlatform()) {
          const token = await registerForPush();
          setPushToken(token);
        }

        // Send a welcome notification to confirm it works
        if (localPerm === 'granted') {
          await scheduleLocalNotification({
            title: '🔔 Notifications Enabled',
            body: 'You will now receive notifications from this app.',
            scheduleInSeconds: 1,
          });
        }
      } else {
        // Cancel pending notifications when disabled
        await cancelAllLocalNotifications();
      }

      setSettings({
        ...settings,
        enableNotifications: checked,
      });
    } catch (err) {
      console.error('[Settings] Notification toggle error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonListHeader>Notifications</IonListHeader>
        <IonList inset>
          <IonItem>
            <IonToggle
              checked={settings.enableNotifications}
              disabled={loading}
              onIonChange={e => handleNotificationToggle(e.target.checked)}
            >
              Enable Notifications
            </IonToggle>
          </IonItem>
          <IonItem>
            <IonLabel>Permission Status</IonLabel>
            <IonBadge
              slot="end"
              color={
                permissionStatus === 'granted'
                  ? 'success'
                  : permissionStatus === 'denied'
                    ? 'danger'
                    : 'medium'
              }
            >
              {permissionStatus}
            </IonBadge>
          </IonItem>
          {Capacitor.isNativePlatform() && (
            <IonItem>
              <IonLabel>Push Token</IonLabel>
              <IonNote slot="end" style={{ maxWidth: '60%', fontSize: 11 }}>
                {pushToken || 'Not registered'}
              </IonNote>
            </IonItem>
          )}
        </IonList>

        <IonListHeader>About</IonListHeader>
        <IonList inset>
          <IonItem>
            <IonLabel>Platform</IonLabel>
            <IonNote slot="end">{Capacitor.getPlatform()}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Native</IonLabel>
            <IonNote slot="end">
              {Capacitor.isNativePlatform() ? 'Yes' : 'No (Web)'}
            </IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Version</IonLabel>
            <IonNote slot="end">5.1.0</IonNote>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;

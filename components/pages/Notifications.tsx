import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonNote,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonBadge,
} from '@ionic/react';
import Store from '../../store';
import { selectNotifications } from '../../store/selectors';
import { removeNotification, clearNotifications } from '../../store/actions';

import { close, trashOutline } from 'ionicons/icons';
import { type NotificationItem } from '../../mock';

const NotificationItem = ({
  notification,
}: {
  notification: NotificationItem;
}) => (
  <IonItemSliding>
    <IonItem>
      <IonLabel>{notification.title}</IonLabel>
      <IonNote slot="end">{notification.when}</IonNote>
    </IonItem>
    <IonItemOptions side="end">
      <IonItemOption
        color="danger"
        onClick={() => removeNotification(notification.id)}
      >
        <IonIcon icon={trashOutline} slot="icon-only" />
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>
);

const Notifications = ({
  open,
  onDidDismiss,
}: {
  open: boolean;
  onDidDismiss: () => void;
}) => {
  const notifications = Store.useState(selectNotifications);

  return (
    <IonModal isOpen={open} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Notifications
            {notifications.length > 0 && (
              <IonBadge color="danger" style={{ marginLeft: 8, verticalAlign: 'middle' }}>
                {notifications.length}
              </IonBadge>
            )}
          </IonTitle>
          <IonButton
            slot="start"
            fill="clear"
            color="danger"
            onClick={() => clearNotifications()}
            disabled={notifications.length === 0}
            size="small"
          >
            Clear All
          </IonButton>
          <IonButton
            slot="end"
            fill="clear"
            color="dark"
            onClick={onDidDismiss}
          >
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notifications</IonTitle>
          </IonToolbar>
        </IonHeader>
        {notifications.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '50%',
              opacity: 0.5,
              fontSize: 16,
            }}
          >
            No notifications yet
          </div>
        ) : (
          <IonList>
            {notifications.map((notification, i) => (
              <NotificationItem notification={notification} key={notification.id} />
            ))}
          </IonList>
        )}
      </IonContent>
    </IonModal>
  );
};

export default Notifications;

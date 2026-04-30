import Image from 'next/image';
import Card from '../ui/Card';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
  IonBadge,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import Notifications from './Notifications';
import { useState } from 'react';
import { notificationsOutline, addOutline } from 'ionicons/icons';
import { selectHomeItems, selectNotifications } from '../../store/selectors';
import Store from '../../store';
import { addNotification } from '../../store/actions';
import { scheduleLocalNotification } from '../../services/notifications';

type FeedCardProps = {
  title: string;
  type: string;
  text: string;
  author: string;
  authorAvatar: string;
  image: string;
};

const FeedCard = ({
  title,
  type,
  text,
  author,
  authorAvatar,
  image,
}: FeedCardProps) => (
  <Card className="my-4 mx-auto">
    {image ? (
      <div className="h-32 w-full relative">
        <Image
          className="rounded-t-xl object-cover min-w-full min-h-full max-w-full max-h-full"
          src={image}
          alt=""
          fill
        />
      </div>
    ) : null}
    <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
      <h4 className="font-bold py-0 text-s text-gray-400 dark:text-gray-500 uppercase">
        {type}
      </h4>
      <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">
        {text}
      </p>
      <div className="flex items-center space-x-4">
        {authorAvatar ? (
          <div className="w-10 h-10 relative">
            <Image
              src={authorAvatar}
              className="rounded-full object-cover min-w-full min-h-full max-w-full max-h-full"
              alt=""
              fill
            />
          </div>
        ) : null}
        <h3 className="text-gray-500 dark:text-gray-200 m-l-8 text-sm font-medium">
          {author}
        </h3>
      </div>
    </div>
  </Card>
);

const Feed = () => {
  const homeItems = Store.useState(selectHomeItems);
  const notifications = Store.useState(selectNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleTestNotification = async () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add to in-app notification list
    addNotification({
      title: `Test notification at ${timeStr}`,
      when: 'just now',
    });

    // Also trigger a real local notification (1 second delay so you see it)
    try {
      await scheduleLocalNotification({
        title: '📱 Test Notification',
        body: `This was triggered at ${timeStr}`,
        scheduleInSeconds: 1,
      });
    } catch (err) {
      console.log('[Feed] Local notification skipped:', err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Feed</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={notificationsOutline} />
              {notifications.length > 0 && (
                <IonBadge
                  color="danger"
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 2,
                    fontSize: 10,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {notifications.length}
                </IonBadge>
              )}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Feed</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Notifications
          open={showNotifications}
          onDidDismiss={() => setShowNotifications(false)}
        />
        {homeItems.map((i, index) => (
          <FeedCard {...i} key={index} />
        ))}

        {/* FAB button to send a test notification */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={handleTestNotification}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Feed;

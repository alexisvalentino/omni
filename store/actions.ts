import Store from '.';
import { ListItem, NotificationItem, Settings, TodoListItem } from '../mock';

export const setMenuOpen = (open: boolean) => {
  Store.update(s => {
    s.menuOpen = open;
  });
};

export const setNotificationsOpen = (open: boolean) => {
  Store.update(s => {
    s.notificationsOpen = open;
  });
};

export const setSettings = (settings: Settings) => {
  Store.update(s => {
    s.settings = settings;
  });
};

// Notification actions

export const setPushToken = (token: string | null) => {
  Store.update(s => {
    s.pushToken = token;
  });
};

export const setNotificationPermission = (
  status: 'granted' | 'denied' | 'prompt' | 'unknown',
) => {
  Store.update(s => {
    s.notificationPermission = status;
  });
};

export const addNotification = (notification: Omit<NotificationItem, 'id'>) => {
  Store.update(s => {
    const maxId = s.notifications.reduce((max, n) => Math.max(max, n.id), 0);
    s.notifications = [
      { ...notification, id: maxId + 1 },
      ...s.notifications,
    ];
  });
};

export const removeNotification = (id: number) => {
  Store.update(s => {
    s.notifications = s.notifications.filter(n => n.id !== id);
  });
};

export const clearNotifications = () => {
  Store.update(s => {
    s.notifications = [];
  });
};

// App-specific actions

export const setDone = (
  list: TodoListItem,
  listItem: ListItem,
  done: boolean,
) => {
  Store.update((s, o) => {
    const listIndex = o.lists.findIndex(l => l === list);
    if (listIndex === -1) return;

    const items = o.lists[listIndex].items;
    const itemIndex = items?.findIndex(i => i === listItem);
    if (itemIndex === undefined || itemIndex < 0) return;

    const draftItem = s.lists[listIndex].items?.[itemIndex];
    if (!draftItem) return;

    draftItem.done = done;

    if (list === o.selectedList) {
      s.selectedList = s.lists[listIndex];
    }
  });
};


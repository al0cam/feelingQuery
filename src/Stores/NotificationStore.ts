import { writable } from 'svelte/store';
import type { Notification } from '../Models/Notification';



function createStore() {
    const { subscribe, set, update } = writable(<Notification[]>[]);

    function addNotification(message: string, type: string){
        const notification: Notification = {
            message: message,
            type: type,
            time: new Date(),
            timeout: 3000,
        }
        update((notifications) => {
            notifications.push(notification);
            return notifications;
        });
        setTimeout(() => {
            removeNotification(notification);
        }, notification.timeout);
    }

    function addSuccessNotification(message: string){
        addNotification(message, "success");
    }

    function addErrorNotification(message: string){
        addNotification(message, "error");
    }

    function addWarningNotification(message: string){
        addNotification(message, "warning");
    }

    function addInfoNotification(message: string){
        addNotification(message, "info");
    }


    function removeNotification(notification: Notification){
        update((notifications) => {
            notifications = notifications.filter((n) => n !== notification);
            return notifications;
        });
    }

    return {
        subscribe,
        addSuccessNotification,
        addErrorNotification,
        addWarningNotification,
        addInfoNotification,
        removeNotification,
    };
}

export const notificationStore = createStore();
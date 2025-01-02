if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.subscribe({
            userVisibleOnly: true, // Notifications will always be shown to the user
            applicationServerKey: '<YOUR_PUBLIC_VAPID_KEY>' // Replace with your public VAPID key
        }).then((subscription) => {
            console.log('User is subscribed:', subscription);

            // Send the subscription to your server for later use
            // For example, send the subscription to your backend for push notification management
        }).catch((error) => {
            console.error('Failed to subscribe user:', error);
        });
    });
}

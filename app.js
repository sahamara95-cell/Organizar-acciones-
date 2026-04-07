// app.js

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// IndexedDB management
let db;
const request = indexedDB.open('MyDatabase', 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore('actions', { keyPath: 'id' });
    objectStore.createIndex('action', 'action', { unique: false });
};

request.onsuccess = (event) => {
    db = event.target.result;
};

request.onerror = (event) => {
    console.error('Database error:', event.target.errorCode);
};

// CRUD operations
function addAction(action) {
    const transaction = db.transaction(['actions'], 'readwrite');
    const objectStore = transaction.objectStore('actions');
    objectStore.add(action);
}

function getAction(id) {
    const transaction = db.transaction(['actions']);
    const objectStore = transaction.objectStore('actions');
    const request = objectStore.get(id);
    request.onsuccess = () => {
        console.log('Action fetched:', request.result);
    };
}

function updateAction(action) {
    const transaction = db.transaction(['actions'], 'readwrite');
    const objectStore = transaction.objectStore('actions');
    objectStore.put(action);
}

function deleteAction(id) {
    const transaction = db.transaction(['actions'], 'readwrite');
    const objectStore = transaction.objectStore('actions');
    objectStore.delete(id);
}

// Filtering actions
function filterActions(criteria) {
    const actions = [];
    const transaction = db.transaction(['actions']);
    const objectStore = transaction.objectStore('actions');
    const request = objectStore.openCursor();
    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            if (cursor.value.action.includes(criteria)) {
                actions.push(cursor.value);
            }
            cursor.continue();
        }
    };
    return actions;
}

// Notifications
function showNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(message);
    }
}

// Install prompt handling
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
});

window.addEventListener('appinstalled', () => {
    console.log('App installed');
});

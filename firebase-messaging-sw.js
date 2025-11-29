importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyCJTximsAIxHZY2Aoct78mdsCaO6lHZ3v8",
  projectId: "calendar-reminder-tool-55444",
  messagingSenderId: "239027689161",
  appId: "1:239027689161:web:c17ff22ad7852a8111df18"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 🔔 バックグラウンドで通知を受信したときの表示処理
messaging.onBackgroundMessage(payload => {
  console.log("📬 バックグラウンド通知:", payload);
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body: body,
    icon: "assets/icon-192.png" //  通知アイコン
  });
});
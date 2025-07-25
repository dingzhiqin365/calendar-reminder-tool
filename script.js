import { getMessaging, getToken } from "firebase/messaging";


document.addEventListener("DOMContentLoaded", () => {
  // Firebase初期化
  const firebaseConfig = {
    apiKey: "AIzaSyCJTximsAIxHZY2Aoct78mdsCaO6lHZ3v8",
    projectId: "calendar-reminder-tool-55444",
    messagingSenderId: "239027689161",
    appId: "1:239027689161:web:c17ff22ad7852a8111df18"
  };
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Service Worker 登録
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("firebase-messaging-sw.js")
      .then(() => console.log("✅ Service Worker 登録済み"))
      .catch(err => console.error("❌ Service Worker エラー:", err));
  }


// 通知許可とトークン取得（VAPIDキーはCloud Messagingで確認）
messaging.requestPermission().then(() => {
  console.log("✅ 通知許可を取得");
  return messaging.getToken({ vapidKey: "BJUKHoScbrwavPrwjIUDvhtT-ZTT7Cs3zq_uwe6dmq1gE54Z245W3OLc-5Dfxffbo8dRJdp-OkcfMpYd7JfP7Jg" });
}).then(token => {
  console.log("🔑 通知トークン:", token);
}).catch(err => {
  console.error("通知エラー:", err);
});

// Service Worker 登録
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("firebase-messaging-sw.js")
    .then(() => console.log("✅ Service Worker 登録済み"))
    .catch(err => console.error("❌ Service Worker エラー:", err));
}

const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

function addReminder() {
  const date = document.getElementById("datePicker").value;
  const time = document.getElementById("timePicker").value;
  const event = document.getElementById("eventInput").value;
  const advance = parseInt(document.getElementById("advancePicker").value);

  if (date && time && event) {
    reminders.push({
      date,
      time,
      event,
      advanceHours: advance,
      reminded: false
    });
    localStorage.setItem("reminders", JSON.stringify(reminders));
    renderReminders();
  }
}

function renderReminders() {
  const list = document.getElementById("reminderList");
  list.innerHTML = "";
  reminders.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `📅 ${item.date} 🕒 ${item.time} - ${item.event}（${item.advanceHours}時間前）`;
    list.appendChild(li);
  });

  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

function notifyUser(message) {
  if (Notification.permission === "granted") {
    new Notification("リマインダー通知", {
      body: message,
      icon: "assets/icon-192.png"
    });
  } else {
    alert(message);
  }
}

function checkReminders() {
  const now = new Date();

  reminders.forEach(item => {
    const target = new Date(`${item.date}T${item.time}`);
    target.setHours(target.getHours() - item.advanceHours);

    const diff = target - now;

    if (diff > 0 && diff < 60000 && !item.reminded) {
      const msg = `🔔 「${item.event}」は ${item.time} に開始予定（${item.advanceHours}時間前通知）`;
      notifyUser(msg);
      item.reminded = true;
      localStorage.setItem("reminders", JSON.stringify(reminders));
    }
  });
}

function clearAllReminders() {
  if (confirm("すべてのリマインダーを削除しますか？")) {
    reminders.length = 0;
    localStorage.removeItem("reminders");
    renderReminders();
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// PWA インストールボタン処理
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("📥 インストールイベント発生"); // ←このログが出ればOK

  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById("installBtn");
  installBtn.style.display = "inline-block";

  installBtn.addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      deferredPrompt = null;
    });
  });
});

renderReminders();
setInterval(checkReminders, 60000);
});
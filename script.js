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
      icon: "assets/icon.png"
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
      const msg = `🔔 「${item.event}」は ${item.time} に開始予定です（${item.advanceHours}時間前通知）`;
      notifyUser(msg);
      item.reminded = true;
      localStorage.setItem("reminders", JSON.stringify(reminders));
    }
  });
}

function clearAllReminders() {
  if (confirm("全てのリマインダーを削除しますか？この操作は元に戻せません。")) {
    reminders.length = 0;
    localStorage.removeItem("reminders");
    renderReminders();
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

renderReminders();
setInterval(checkReminders, 60000);
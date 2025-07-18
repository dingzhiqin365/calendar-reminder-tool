const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

function addReminder() {
  const date = document.getElementById("datePicker").value;
  const event = document.getElementById("eventInput").value;
  if (date && event) {
    reminders.push({ date, event });
    localStorage.setItem("reminders", JSON.stringify(reminders));
    renderReminders();
  }
}

function renderReminders() {
  const list = document.getElementById("reminderList");
  list.innerHTML = "";
  const today = new Date().toISOString().split("T")[0];

  reminders.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.date}：${item.event}`;
    if (item.date === today) {
      li.style.backgroundColor = "#ffeb3b";  // 高亮显示
      alert(`今天的提醒：${item.event}`);   // 弹窗提醒一次
    }
    list.appendChild(li);
  });
}


function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}


renderReminders(); // 初始加载
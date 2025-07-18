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
  reminders.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.date}：${item.event}`;
    list.appendChild(li);
  });
}

renderReminders(); // 初始加载
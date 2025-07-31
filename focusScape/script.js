const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const tasksCompletedCounter = document.getElementById("tasks-completed");
const focusedMinutesEl = document.getElementById("focused-minutes");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const alarm = document.getElementById("alarmSound");

const toggleThemeBtn = document.getElementById("toggle-theme");

let tasksCompleted = 0;
let timer;
let timeLeft = 25 * 60; // 25 minutes
let isRunning = false;
let focusedMinutes = 0;
let sessionCount = 0;

// === Theme Toggle ===
document.addEventListener("DOMContentLoaded", () => {
  const toggleThemeBtn = document.getElementById("toggle-theme");

  // === Apply theme from localStorage ===
  const theme = localStorage.getItem("theme");
  if (theme === "dark" || theme === null) {
    document.body.classList.add("dark");
    toggleThemeBtn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    toggleThemeBtn.textContent = "🌙";
  }

  // === Toggle theme on button click ===
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggleThemeBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});

// === Save Tasks ===
function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll(".task").forEach(taskEl => {
    tasks.push({
      text: taskEl.querySelector(".task-text").textContent,
      completed: taskEl.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// === Load Tasks ===
function loadTasksFromLocalStorage() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => {
    const li = document.createElement("li");
    li.classList.add("task");
    if (task.completed) {
      li.classList.add("completed");
      tasksCompleted++;
    }
    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div class="buttons">
        <button class="complete-btn">✔️</button>
        <button class="delete-btn">❌</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  tasksCompletedCounter.textContent = tasksCompleted;
}

// === Add Task ===
const taskForm = document.getElementById("task-form");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); //  Prevent page reload

  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const li = document.createElement("li");
  li.classList.add("task");
  li.innerHTML = `
    <span class="task-text">${taskText}</span>
    <div class="buttons">
      <button class="complete-btn">✔️</button>
      <button class="delete-btn">❌</button>
    </div>
  `;
  taskList.appendChild(li);
  taskInput.value = "";
  saveTasksToLocalStorage();
});


// === Complete/Delete Task ===
taskList.addEventListener("click", (e) => {
  const item = e.target;
  const taskItem = item.closest("li");

  if (item.classList.contains("complete-btn")) {
    taskItem.classList.toggle("completed");
    taskItem.classList.contains("completed") ? tasksCompleted++ : tasksCompleted--;
    tasksCompletedCounter.textContent = tasksCompleted;
    saveTasksToLocalStorage();
  }

  if (item.classList.contains("delete-btn")) {
    if (taskItem.classList.contains("completed")) tasksCompleted--;
    taskItem.remove();
    tasksCompletedCounter.textContent = tasksCompleted;
    saveTasksToLocalStorage();
  }
});

// === Timer Logic ===
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
 return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

//session counter
timerDisplay.textContent = formatTime(timeLeft);
function updateSessionCount() {
  sessionCount++;
  focusedMinutes += 25;

  document.getElementById("session-count").textContent = `Sessions done: ${sessionCount}`;
  focusedMinutesEl.textContent = focusedMinutes;

  // Save to localStorage
  localStorage.setItem("sessionCount", sessionCount);
  localStorage.setItem("focusedMinutes", focusedMinutes);
}

// Start / Pause Timer
startBtn.addEventListener("click", () => {
  if (!isRunning) {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
      } else {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = "Start";
        alarm.play();
        alert("Time's up! Take a break 🧘");
        updateSessionCount();
      }
    }, 1000);

    isRunning = true;
    startBtn.textContent = "Pause";

    //preload alarm
    alarm.play().then(() => {
      alarm.pause();
      alarm.currentTime = 0;
    }).catch(err => {
      console.warn("Alarm preload failed:", err);
    });

  } else {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = "Start";
  }
});

// Reset Timer
resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  timeLeft = 25 * 60;
  timerDisplay.textContent = formatTime(timeLeft);
  isRunning = false;
  startBtn.textContent = "Start";
});
document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();
  const storedSessionCount = localStorage.getItem("sessionCount");
  const storedFocusedMinutes = localStorage.getItem("focusedMinutes");

  if (storedSessionCount !== null) {
    sessionCount = parseInt(storedSessionCount);
    document.getElementById("session-count").textContent = `Sessions done: ${sessionCount}`;
  }

  if (storedFocusedMinutes !== null) {
    focusedMinutes = parseInt(storedFocusedMinutes);
    focusedMinutesEl.textContent = focusedMinutes;
  }
});
//reset sessions
const resetSessionBtn = document.getElementById("reset-session");

resetSessionBtn.addEventListener("click", () => {
  sessionCount = 0;
  focusedMinutes = 0;

  document.getElementById("session-count").textContent = `Sessions done: ${sessionCount}`;
  focusedMinutesEl.textContent = focusedMinutes;

  // Update localStorage
  localStorage.setItem("sessionCount", sessionCount);
  localStorage.setItem("focusedMinutes", focusedMinutes);
});


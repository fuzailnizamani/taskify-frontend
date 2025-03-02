const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const BASE_URL = "https://taskify-backend-9p6b.onrender.com"; // Replace with your backend URL
import { getAccessToken } from "./login.js"; // Import from login.js
const addtask = document.getElementById("addTask");
const logoutButton = document.getElementById('logout-btn');

logoutButton.addEventListener('click', async function () {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      localStorage.removeItem("accessToken"); // ✅ Clear token
      alert('You have been logged out.');
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = 'login.html';
    } else {
      alert('Logout failed. Please try again.');
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("An error occurred. Please try again.");
  }
});

const token = getAccessToken(); // Get token from localStorage

if (!token) {
  alert("You are not logged in!");
  window.location.href = "login.html"; // Redirect if not logged in
}


// Fetch all tasks from the backend
async function fetchTasks() {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "Get",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// Add a new task
async function addTask() {
  if (inputBox.value === "") {
    alert("You must write something!");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: inputBox.value, completed: false }),
    });

    const newTask = await response.json();
    console.log("Auth check response:", newTask);
    inputBox.value = ""; // Clear input field
    fetchTasks(); // Refresh the task list
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

// Update a task (mark as completed or incomplete)
async function updateTask(id, completed) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ completed: !completed }),
    });
    const updatedTask = await response.json();
    console.log("Task updated successfully:", updatedTask);
    fetchTasks(); // Refresh the task list
    return updateTask;
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

// Delete a task
async function deleteTask(id) {
  try {
    await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    fetchTasks(); // Refresh the task list
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

addtask.addEventListener("click", () => { addTask() });

function displayTasks(tasks) {
  listContainer.innerHTML = ""; // Clear existing tasks

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.title;
    if (task.completed) {
      li.classList.add("checked");
    }

    // Add click event to mark task as completed/incomplete
    li.addEventListener("click", () => updateTask(task._id, task.completed));

    // Add delete button
    const span = document.createElement("span");
    span.innerHTML = "\u00d7"; // Unicode for '×'
    span.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent li click event from firing
      deleteTask(task._id);
    });

    li.appendChild(span);
    listContainer.appendChild(li);
  });
}

// Fetch tasks when the page loads
window.onload = fetchTasks;
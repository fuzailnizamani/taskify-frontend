const userBox = document.getElementById("username");
const passwordBox = document.getElementById("password");
const BASE_URL = "http://localhost:5000"; // Replace with your backend 
const loginButton = document.getElementById("login-button");
let accessToken = null;

async function validateLogin() {
  if (!userBox.value || !passwordBox.value) {
    alert("Username and password are both required.");
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ Allow cookies to be sent
      body: JSON.stringify({ username: userBox.value, pwd: passwordBox.value }),
    });


    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.accessToken; // Store token
    localStorage.setItem("accessToken", accessToken); // Store in localStorage

    userBox.value = "";
    passwordBox.value = "";

    return accessToken; // Return token

  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please try again.");
    userBox.value = "";
    passwordBox.value = "";
    // ✅ Clear the stored token on failed login
    localStorage.removeItem("accessToken");
    accessToken = null;
    return null;
  }
}

// Function to get stored access token
function getAccessToken() {
  return localStorage.getItem("accessToken"); // Retrieve from localStorage
}

// Add event listener for login button
if (loginButton) {
  loginButton.addEventListener("click", async () => {
    const token = await validateLogin();
    if (token) {
      setTimeout(() => {
        window.location.href = "taskmanager.html"; // Redirect if login is successful
      }, 1000);
    }
  });
}

// Export functions
export { validateLogin, getAccessToken };
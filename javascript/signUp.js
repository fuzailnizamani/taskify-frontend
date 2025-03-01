const userBox = document.getElementById("user-box");
const passwordBox = document.getElementById("password-box");
const linkButton = document.querySelector(".link-button");
const BASE_URL = "http://localhost:5000"; // Replace with your backend URL

addPasswordAndUsername = async () => {
  try {
    if (userBox.value === "" || passwordBox.value === "") {
      alert("username and password both required ");
      return;
    }

    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify({
        username: userBox.value,
        pwd: passwordBox.value
      }),
    });

    const message = await response.json();
    alert(message.message);
    userBox.value = "";
    passwordBox.value = "";
  } catch (error) {
    alert("Login failed. Please try again.");
    userBox.value = "";
    passwordBox.value = "";
  }
}

linkButton.addEventListener("click", () => addPasswordAndUsername());
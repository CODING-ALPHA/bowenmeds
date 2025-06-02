window.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const burger = document.getElementById("burger");
  const closeIcon = document.getElementById("close-icon");

  // Show sidebar
  burger.addEventListener("click", () => {
    sidebar.classList.add("open");
  });

  // Hide sidebar
  closeIcon.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  // Set username from localStorage
  const usernameElement = document.getElementById("username");
  
  // Try to get user data from localStorage
  const userData = localStorage.getItem("user");
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user && user.username) {
        usernameElement.textContent = user.username;
      } else {
        usernameElement.textContent = "User"; // Default if name not found
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
      usernameElement.textContent = "User"; // Default if parsing fails
    }
  } else {
    usernameElement.textContent = "User"; // Default if no user data
  }

  // Logout
  document.getElementById("logout").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Also remove token if exists
    window.location.href = "login.html"; // Redirect to login page
  });
});
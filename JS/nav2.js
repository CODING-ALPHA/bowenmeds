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

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Set username from localStorage
  const usernameElement = document.getElementById("username");

  // Try to get user data from localStorage
  const userData = localStorage.getItem("username");

  if (userData) {
    try {
      const user = userData;
      if (user) {
        usernameElement.textContent = capitalizeFirstLetter(user); // Capitalize first letter
      } else {
        usernameElement.textContent = "Admin"; // Default if name not found
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
      usernameElement.textContent = "Admin"; // Default if parsing fails
    }
  } else {
    usernameElement.textContent = "Admin"; // Default if no user data
  }

  // Logout
  document.getElementById("logout").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    localStorage.clear();
    // localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});

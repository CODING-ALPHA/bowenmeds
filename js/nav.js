// // Toggle mobile menu
// function toggleMenu() {
//   const navLinks = document.getElementById("navLinks");
//   navLinks.classList.toggle("show");
// }

// // Update cart count from localStorage
// document.addEventListener("DOMContentLoaded", () => {
//   const cartCount = document.getElementById("cartCount");
//   const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
//   cartCount.textContent = cartItems.length;

//   // Highlight active link
//   const currentPage = window.location.pathname.split("/").pop();
//   document.querySelectorAll(".nav-links a").forEach((link) => {
//     if (link.getAttribute("href") === currentPage) {
//       link.classList.add("active");
//     }
//   });
// });



// Toggle mobile menu
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
}

// Setup cart and auth UI
document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.getElementById("cartCount");
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartCount.textContent = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Highlight active link
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // Handle user login status
  const username = localStorage.getItem("username");
  const authSection = document.getElementById("authSection");

  if (username) {
    authSection.innerHTML = `
        <div class="dropdown">
          <button class="dropbtn">
            <i class="fas fa-user-circle"></i> ${username} <i class="fas fa-caret-down"></i>
          </button>
          <div class="dropdown-content">
            <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
          </div>
        </div>
      `;

    // Add logout functionality
    document
      .getElementById("logoutBtn")
      .addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "index.html";
      });
  }
});

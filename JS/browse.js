// DOM Elements
const medicinesGrid = document.getElementById("medicinesGrid");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const cartNotification = document.getElementById("cartNotification");
const notificationMessage = document.getElementById("notificationMessage");

// Modal elements
const modal = document.getElementById("registrationModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalActionButton = document.getElementById("modalActionButton");
const closeModal = document.querySelector(".close-modal");
const successIcon = document.querySelector(".modal-icon.success");
const errorIcon = document.querySelector(".modal-icon.error");

// Initialize cart
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let medicines = [];
updateCartCount();

// Show modal function
function showModal(type, title, message, callback) {
  successIcon.style.display = "none";
  errorIcon.style.display = "none";

  if (type === "success") {
    successIcon.style.display = "block";
  } else {
    errorIcon.style.display = "block";
  }

  modalTitle.textContent = title;
  modalMessage.textContent = message;

  modalActionButton.onclick = () => {
    hideModal();
    if (callback) callback();
  };

  modal.classList.add("show");
}

// Hide modal
function hideModal() {
  modal.classList.remove("show");
}

// Close modal on X or outside
closeModal.addEventListener("click", hideModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) hideModal();
});

// Fetch medicines from API
async function fetchMedicines() {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Accept: "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      "https://pharmacy-api-v746.onrender.com/api/Medicines",
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Show modal telling user to log in, but stay on index page
        showModal(
          // "error",
          "Unauthorized",
          "Please log in to shop medicines."
        );
        // Still clear token to avoid repeated failures
        localStorage.removeItem("token");
        // Proceed to render empty or partial medicines if any
        medicines = [];
        renderMedicines(medicines);
        return;
      }
      throw new Error("Failed to fetch medicines");
    }

    medicines = await response.json();
    renderMedicines(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    showModal(
      "error",
      "Fetch Failed",
      "Unable to load medicines. Please try again later."
    );
  }
}

// Render medicines
function renderMedicines(medicinesToRender) {
  medicinesGrid.innerHTML = "";

  medicinesToRender.forEach((medicine) => {
    const card = document.createElement("div");
    card.className = "medicine-card";
    card.innerHTML = `
      <h2 class="medicine-name">${medicine.name}</h2>
      <p class="price">₦${medicine.price.toLocaleString()}</p>
      <p class="description">${medicine.description}</p>
      <button class="add-to-cart" onclick="addToCart(${medicine.id})">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    `;
    medicinesGrid.appendChild(card);
  });
}

// Filter medicines
function filterMedicines() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm) ||
      medicine.description.toLowerCase().includes(searchTerm)
  );
  renderMedicines(filteredMedicines);
}

// Add to cart
function addToCart(medicineId) {
  const token = localStorage.getItem("token");

  if (!token) {
    showModal(
      "error",
      "Login Required",
      "Please log in to shop medicines."
    );
    return;
  }

  const medicine = medicines.find((m) => m.id === medicineId);
  const existingItem = cartItems.find((item) => item.id === medicineId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...medicine, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCartCount();
  showNotification(`${medicine.name} added to cart`);
}

// Update cart count
function updateCartCount() {
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

// Show cart notification
function showNotification(message) {
  notificationMessage.textContent = message;
  cartNotification.classList.add("show");
  setTimeout(hideNotification, 3000);
}

function hideNotification() {
  cartNotification.classList.remove("show");
}

// Toggle mobile menu
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
}

// Filter medicines on input
searchInput.addEventListener("input", filterMedicines);

// Initialize
fetchMedicines();

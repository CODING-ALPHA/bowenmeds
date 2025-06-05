document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://pharmacy-api-v746.onrender.com/api/Medicines";
  const token = localStorage.getItem("token");

  // DOM Elements
  const tableBody = document.getElementById("medicinesTableBody");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const noMedicines = document.getElementById("noMedicines");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const statusFilter = document.getElementById("statusFilter");
  const applyFiltersBtn = document.getElementById("applyFiltersBtn");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");

  // Modal Elements
  const medicineModal = document.getElementById("medicineModal");
  const viewMedicineModal = document.getElementById("viewMedicineModal");
  const deleteModal = document.getElementById("deleteModal");
  const medicineForm = document.getElementById("medicineForm");
  const modalTitle = document.getElementById("modalTitle");
  const addMedicineBtn = document.getElementById("addMedicineBtn");

  // Form Fields
  const medicineId = document.getElementById("medicineId");
  const medicineName = document.getElementById("medicineName");
  const medicineCategory = document.getElementById("medicineCategory");
  const medicinePrice = document.getElementById("medicinePrice");
  const medicineStock = document.getElementById("medicineStock");
  const medicineDescription = document.getElementById("medicineDescription");

  // View Modal Fields
  const viewMedicineName = document.getElementById("viewMedicineName");
  const viewMedicineId = document.getElementById("viewMedicineId");
  const viewMedicineCategory = document.getElementById("viewMedicineCategory");
  const viewMedicinePrice = document.getElementById("viewMedicinePrice");
  const viewMedicineStock = document.getElementById("viewMedicineStock");
  const viewMedicineDescription = document.getElementById(
    "viewMedicineDescription"
  );

  // Delete Modal Fields
  const deleteMedicineName = document.getElementById("deleteMedicineName");
  const deleteMedicineId = document.getElementById("deleteMedicineId");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  // Close buttons
  const closeButtons = document.querySelectorAll(".close-btn");

  // Global variables
  let medicines = [];
  let currentMedicineId = null;

  // Initialize the page
  init();

  function init() {
    loadMedicines();
    setupEventListeners();
  }

  function loadMedicines() {
    loadingIndicator.style.display = "block";
    noMedicines.style.display = "none";
    tableBody.innerHTML = "";

    fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch medicines");
        }
        return response.json();
      })
      .then((data) => {
        medicines = data;
        loadingIndicator.style.display = "none";

        if (medicines.length === 0) {
          noMedicines.style.display = "block";
          return;
        }

        renderMedicines(medicines);
      })
      .catch((error) => {
        loadingIndicator.style.display = "none";
        console.error("Error:", error);
        noMedicines.textContent = "Error loading medicines. Please try again.";
        noMedicines.style.display = "block";
      });
  }

  function renderMedicines(medicinesToRender) {
    tableBody.innerHTML = "";

    if (medicinesToRender.length === 0) {
      noMedicines.style.display = "block";
      return;
    }

    noMedicines.style.display = "none";

    medicinesToRender.forEach((medicine, index) => {
      const tr = document.createElement("tr");

      // Determine stock status
      let stockStatus = "";
      let stockClass = "";
      if (medicine.quantity === 0) {
        stockStatus = "Out of Stock";
        stockClass = "out-of-stock";
      } else if (medicine.quantity <= 10) {
        stockStatus = "Low Stock";
        stockClass = "low-stock";
      } else {
        stockStatus = "In Stock";
        stockClass = "in-stock";
      }

      tr.innerHTML = `
              <td>${index + 1}</td>
              <td>${medicine.name}</td>
              <td>${medicine.description}</td>
              <td>₦${medicine.price.toFixed(2)}</td>
              <td>${medicine.category}</td>
              <td><span class="stock-badge ${stockClass}">${stockStatus} (${
        medicine.quantity
      })</span></td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn view-btn" onclick="viewMedicine(${
                    medicine.id
                  })" title="View">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="action-btn edit-btn" onclick="editMedicine(${
                    medicine.id
                  })" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-btn delete-btn" onclick="confirmDelete(${
                    medicine.id
                  }, '${medicine.name.replace(/'/g, "\\'")}')" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            `;
      tableBody.appendChild(tr);
    });
  }

  function setupEventListeners() {
    // Add Medicine Button
    addMedicineBtn.addEventListener("click", () => {
      medicineForm.reset();
      medicineId.value = "";
      modalTitle.textContent = "Add New Medicine";
      medicineModal.style.display = "block";
    });

    // Close Modals
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        medicineModal.style.display = "none";
        viewMedicineModal.style.display = "none";
        deleteModal.style.display = "none";
      });
    });

    // Click outside modal to close
    window.addEventListener("click", (e) => {
      if (e.target === medicineModal) medicineModal.style.display = "none";
      if (e.target === viewMedicineModal)
        viewMedicineModal.style.display = "none";
      if (e.target === deleteModal) deleteModal.style.display = "none";
    });

    // Form Submission
    medicineForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveMedicine();
    });

    // Confirm Delete
    confirmDeleteBtn.addEventListener("click", deleteMedicine);

    // Search Input
    searchInput.addEventListener("input", () => {
      applyFilters();
    });

    // Apply Filters Button
    applyFiltersBtn.addEventListener("click", applyFilters);

    // Reset Filters Button
    resetFiltersBtn.addEventListener("click", () => {
      categoryFilter.value = "";
      statusFilter.value = "";
      searchInput.value = "";
      applyFilters();
    });
  }

  function saveMedicine() {
    const isEdit = medicineId.value !== "";
    const url = isEdit ? `${API_URL}/${medicineId.value}` : API_URL;
    const method = isEdit ? "PUT" : "POST";

    const medicineData = {
      id: isEdit ? parseInt(medicineId.value) : 0,
      name: medicineName.value,
      description: medicineDescription.value,
      price: parseFloat(medicinePrice.value),
      stock: parseInt(medicineStock.value),
      category: medicineCategory.value,
    };

    const saveBtn = document.getElementById("saveMedicineBtn");
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(medicineData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to ${isEdit ? "update" : "add"} medicine`);
        }
        // return response.json();
        return response;
      })
      .then(() => {
        medicineModal.style.display = "none";
        loadMedicines();
        showAlert(
          `Medicine ${isEdit ? "updated" : "added"} successfully!`,
          "success"
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        showAlert(
          `Failed to ${isEdit ? "update" : "add"} medicine. Please try again.`,
          "error"
        );
      })
      .finally(() => {
        saveBtn.disabled = false;
        saveBtn.innerHTML = "Save Medicine";
      });
  }

  function viewMedicine(id) {
    const medicine = medicines.find((m) => m.id === id);
    if (!medicine) return;

    viewMedicineName.textContent = medicine.name;
    viewMedicineId.textContent = medicine.id;
    viewMedicineCategory.textContent = medicine.category;
    viewMedicinePrice.textContent = medicine.price.toFixed(2);
    viewMedicineStock.textContent = medicine.quantity;
    viewMedicineDescription.textContent = medicine.description;

    viewMedicineModal.style.display = "block";
  }

  function editMedicine(id) {
    const medicine = medicines.find((m) => m.id === id);
    if (!medicine) return;

    medicineId.value = medicine.id;
    medicineName.value = medicine.name;
    medicineCategory.value = medicine.category;
    medicinePrice.value = medicine.price;
    medicineStock.value = medicine.quantity;
    medicineDescription.value = medicine.description;

    modalTitle.textContent = "Edit Medicine";
    medicineModal.style.display = "block";
  }

  function confirmDelete(id, name) {
    currentMedicineId = id;
    deleteMedicineId.textContent = id;
    deleteMedicineName.textContent = name;
    deleteModal.style.display = "block";
  }

  function deleteMedicine() {
    const deleteBtn = document.getElementById("confirmDeleteBtn");
    deleteBtn.disabled = true;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';

    fetch(`${API_URL}/${currentMedicineId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete medicine");
        }
        return response;
      })
      .then(() => {
        deleteModal.style.display = "none";
        loadMedicines();
        showAlert("Medicine deleted successfully!", "success");
      })
      .catch((error) => {
        console.error("Error:", error);
        showAlert("Failed to delete medicine. Please try again.", "error");
      })
      .finally(() => {
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = "Delete";
      });
  }

  function applyFilters() {
    const category = categoryFilter.value;
    const status = statusFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    let filteredMedicines = [...medicines];

    // Apply category filter
    if (category) {
      filteredMedicines = filteredMedicines.filter(
        (medicine) => medicine.category === category
      );
    }

    // Apply status filter
    if (status) {
      filteredMedicines = filteredMedicines.filter((medicine) => {
        if (status === "in-stock") return medicine.quantity > 10;
        if (status === "low-stock")
          return medicine.quantity > 0 && medicine.quantity <= 10;
        if (status === "out-of-stock") return medicine.quantity === 0;
        return true;
      });
    }

    // Apply search filter
    if (searchTerm) {
      filteredMedicines = filteredMedicines.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchTerm) ||
          medicine.description.toLowerCase().includes(searchTerm) ||
          medicine.category.toLowerCase().includes(searchTerm) ||
          medicine.id.toString().includes(searchTerm)
      );
    }

    renderMedicines(filteredMedicines);
  }

  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  // Make functions available globally for inline event handlers
  window.viewMedicine = viewMedicine;
  window.editMedicine = editMedicine;
  window.confirmDelete = confirmDelete;
});

// Add some basic styles for alerts
const style = document.createElement("style");
style.textContent = `
        .alert {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 4px;
          color: white;
          z-index: 1001;
          animation: slideIn 0.5s, slideOut 0.5s 2.5s;
        }
        .alert.success {
          background-color: #28a745;
        }
        .alert.error {
          background-color: #dc3545;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOut {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
      `;
document.head.appendChild(style);

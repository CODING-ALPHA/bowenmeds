document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Set username in header
  if (username) {
    document.getElementById("username").textContent = username;
  }

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  const searchIcon = document.getElementById("searchIcon");

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#medicine-list tr");

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  searchInput.addEventListener("input", handleSearch);
  searchIcon.addEventListener("click", handleSearch);

  // Fetch medicines
  fetch("https://pharmacy-api-v746.onrender.com/api/Medicines", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const medicineList = document.getElementById("medicine-list");
      const medicineCount = document.getElementById("medicine-count");
      const inStockCount = document.getElementById("instock-count");
      const outStockCount = document.getElementById("outstock-count");

      medicineList.innerHTML = "";

      // Calculate stock counts
      const inStock = data.filter((med) => med.quantity > 0).length;
      const outOfStock = data.filter((med) => med.quantity <= 0).length;

      // Update card values
      medicineCount.textContent = data.length;
      inStockCount.textContent = inStock;
      outStockCount.textContent = outOfStock;

      // Show only 6 recent medicines
      const limitedData = data.slice(0, 6);
      limitedData.forEach((med, index) => {
        const row = document.createElement("tr");

        // Determine stock status
        const stockStatus =
          med.quantity > 0
            ? `<span class="stock-badge in-stock">In Stock (${med.quantity})</span>`
            : `<span class="stock-badge out-of-stock">Out of Stock</span>`;

        row.innerHTML = `
              <td>${index + 1}</td>
              <td>${med.name}</td>
              <td>${med.category}</td>
              <td>₦${med.price.toFixed(2)}</td>
              <td>${stockStatus}</td>
            `;
        medicineList.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching medicines:", error);
    });

  // Fetch customer count
  fetch("https://pharmacy-api-v746.onrender.com/api/Users/count", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("customer-count").textContent = data;
    })
    .catch((error) => {
      console.error("Error fetching customer count:", error);
    });

  // Sample revenue data (replace with actual API call if available)
  document.getElementById("revenue").textContent = "24,780";

  // Logout functionality
  document.getElementById("logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "index.html";
  });
});

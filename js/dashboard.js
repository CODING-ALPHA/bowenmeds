const token = localStorage.getItem("token");

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
    medicineList.innerHTML = "";

    const limitedData = data.slice(0, 6); // Show only 6 medicines
    limitedData.forEach((med, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${med.name}</td>
        <td>${med.category}</td>
        <td>₦${med.price}</td>
        <td>${med.quantity}</td>
      `;
      medicineList.appendChild(row);
    });

    medicineCount.textContent = data.length;
  })
  .catch((error) => {
    console.error("Error fetching medicines:", error);
  });

// // Fetch customer count
// fetch("https://pharmacy-api-v746.onrender.com/api/Customers/count", {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// })
//   .then((response) => response.json())
//   .then((data) => {
//     const customerCount = document.getElementById("customer-count");
//     customerCount.textContent = data.count ?? 0;
//   })
//   .catch((error) => {
//     console.error("Error fetching customer count:", error);
//   });

function showMedicineDetails() {
    const med = JSON.parse(localStorage.getItem("selectedMedicine"));
  
    if (!med) {
      document.body.innerHTML = "<p>Medicine not found. Go back and try again.</p>";
      return;
    }
  
    document.getElementById("medName").textContent = med.name;
    document.getElementById("medDescription").innerHTML = `<strong>Description:</strong> ${med.description}`;
    document.getElementById("medPrice").innerHTML = `<strong>Price:</strong> ${med.price}`;
  }
  
  function goBack() {
    window.location.href = "browse.html";
  }
  
  window.onload = showMedicineDetails;
  
document.addEventListener("DOMContentLoaded", () => {
  // Load cart items from localStorage
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  // DOM Elements
  const orderSummary = document.querySelector(".order-summary .checkout-section");
  const completeOrderBtn = document.querySelector(".btn-primary");
  const continueShoppingBtn = document.querySelector(".btn-outline");
  const checkoutForm = document.querySelector(".checkout-form");

  // If no items in cart, redirect to cart page
  if (cartItems.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  // Render order summary
  renderOrderSummary(cartItems);

  // Handle form submission
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      processCheckout();
    });
  }

  // Complete order button
  if (completeOrderBtn) {
    completeOrderBtn.addEventListener("click", processCheckout);
  }

  // Continue shopping button
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", () => {
      window.location.href = "products.html";
    });
  }

  // Payment method selection
  const paymentMethods = document.querySelectorAll(".payment-method");
  paymentMethods.forEach((method) => {
    method.addEventListener("click", () => {
      // Remove active class and check icon from all methods
      paymentMethods.forEach((m) => {
        m.classList.remove("active");
        const checkIcon = m.querySelector(".fa-check-circle");
        if (checkIcon) checkIcon.style.display = "none";
      });

      // Add active class and show check icon for selected method
      method.classList.add("active");
      const checkIcon = method.querySelector(".fa-check-circle");
      if (!checkIcon) {
        // Create check icon if it doesn't exist
        const icon = document.createElement("i");
        icon.className = "fas fa-check-circle";
        method.appendChild(icon);
      } else {
        checkIcon.style.display = "block";
      }
    });
  });

  // Quantity adjustment buttons
  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const itemIndex = parseInt(button.closest(".cart-item").dataset.index);
      const qtyElement = button.parentElement.querySelector(".qty-value");
      let quantity = parseInt(qtyElement.textContent);

      if (button.textContent === "+") {
        quantity++;
      } else if (button.textContent === "-" && quantity > 1) {
        quantity--;
      }

      qtyElement.textContent = quantity;
      updateCartItem(itemIndex, quantity);
    });
  });
});

// Render order summary with cart items
function renderOrderSummary(cartItems) {
  const orderSummary = document.querySelector(".order-summary .checkout-section");
  if (!orderSummary) return;

  let subtotal = 0;
  const shippingFee = 500; // ₦500 flat shipping fee
  const taxRate = 0.075; // 7.5% tax

  // Clear existing items
  const existingItems = orderSummary.querySelectorAll(".cart-item");
  existingItems.forEach((item) => item.remove());

  // Add cart items
  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.dataset.index = index;
    cartItem.innerHTML = `
      <div class="cart-item-icon">
        <i class="fas fa-pills"></i>
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn">+</button>
        </div>
      </div>
    `;
    orderSummary.insertBefore(
      cartItem,
      orderSummary.querySelector(".summary-row")
    );
  });

  // Calculate totals
  const tax = subtotal * taxRate;
  const total = subtotal + shippingFee + tax;

  // Update summary rows
  const summaryRows = orderSummary.querySelectorAll(".summary-row");
  if (summaryRows.length >= 3) {
    summaryRows[0].querySelector(
      "span:last-child"
    ).textContent = `₦${subtotal.toLocaleString()}`;
    summaryRows[1].querySelector(
      "span:last-child"
    ).textContent = `₦${shippingFee.toLocaleString()}`;
    summaryRows[2].querySelector(
      "span:last-child"
    ).textContent = `₦${tax.toLocaleString()}`;
    orderSummary.querySelector(
      ".summary-total span:last-child"
    ).textContent = `₦${total.toLocaleString()}`;
  }
}

// Update cart item quantity
function updateCartItem(index, newQuantity) {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  if (index >= 0 && index < cartItems.length) {
    cartItems[index].quantity = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cartItems));
    renderOrderSummary(cartItems);
  }
}

// Process checkout
function processCheckout() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Get form data
  const formData = {
    customer: {
      firstName: document.getElementById("first-name").value,
      lastName: document.getElementById("last-name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
    },
    delivery: {
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      zip: document.getElementById("zip").value,
      country: document.getElementById("country").value,
    },
    payment: {
      method:
        document
          .querySelector(".payment-method.active")
          ?.querySelector(".method-title")?.textContent || "Unknown",
    },
    items: cartItems,
    total: calculateTotal(cartItems),
  };

  // Validate form
  if (!validateCheckoutForm(formData)) {
    return;
  }

  // In a real app, you would send this data to your server
  console.log("Checkout data:", formData);

  // Show success message
  alert("Order placed successfully! Thank you for your purchase.");

  // Clear cart and redirect
  localStorage.removeItem("cart");
  window.location.href = "order-confirmation.html";
}

// Calculate total price
function calculateTotal(cartItems) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 500; // ₦500 flat shipping fee
  const taxRate = 0.075; // 7.5% tax
  const tax = subtotal * taxRate;
  return subtotal + shippingFee + tax;
}

// Validate checkout form
function validateCheckoutForm(formData) {
  const requiredFields = [
    { field: formData.customer.firstName, name: "First Name" },
    { field: formData.customer.lastName, name: "Last Name" },
    { field: formData.customer.email, name: "Email" },
    { field: formData.customer.phone, name: "Phone Number" },
    { field: formData.delivery.address, name: "Address" },
    { field: formData.delivery.city, name: "City" },
    { field: formData.delivery.zip, name: "ZIP Code" },
    { field: formData.delivery.country, name: "Country" },
  ];

  for (const { field, name } of requiredFields) {
    if (!field || !field.trim()) {
      alert(`Please fill in the ${name} field`);
      return false;
    }
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.customer.email)) {
    alert("Please enter a valid email address");
    return false;
  }

  return true;
}
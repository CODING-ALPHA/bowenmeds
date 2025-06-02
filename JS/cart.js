 let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
      const cartGrid = document.getElementById("cartItems");
      const totalPriceEl = document.getElementById("totalPrice");
      const checkoutBtn = document.getElementById("checkoutBtn");

      if (!cartGrid || !totalPriceEl || !checkoutBtn) {
        console.error("Missing required elements in HTML");
        return;
      }

      cartGrid.innerHTML = "";

      if (cartItems.length === 0) {
        cartGrid.innerHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <p>Your cart is empty</p>
            <a href="index.html" class="browse-btn">
               Browse Medicines
            </a>
          </div>
        `;
        totalPriceEl.textContent = "₦0";
        checkoutBtn.disabled = true;
        return;
      }

      checkoutBtn.disabled = false;
      let total = 0;

      cartItems.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
          <div class="item-info">
            <h2 class="medicine-name">${item.name}</h2>
            <p class="description">${item.description || ''}</p>
          </div>
          <div class="item-controls">
            <div class="quantity-row">
              <div class="quantity-controls">
                <button class="qty-btn minus" onclick="adjustQuantity(${index}, -1)">
                  <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn plus" onclick="adjustQuantity(${index}, 1)">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <span class="price">₦${(item.price * item.quantity).toLocaleString()}</span>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        `;
        cartGrid.appendChild(div);
      });

      totalPriceEl.textContent = `₦${total.toLocaleString()}`;
    }

    function adjustQuantity(index, change) {
      const newQuantity = cartItems[index].quantity + change;
      if (newQuantity >= 1) {
        cartItems[index].quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cartItems));
        renderCart();
      }
    }

    function removeItem(index) {
      cartItems.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      renderCart();
    }

    function checkout() {
      if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      window.location.href = "checkout.html";
    }

    // Initialize cart on page load
    document.addEventListener("DOMContentLoaded", renderCart);
// DOM Elements
const form = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");

// Modal elements
const modal = document.getElementById("registrationModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalActionButton = document.getElementById("modalActionButton");
const closeModal = document.querySelector(".close-modal");
const successIcon = document.querySelector(".modal-icon.success");
const errorIcon = document.querySelector(".modal-icon.error");

// Validation patterns
const validationRules = {
  username: {
    minLength: 3,
    errorMessage: "Username must be at least 3 characters",
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address",
  },
  password: {
    minLength: 6,
    errorMessage: "Password must be at least 6 characters",
  },
};

// Initialize form validation
function initFormValidation() {
  // Validate on input change
  usernameInput.addEventListener("input", () => validateField("username"));
  emailInput.addEventListener("input", () => validateField("email"));
  passwordInput.addEventListener("input", () => validateField("password"));

  // Validate on form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate all fields
    const isUsernameValid = validateField("username");
    const isEmailValid = validateField("email");
    const isPasswordValid = validateField("password");

    if (isUsernameValid && isEmailValid && isPasswordValid) {
      await submitForm();
    }
  });
}

// Validate a single field
function validateField(fieldName) {
  const input = document.getElementById(fieldName);
  const inputGroup = input.parentElement.parentElement; // Changed to match HTML structure
  const errorMessage = inputGroup.querySelector(".error-message");
  const value = input.value.trim();
  let isValid = false;

  if (fieldName === "username") {
    isValid = value.length >= validationRules.username.minLength;
    errorMessage.textContent = validationRules.username.errorMessage;
  } else if (fieldName === "email") {
    isValid = validationRules.email.regex.test(value);
    errorMessage.textContent = validationRules.email.errorMessage;
  } else if (fieldName === "password") {
    isValid = value.length >= validationRules.password.minLength;
    errorMessage.textContent = validationRules.password.errorMessage;
  }

  if (value === "") {
    inputGroup.classList.remove("success", "error");
    errorMessage.style.display = "none";
    return false;
  }

  if (isValid) {
    inputGroup.classList.add("success");
    inputGroup.classList.remove("error");
    errorMessage.style.display = "none";
  } else {
    inputGroup.classList.add("error");
    inputGroup.classList.remove("success");
    errorMessage.style.display = "block";
  }

  return isValid;
}

// Show modal function
function showModal(type, title, message, callback) {
  // Hide all icons first
  successIcon.style.display = "none";
  errorIcon.style.display = "none";

  // Show correct icon
  if (type === "success") {
    successIcon.style.display = "block";
  } else {
    errorIcon.style.display = "block";
  }

  // Set content
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  // Set button action
  modalActionButton.onclick = () => {
    hideModal();
    if (callback) callback();
  };

  // Show modal
  modal.classList.add("show");
}

// Hide modal
function hideModal() {
  modal.classList.remove("show");
}

// Close modal when clicking X or outside
closeModal.addEventListener("click", hideModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) hideModal();
});

// submitForm function
async function submitForm() {
  const user = {
    username: usernameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
    role: "customer", // Default role for registration
  };

  try {
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Registering...';

    const response = await fetch(
      "https://pharmacy-api-v746.onrender.com/api/Auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    let responseText = await response.text();
    let responseData;

    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      // If response isn't JSON, use the raw text as error message
      if (!response.ok) {
        throw new Error(responseText || "Registration failed");
      }
      responseData = {};
    }

    if (!response.ok) {
      let errorMessage = "Registration failed. Please try again.";

      if (responseData.errors) {
        errorMessage = Object.values(responseData.errors).join("\n");
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseText) {
        errorMessage = responseText;
      }

      throw new Error(errorMessage);
    }

    // Success case
    showModal(
      "success",
      "Registration Successful!",
      "Your account has been created. You can now login.",
      () => {
        window.location.href = "login.html";
      }
    );
  } catch (error) {
    // console.error("Registration error:", error);

    // Clean up error message if it contains raw response text
    let userFriendlyError = error.message;
    if (
      userFriendlyError.includes("Username a") ||
      userFriendlyError.includes("Unexpected token")
    ) {
      userFriendlyError = "Please check your input: Username must be valid";
    }

    showModal(
      "error",
      "Registration Failed",
      userFriendlyError ||
        "An error occurred during registration. Please check your details and try again."
    );
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Register";
  }
}
// Initialize the form validation
initFormValidation();

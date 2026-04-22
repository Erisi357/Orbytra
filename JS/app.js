import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBiZEHYylpnhGqbBEpcPozwLmsLQArpHik",
  authDomain: "orbytra.firebaseapp.com",
  projectId: "orbytra",
  storageBucket: "orbytra.firebasestorage.app",
  messagingSenderId: "518433097458",
  appId: "1:518433097458:web:2029fcab5edbc11771b26b",
  measurementId: "G-25XJ0JGVZL",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 1. Requirement Elements
const reqLength = document.getElementById("req-length");
const reqSpecial = document.getElementById("req-special");
const reqNumber = document.getElementById("req-number");
const passwordInput = document.getElementById("reg-password");

// 2. Real-time Requirement Checker
if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;

    // Check Length (8+ characters based on your error message logic)
    if (value.length >= 8) {
      reqLength.classList.replace("text-danger", "text-success");
    } else {
      reqLength.classList.replace("text-success", "text-danger");
    }

    // Check for Number
    if (/\d/.test(value)) {
      reqNumber.classList.replace("text-danger", "text-success");
    } else {
      reqNumber.classList.replace("text-success", "text-danger");
    }

    // Check for Special Character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      reqSpecial.classList.replace("text-danger", "text-success");
    } else {
      reqSpecial.classList.replace("text-success", "text-danger");
    }
  });
}

// 3. Combined Click Listener for Buttons
document.addEventListener("click", (e) => {
  // SIGN IN LOGIC
  if (e.target && e.target.id === "sign-in-btn") {
    e.preventDefault();
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        window.location.href = "../index.html";
      })
      .catch((error) => {
        alert("Sign in failed: " + error.message);
      });
  }

  // SIGN UP LOGIC
  if (e.target && e.target.id === "sign-up-btn") {
    e.preventDefault();
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    // Optional: Stop signup if requirements aren't met
    if (password.length < 8 || !/\d/.test(password)) {
      alert("Please meet all password requirements first!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Account created successfully");
        window.location.href = "../index.html";
      })
      .catch((error) => {
        let msg = error.message;
        if (error.code === "auth/email-already-in-use")
          msg = "That email is already registered.";
        if (error.code === "auth/weak-password")
          msg = "Password should be at least 8 characters.";
        alert("Signup Failed: " + msg);
      });
  }
});

// Global Orb Dust (persisted in localStorage)
let orbDust = parseInt(localStorage.getItem("orbDust")) || 0;

// Update Orb Dust display on all pages
if (document.getElementById("orb-amount")) {
  document.getElementById("orb-amount").textContent = orbDust;
}

// CLICKER GAME LOGIC (only runs if elements exist)
if (document.getElementById("click-btn")) {
  // DOM Element References
  const clickBtn = document.getElementById("click-btn");
  const clickCountDisplay = document.getElementById("click-count");
  const orbAmountDisplay = document.getElementById("orb-amount");
  const rewardAlert = document.getElementById("reward-alert");

  // Game State Variables
  let clickCount = 0;
  const rewardThreshold = 10;
  const rewardAmount = 10;

  // Event Listener for Clicks
  clickBtn.addEventListener("click", () => {
    clickCount++;
    clickCountDisplay.textContent = clickCount;

    if (clickCount % rewardThreshold === 0 && clickCount > 0) {
      orbDust += rewardAmount;
      localStorage.setItem("orbDust", orbDust);
      orbAmountDisplay.textContent = orbDust;
      rewardAlert.classList.remove("d-none");
      setTimeout(() => {
        rewardAlert.classList.add("d-none");
      }, 2000);
    }
  });
}

// 4. Auth Observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is active: ", user.email);
  }
});

window.logout = async function () {
  const auth = getAuth();
  try {
    // 1. Tell Firebase to end the session
    await signOut(auth);

    // 2. Clear any local data you might have saved
    localStorage.clear();
    sessionStorage.clear();

    console.log("Logged out successfully!");

    // 3. Send the user back to the sign-in page
    window.location.href = "html/sign-in.html";
  } catch (error) {
    console.error("Error logging out:", error.message);
    alert("Logout failed: " + error.message);
  }
};
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

let isSignedIn = false;
let rewardsChecked = false;

function updateOrbDisplay() {
  const orbAmountEl = document.getElementById("orb-amount");
  if (orbAmountEl) orbAmountEl.textContent = orbDust;
}

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

function getAuthFormValues() {
  const email = document.getElementById("reg-email")?.value ?? "";
  const password = document.getElementById("reg-password")?.value ?? "";
  return { email: email.trim(), password };
}

function handleSignIn() {
  const { email, password } = getAuthFormValues();
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      window.location.href = "../index.html";
    })
    .catch((error) => {
      let message = "Sign in failed. Please check your credentials.";
      if (error.code === "auth/invalid-email")
        message = "Please enter a valid email address.";
      if (error.code === "auth/user-not-found")
        message = "No account found with that email.";
      if (error.code === "auth/wrong-password")
        message = "Incorrect password. Please try again.";
      if (error.code === "auth/too-many-requests")
        message = "Too many failed attempts. Please try again later.";
      alert(message);
    });
}

const signinForm = document.getElementById("signin-form");
if (signinForm) {
  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSignIn();
  });
}

// 3. Combined Click Listener for Buttons
document.addEventListener("click", (e) => {
  const clickTarget =
    e.target instanceof Element ? e.target : e.target.parentElement;
  const questTarget = clickTarget?.closest(
    'a[href$="clickerGame.html"], a[href$="memoryGame.html"], a[href$="Orbytra-Survey.html"], a[href$="EAGLE_ODYLPSurvey.html"], a[href$="Online-ShoppingSurvey.html"], a[href$="Orbytra-Video1.html"], a[href$="Orbytra-Video2.html"], button[data-bs-toggle="modal"]',
  );

  if (questTarget && !isSignedIn) {
    e.preventDefault();
    alert("You must sign in to access Quests and earn Orb Dust.");
    window.location.href = "/html/sign-in.html";
    return;
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
        window.location.href = "/html/shop.html";
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

const signInBtn = document.getElementById("signInBtn");

if (signInBtn) {
  signInBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Get the current page URL
    const currentPage = window.location.href;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        alert("You are already signed in!");
      } else {
        // Send them to sign-in.html but append the 'redirect' info
        // It will look like: /html/sign-in.html?returnTo=quest-page.html
        window.location.href = `/html/sign-in.html?returnTo=${encodeURIComponent(currentPage)}`;
      }
    });
  });
}

// Global Orb Dust (persisted in localStorage)
let orbDust = parseInt(localStorage.getItem("orbDust")) || 0;

// Update Orb Dust display on all pages
updateOrbDisplay();

window.addEventListener("focus", () => {
  orbDust = parseInt(localStorage.getItem("orbDust")) || 0;
  updateOrbDisplay();
});

window.addEventListener("storage", () => {
  orbDust = parseInt(localStorage.getItem("orbDust")) || 0;
  updateOrbDisplay();
});

// Reward Function (Daily and 12-hour)
function checkRewards(isSignedIn = false) {
  updateOrbDisplay();
  if (!isSignedIn) {
    return;
  }

  const now = Date.now();
  const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Check 12-hour reward
  const lastTwelveHourReward = localStorage.getItem("lastTwelveHourReward");
  if (
    !lastTwelveHourReward ||
    now - parseInt(lastTwelveHourReward) >= twelveHours
  ) {
    const twelveHourReward = 75;
    orbDust += twelveHourReward;
    localStorage.setItem("orbDust", orbDust);
    localStorage.setItem("lastTwelveHourReward", now.toString());
    alert(`12-hour reward! You have earned ${twelveHourReward} Orb Dusts!`);
  }

  // Check daily reward
  const lastDailyReward = localStorage.getItem("lastDailyReward");
  if (!lastDailyReward || now - parseInt(lastDailyReward) >= twentyFourHours) {
    const dailyReward = 150;
    orbDust += dailyReward;
    localStorage.setItem("orbDust", orbDust);
    localStorage.setItem("lastDailyReward", now.toString());
    alert(`Daily reward! You have earned ${dailyReward} Orb Dusts!`);
  }

  // Update display if element exists (after all rewards are processed)
  updateOrbDisplay();
  rewardsChecked = true;
}

// Check for rewards on page load
checkRewards(false);

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
    isSignedIn = true;
    console.log("User is active: ", user.email);
    if (!rewardsChecked) {
      checkRewards(true);
    }
  } else {
    isSignedIn = false;
    updateOrbDisplay();
  }
});

window.logout = async function () {
  const auth = getAuth();
  try {
    // Preserve orb balance and reward timestamps across logout
    const savedOrbDust = localStorage.getItem("orbDust");
    const lastTwelveHourReward = localStorage.getItem("lastTwelveHourReward");
    const lastDailyReward = localStorage.getItem("lastDailyReward");

    // 1. Tell Firebase to end the session
    await signOut(auth);

    // 2. Clear local data but preserve Orb Dust and reward timestamps
    localStorage.clear();
    sessionStorage.clear();

    // Restore Orb Dust and timestamps so logout/signin doesn't reset progress
    if (savedOrbDust) localStorage.setItem("orbDust", savedOrbDust);
    if (lastTwelveHourReward)
      localStorage.setItem("lastTwelveHourReward", lastTwelveHourReward);
    if (lastDailyReward)
      localStorage.setItem("lastDailyReward", lastDailyReward);

    console.log("Logged out successfully!");

    // 3. Send the user back to the sign-in page
    window.location.href = "/html/sign-in.html";
  } catch (error) {
    console.error("Error logging out:", error.message);
    alert("Logout failed: " + error.message);
  }
};

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
        // It will look like: sign-in.html?returnTo=quest-page.html
        window.location.href = `sign-in.html?returnTo=${encodeURIComponent(currentPage)}`;
      }
    });
  });
}

// Global Orb Dust (persisted in localStorage)
let orbDust = parseInt(localStorage.getItem("orbDust")) || 0;

// Update Orb Dust display on all pages
if (document.getElementById("orb-amount")) {
  document.getElementById("orb-amount").textContent = orbDust;
}

// Reward Function (Daily and 12-hour)
function checkRewards() {
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
  if (document.getElementById("orb-amount")) {
    document.getElementById("orb-amount").textContent = orbDust;
  }
}

// Check for rewards on page load
checkRewards();

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
    window.location.href = "/html/sign-in.html";
  } catch (error) {
    console.error("Error logging out:", error.message);
    alert("Logout failed: " + error.message);
  }
};

// memory game

// =======================
// SELECT ELEMENTS
// =======================

const cards = document.querySelectorAll(".card");
const scoreDisplay = document.querySelector(".map span");

// =======================
// GAME STATE VARIABLES
// =======================

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let pairsFound = 0;
const maxOrbsReward = 100;
const maxPairsFound = 8;

// =======================
// CREATE PAIRS
// =======================

// 8 pairs for 16 cards
const images = [
  "img1.png",
  "img2.png",
  "img3.png",
  "img4.png",
  "img5.png",
  "img6.png",
  "img7.png",
  "img8.png",
];

// duplicate array -> pairs
const gameImages = [...images, ...images];

// shuffle
gameImages.sort(() => Math.random() - 0.5);

// =======================
// ASSIGN IMAGES TO CARDS
// =======================

cards.forEach((card, index) => {
  const img = card.querySelector("img");

  // card back image (default)
  img.src = "../img/card.png";

  // store hidden image
  card.dataset.image = "../img/" + gameImages[index];

  // click listener
  card.addEventListener("click", flipCard);
});

// =======================
// FLIP CARD
// =======================

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  const img = this.querySelector("img");

  // show real image
  img.src = this.dataset.image;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkMatch();
}

// =======================
// CHECK MATCH
// =======================

function checkMatch() {
  const isMatch = firstCard.dataset.image === secondCard.dataset.image;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

// =======================
// MATCH FOUND
// =======================

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  pairsFound++;
  scoreDisplay.textContent = pairsFound;
  rewardOrbs();

  resetBoard();
}

// =======================
// NOT MATCHED
// =======================

function unflipCards() {
  setTimeout(() => {
    firstCard.querySelector("img").src = "../img/card.png";
    secondCard.querySelector("img").src = "../img/orb.png";

    resetBoard();
  }, 800);
}

// =======================
// RESET TURN
// =======================

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function rewardOrbs() {
  if (pairsFound == maxPairsFound) {
    orbDust += maxOrbsReward;
    localStorage.setItem("orbDust", orbDust);
    if (document.getElementById("orb-amount")) {
      document.getElementById("orb-amount").textContent = orbDust;
    }
    alert(`You have earned ${maxOrbsReward} Orb Dusts!`);
  }
}

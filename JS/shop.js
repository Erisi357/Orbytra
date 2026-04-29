// Select the card div
const parentDiv = document.querySelector("#parentQuestDiv");
// Card array
cards = [
	{
		type: "common",
		img: "../img/common1.png",
		alt: "Steel Marble",
		title: "Steel Marble",
		description: "Common Rarity Item",
		price: "100"
	},

	{
		type: "common",
		img: "../img/common2.png",
		alt: "Basic Sphere",
		title: "Basic Sphere",
		description: "Common Rarity Item",
		price: "250"
	},

	{
		type: "rare",
		img: "../img/rare1.png",
		alt: "Blood Stone",
		title: "Blood Stone",
		description: "Rare Rarity Item",
		price: "300"
	},

	{
		type: "rare",
		img: "../img/rare2.png",
		alt: "Crimson Shell",
		title: "Crimson Shell",
		description: "Rare Rarity Item",
		price: "500"
	},

	{
		type: "legendary",
		img: "../img/legendary1.png",
		alt: "Apex Emerald",
		title: "Apex Emerald",
		description: "Legendary Rarity Item",
		price: "700"
	},

	{
		type: "legendary",
		img: "../img/legendary2.png",
		alt: "Zenith Orb",
		title: "Zenith Orb",
		description: "Legendary Rarity Item",
		price: "950"
	},

	{
		type: "mythical",
		img: "../img/mythical1.png",
		alt: "Abyssal Flame",
		title: "Abyssal Flame",
		description: "Mythical Rarity Item",
		price: "1000"
	},

	{
		type: "mythical",
		img: "../img/mythical2.png",
		alt: "Eclipsed Core",
		title: "Eclipsed Core",
		description: "Mythical Rarity Item",
		price: "1200"
	},
];

// Create card
function createCard(img, alt, title, description, price, type) {
	const colDiv = document.createElement("div");
	colDiv.classList.add("col");

	const cardDiv = document.createElement("div");
	cardDiv.classList.add("card", "shop-card", "h-100", "p-4", "border-0", "shadow-sm", "rounded-4", "text-center", "bg-white");

	const cardImg = document.createElement("img");
	cardImg.src = img;
	cardImg.alt = alt;
	cardImg.classList.add("shop-card-img", "mx-auto", "mb-4");
	cardDiv.appendChild(cardImg);

	const cardBody = document.createElement("div");
	cardBody.classList.add("card-body", "p-0", "d-flex", "flex-column");
	cardDiv.appendChild(cardBody);

	const itemTitle = document.createElement("h5");
	itemTitle.classList.add("fw-bold", "font-orbitron", "text-dark");
	itemTitle.textContent = title;
	cardBody.appendChild(itemTitle);

	const itemP = document.createElement("p");
	itemP.classList.add("small", "text-muted", "font-monda", "mb-3");
	itemP.textContent = description;
	cardBody.appendChild(itemP);

	const buyDiv = document.createElement("div");
	buyDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "mt-auto", "border-top", "pt-3");
	cardBody.appendChild(buyDiv);

	const itemPrice = document.createElement("span");
	itemPrice.classList.add("fw-bold", "text-dark");
	itemPrice.textContent = price;
	buyDiv.appendChild(itemPrice);

	const buyButton = document.createElement("button");
	buyButton.classList.add("btn", "btn-gradient", "rounded-pill", "px-3");
	buyButton.textContent = "BUY";
	buyButton.addEventListener("click", function () {
		buyOrb(title, price, type);
	});
	buyDiv.appendChild(buyButton);

	colDiv.appendChild(cardDiv);
	return colDiv;
}

function buyOrb(title, price, type) {
	let orbDust = parseInt(localStorage.getItem("orbDust")) || 0;
	let itemPrice = Number(price);

	if (orbDust >= itemPrice) {
		orbDust -= itemPrice;
		localStorage.setItem("orbDust", orbDust);

		const orbAmount = document.querySelector("#orb-amount");
		if (orbAmount) {
			orbAmount.textContent = orbDust;
		}

		alert(`You bought ${title} (${type}) for the price of ${price} Orb Dust.`);
	} else {
		alert("Not enough Orb Dust!");
	}
}


// Display all cards
function displayAllCards(cards) {
	parentDiv.innerHTML = "";

	for (const card of cards) {
		parentDiv.appendChild(createCard(card.img, card.alt, card.title, card.description, card.price, card.type));
	}
}

// Display filtered cards
function displayCards(cards, filters) {
	parentDiv.innerHTML = "";

	for (const card of cards) {

		if (filters[0] && card.type === "common") {
			parentDiv.appendChild(createCard(card.img, card.alt, card.title, card.description, card.price, card.type));
		}

		if (filters[1] && card.type === "rare") {
			parentDiv.appendChild(createCard(card.img, card.alt, card.title, card.description, card.price, card.type));
		}

		if (filters[2] && card.type === "legendary") {
			parentDiv.appendChild(createCard(card.img, card.alt, card.title, card.description, card.price, card.type));
		}

		if (filters[3] && card.type === "mythical") {
			parentDiv.appendChild(createCard(card.img, card.alt, card.title, card.description, card.price, card.type));
		}
	}
}

// Filters
function updateFilters() {
	let filter = [];

	const common = document.querySelector("#cat1").checked;
	const rare = document.querySelector("#cat2").checked;
	const legendary = document.querySelector("#cat3").checked;
	const mythical = document.querySelector("#cat4").checked;

	filter.push(common);
	filter.push(rare);
	filter.push(legendary);
	filter.push(mythical);

	return filter;
}

// Checkboxes event
document.querySelectorAll(".form-check-input").forEach(cb => {
	cb.addEventListener("change", function () {
		let filter = updateFilters();

		if (!filter[0] && !filter[1] && !filter[2] && !filter[3]) {
			displayAllCards(cards);
		} else {
			displayCards(cards, filter);
		}
	});
});

// Price sorting
const selector = document.querySelector("#select");

selector.addEventListener("change", function () {
	const filters = updateFilters();

	let sorted = [...cards];

	if (selector.value === "low") {
		sorted.sort((a, b) => Number(a.price) - Number(b.price));
	} else {
		sorted.sort((a, b) => Number(b.price) - Number(a.price));
	}

	if (!filters[0] && !filters[1] && !filters[2] && !filters[3]) {
		displayAllCards(sorted);
	} else {
		displayCards(sorted, filters);
	}
});

// Initial render
displayAllCards(cards);

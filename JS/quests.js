// Card array

cards = [
	{
		type: "common",
		img: "/img/common1.png",
		alt: "Steel Marble",
		title: "Steel Marble",
		description: "Common Rarity Item",
		price: "100"
	},

	{
		type: "common",
		img: "/img/common2.png",
		alt: "Basic Sphere",
		title: "Basic Sphere",
		description: "Common Rarity Item",
		price: "250"
	},

	{
		type: "rare",
		img: "/img/rare1.png",
		alt: "Blood Stone",
		title: "Blood Stone",
		description: "Rare Rarity Item",
		price: "300"
	},

	{
		type: "rare",
		img: "/img/rare2.png",
		alt: "Crimson Shell",
		title: "Crimson Shell",
		description: "Rare Rarity Item",
		price: "500"
	},

	{
		type: "legendary",
		img: "/img/legendary1.png",
		alt: "Apex Emerald",
		title: "Apex Emerald",
		description: "Legendary Rarity Item",
		price: "700"
	},

	{
		type: "legendary",
		img: "/img/legendary2.png",
		alt: "Zenith Orb",
		title: "Zenith Orb",
		description: "Legendary Rarity Item",
		price: "950"
	},

	{
		type: "mythical",
		img: "/img/mythical1.png",
		alt: "Abyssal Flame",
		title: "Abyssal Flame",
		description: "Mythical Rarity Item",
		price: "1000"
	},

	{
		type: "mythical",
		img: "/img/mythical2.png",
		alt: "Eclipsed Core",
		title: "Eclipsed Core",
		description: "Mythical Rarity Item",
		price: "1200"
	},
]

// Checkboxes

function updateFilters() {
	filter = []

	const common = document.querySelector("#cat1").checked;
	const rare = document.querySelector("#cat2").checked;
	const legendary = document.querySelector("#cat3").checked;
	const mythical = document.querySelector("#cat4").checked;
	filter.push(common);
	filter.push(rare);
	filter.push(legendary);
	filter.push(mythical);

	return filter
}

const checkBoxes = document.querySelectorAll(".form-check-input").forEach(cb => {
	cb.addEventListener("change", function(){
		if (updateFilters()[0] == false && updateFilters()[1] == false && updateFilters()[2] == false && updateFilters()[3] == false) {
			displayAllCards(cards);
		}else {
			displayCards(cards, updateFilters());
		}
	});
});

// Select the card div

const parentDiv = document.querySelector("#parentQuestDiv");

//Create the cards function

function createCard(img, alt, title, description, price) {
	const colDiv = document.createElement("div")
	colDiv.classList.add("col")

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
	itemP.classList.add("small", "text-muted", "font-monda", "mb-3")
	itemP.textContent = description;
	cardBody.appendChild(itemP);

	const buyDiv = document.createElement("div")
	buyDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "mt-auto", "border-top", "pt-3");
	cardBody.appendChild(buyDiv);

	const itemPrice = document.createElement("span");
	itemPrice.classList.add("fw-bold", "text-dark");
	itemPrice.textContent = price;
	buyDiv.appendChild(itemPrice);

	const buyButton = document.createElement("button");
	buyButton.classList.add("btn", "btn-gradient", "rounded-pill", "px-3");
	buyButton.textContent = "BUY";
	buyDiv.appendChild(buyButton);

	colDiv.appendChild(cardDiv)
	return colDiv;
}

// Display Cards

function displayAllCards(cards) {
	parentDiv.innerHTML = "";

	for (const card of cards) {
		parentDiv.appendChild(createCard(card.img, card.alt, card.title, card.description, card.price));
	}
}

function displayCards(cards, filters) {
	parentDiv.innerHTML = "";

	for (const card of cards) {
	if (updateFilters()[0] == true && card.type == "common") {
		parentDiv.appendChild(createCard(card.img, card.alt, card.title, card.description, card.price));
	}

	if (updateFilters()[1] == true && card.type == "rare") {
		parentDiv.appendChild(createCard(card.img, card.alt, card.title, card.description, card.price));
	}

	if (updateFilters()[2] == true && card.type == "legendary") {
		parentDiv.appendChild(createCard(card.img, card.alt, card.title, card.description, card.price));
	}

	if (updateFilters()[3] == true && card.type == "mythical") {
		parentDiv.appendChild(createCard(card.img, card.alt, card.title, card.description, card.price));
	}
}
}

// Initial cards display

displayAllCards(cards);

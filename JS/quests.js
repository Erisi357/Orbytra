// Card array

cards = [
	{
		type: "gear",
		img: "",
		alt: "epic boots",
		title: "Epic Boots",
		description: "Very Epic Boots",
		price: "250"
	},

	{
		type: "gear",
		img: "",
		alt: "epic gloves",
		title: "Epic Gloves",
		description: "Very Epic Gloves",
		price: "150"
	},

	{
		type: "avatar",
		img: "",
		alt: "angel of control",
		title: "Angel of Control Skin",
		description: "Angel of Control skin out now!",
		price: "1000"
	}
]

// Checkboxes

function updateFilters() {
	filter = []

	const avatars = document.querySelector("#cat1").checked;
	const gear = document.querySelector("#cat2").checked;
	filter.push(avatars);
	filter.push(gear);

	return filter
}

const checkBoxes = document.querySelectorAll(".form-check-input").forEach(cb => {
	cb.addEventListener("change", function(){
		updateFilters();
	});
});

// Select the card div

const parentDiv = document.querySelector("#parentQuestDiv");

//Create the cards function

function createCard(img, alt, title, description, price) {
	const colDiv = document.createElement("div")
	colDiv.classList.add("col")

	const cardDiv = document.createElement("div");
	cardDiv.classList.add("card", "h-100", "p-3", "border-0", "shadow-sm", "rounded-4", "text-center", "bg-white");

	const imgDiv = document.createElement("div");
	imgDiv.classList.add("bg-light", "rounded-3", "mb-3", "py-5", "opacity-50");
	cardDiv.appendChild(imgDiv)

	const cardImg = document.createElement("img");
	cardImg.src = img;
	cardImg.alt = alt;
	imgDiv.appendChild(cardImg);

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

for (const card of cards) {
	parentDiv.appendChild(createCard(card.img, card.alt, card.title, card.description, card.price));
}
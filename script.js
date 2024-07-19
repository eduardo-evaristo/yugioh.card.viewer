// Accessing DOM elements
const cardSearch = document.getElementById("card-search");
const cardSearchList = document.getElementById("cards__search__list");
const cardSearchButton = document.querySelector(".card__search__button");
const cardImage = document.querySelector(".image");
const loader = document.querySelector(".loader");

// Initialization of variables
let checkIfAlreadySearching = false;
let timeoutId = null;

let data1;
// Event listener for input changes in the search field
cardSearch.addEventListener("input", function () {
  // Cancel previous timeout if exists
  clearTimeout(timeoutId);

  // Set new timeout to trigger search after 1000ms of inactivity
  timeoutId = setTimeout(() => {
    // Check if not already searching and the search field is not empty or just whitespace
    if (
      !checkIfAlreadySearching &&
      cardSearch.value !== "" &&
      cardSearch.value.trim() !== ""
    ) {
      // Execute search after another 1000ms delay
      setTimeout(() => {
        // Show loader so that people know it's looking up the cards list
        toggleLoader();
        getCardsInfo();
      }, 1000);

      // Log the current value of the search field
      console.log(cardSearch.value);

      // Clear previous search results in the list
      cardSearchList.innerHTML = "";

      // Set flag to indicate searching is now in progress
      checkIfAlreadySearching = !checkIfAlreadySearching;
    }
  }, 1000);
});

cardSearchButton.addEventListener("click", function () {
  toggleLoader();
  const cardToBeSearched = cardSearch.value;
  getCardInfo(cardToBeSearched);
});

// Function to fetch card information and display them in the input's data list
/*
function getCardsInfo() {
  const ygoRequest = new XMLHttpRequest();
  ygoRequest.open("GET", `https://db.ygoprodeck.com/api/v7/cardinfo.php`);
  console.log(ygoRequest);
  ygoRequest.addEventListener("load", function () {
    // Handle successful response from API
    if (ygoRequest.status !== 200) {
      console.error("Something went wrong");
      // Reset searching flag on error
      checkIfAlreadySearching = false;
    } else {
      // Log completion of search
      console.log("search done");

      // Parse response data
      const { data } = JSON.parse(ygoRequest.responseText);
      data1 = data;
      // Iterate through data and create list elements
      for (const card of data) {
        createListElement(card);
      }

      // Reset searching flag after processing data
      checkIfAlreadySearching = false;
    }
  });

  // Send the API request
  ygoRequest.send();
}
*/

// Function to toggle loader
function toggleLoader() {
  loader.classList.toggle("hidden");
}

// Function to get info about all cards
function getCardsInfo() {
  fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php")
    .then((response) => response.json())
    .then(({ data }) => {
      const cards = data;
      cards.forEach((card) => createListElement(card));
    })
    .catch((error) => {
      console.error(error.message);
    })
    .finally(() => {
      checkIfAlreadySearching = false;
      // Toggle loader no matter what
      toggleLoader();
    });
}

//Function to get specific card data
function getCardInfo(cardName) {
  fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${cardName}`)
    .then((response) => response.json())
    .then(({ data }) => renderCardImage(data[0].card_images[0].image_url))
    .finally(() => toggleLoader());
}

// Function to create HTML list elements
function createListElement(data) {
  const html = `<option>${data.name}`;
  cardSearchList.insertAdjacentHTML("beforeend", html);
}

function renderCardImage(image) {
  cardImage.src = "";
  cardImage.src = image;
  cardImage.style.width = "380px;";
}

function renderCardInfo(card) {}

let arrayAF;
let arrayGL;
let arrayMR;
let arraySZ;
let localArray;

function divideIntoThreeArrays(array) {
  //const regexes = { G: /\bG\b/, M: /(?:^|\s)M\b(?![-.])/i, S: /\bS\b/ };
  const initialLetters = ["G", "M", "S"];
  //We cannot dynamically create variables w template literals, so I used an object, and I store the intended names for variables as properties in the object
  const indices = {};
  /*
  for (const [id, regex] of Object.entries(regexes)) {
    indices[`first${id}Index`] = array.findIndex((item) =>
      regex.test(item.name)
    );
  }
  */

  for (const letter of initialLetters) {
    indices[`first${letter}Index`] = array.findIndex((item) =>
      item.name.startsWith(letter)
    );
  }

  //Creating array slices
  arrayAF = array.slice(0, indices.firstGIndex);
  arrayGL = array.slice(indices.firstGIndex, indices.firstMIndex);
  arrayMR = array.slice(indices.firstMIndex, indices.firstSIndex);
  arraySZ = array.slice(indices.firstSIndex);
  //Divided array
  localArray = [arrayAF, arrayGL, arrayMR, arraySZ];
  //Emptying out data1
  //data1 = [];
}

function lookUpCard(cardName) {
  //prettier-ignore
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const firstLetterIndex = alphabet.indexOf(cardName[0].toUpperCase());
  console.log(firstLetterIndex);

  if (firstLetterIndex >= 0 && firstLetterIndex <= 5) {
    return localArray[0].find((item) => item.name === cardName);
  } else if (firstLetterIndex >= 6 && firstLetterIndex <= 11) {
    return localArray[1].find((item) => item.name === cardName);
  } else if (firstLetterIndex >= 12 && firstLetterIndex <= 17) {
    return localArray[2].find((item) => item.name === cardName);
  } else if (firstLetterIndex >= 18) {
    return localArray[3].find((item) => item.name === cardName);
  }
}

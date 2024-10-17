// ----- pokemon-api.js
const baseUrl = "https://pokeapi.co/api/v2/pokemon?limit=500";

class PokemonAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getPokemonList() {
    const response = await axios.get(baseUrl);
    const pokemonList = response.data.results;
    return pokemonList;
  }

  async getPokemonDetails(pokemonList) {
    try {
      const pokemonEndpoints = pokemonList.map(async function (pokemon) {
        const response = await axios.get(pokemon.url);
        return response;
      });

      const pokemonDetails = await Promise.all(pokemonEndpoints);
      return pokemonDetails;
    } catch (error) {
      console.error(error);
    }
  }
}

const pokemonApi = new PokemonAPI(baseUrl);

async function fetchPokemon(userHeight, userWeight) {
  try {
    const pokemonList = await pokemonApi.getPokemonList();
    const pokemonDetails = await pokemonApi.getPokemonDetails(pokemonList);

    const filteredPokemon = pokemonDetails.filter(function (pokemon) {
      const tolerance = 0.07;
      return (
        pokemon.data.height >= userHeight * (1 - tolerance) &&
        pokemon.data.height <= userHeight * (1 + tolerance) &&
        pokemon.data.weight >= userWeight * (1 - tolerance) &&
        pokemon.data.weight <= userWeight * (1 + tolerance)
      );
    });

    filteredPokemon.forEach((pokemon) => {
      buildResultsCard(pokemon);
    });

    renderResults(filteredPokemon);

    return filteredPokemon;
  } catch (error) {
    console.error(error);
  }
}

const resultsSection = document.getElementById("results");
const resultsContainer = document.querySelector(".results__container");
const resultsMessage = document.querySelector(".results__message");

function renderResults(pokemonResults) {
  resultsContainer.innerHTML = "";

  if (pokemonResults.length === 0) {
    resultsMessage.classList.remove("results__message--hidden");
  } else {
    resultsMessage.classList.add("results__message--hidden");
  }
  
  pokemonResults.forEach((result) => {
    buildResultsCard(result);
  });
  
  resultsSection.scrollIntoView({block: "end"});
}

function buildResultsCard(result) {

  const resultsCard = createElement("article", "results__card");
  appendElement(resultsCard, resultsContainer);

  const resultsName = createElement("h3", "results__name");
  resultsName.textContent = result.data.name;
  appendElement(resultsName, resultsCard);

  const resultsSprite = createElement("img", "results__sprite");
  resultsSprite.setAttribute(
    "src",
    result.data.sprites.other.home.front_default
  );
  appendElement(resultsSprite, resultsCard);
}

function createElement(elType, classes) {
  const newElement = document.createElement(elType);
  newElement.classList.add(classes);
  return newElement;
}

function appendElement(elementToAppend, appendLocation) {
  appendLocation.appendChild(elementToAppend);
}

const form = document.querySelector(".form");
form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();
  const heightFeet = parseInt(e.target.heightFeet.value);
  const heightInches = parseInt(e.target.heightInches.value);
  const height = convertHeightToDecimeters(heightFeet, heightInches);

  const weight = convertPoundsToHectograms(parseInt(e.target.weight.value));

  fetchPokemon(height, weight);

  form.reset();
}

function convertHeightToDecimeters(feet, inches) {
  return Math.round(((feet * 12 + inches) * 2.54) / 10);
}

function convertPoundsToHectograms(pounds) {
  return Math.round(pounds * 4.53592);
}

//Examples to add to site: Ash 4"7- 4"10, 75-85lbs
//Examples to add to site: Misty 4"10- 5"2, 90-100lbs
//Examples to add to site: Brock 5"6- 5"8, 130-150lbs

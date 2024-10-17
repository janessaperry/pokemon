/**************************************
 **************************************
 *********** THIS IS WORKING
 */

const baseUrl = "https://pokeapi.co/api/v2/pokemon";

async function getPokemon() {
	const response = await axios.get(`${baseUrl}`);
	const pokemonList = response.data.results;
	console.log(pokemonList);
	
	const allPokemon = await Promise.all(pokemonList.map(getIndividualPokemon));
	console.log(allPokemon);

	const filteredPokemon = allPokemon.filter(function(pokemon) {
		if (pokemon.weight < 100 && pokemon.height < 5) {
			console.log(pokemon);
			console.log("pokemon meets criteria");
			return true;
		}
	})
	console.log(filteredPokemon);
	
}

getPokemon();

async function getIndividualPokemon(pokemon) {
	console.log("pokemon", pokemon);
	const pokemonDetails = await axios.get(pokemon.url);
	return pokemonDetails.data;
}

/**************************************
 **************************************
 *********** THIS IS WORKING
 */




/**************************************
 **************************************
  * USING CLASS CONSTRUCTORS
  */

 // ----- pokemon-api.js
// const baseUrl = "https://pokeapi.co/api/v2/pokemon";

class PokemonAPI {
	constructor(baseURL) {
		this.baseURL = baseURL;
	}

	async getAllPokemon() {
		try {
			const response = await axios.get(`${baseUrl}?limit=100`);
			const pokemonList = response.data.results;
			return pokemonList;

		} catch(error) {
			console.error(error);
		}
	}

	async getPokemonDetails(pokemon) {
		try {
			const response = await axios.get(pokemon.url);
			return response.data;
		} catch (error) {
			console.error(error);
		}
	}

	async getAllPokemonDetails(pokemonList) {
		return Promise.all(pokemonList.map((pokemon) => this.getPokemonDetails(pokemon)));
	}

}

// ----- index.js
const pokemonApiCaller = new PokemonAPI();

async function fetchPokemon() {
	const pokemonList = await pokemonApiCaller.getAllPokemon();
	const allPokemon = await pokemonApiCaller.getAllPokemonDetails(pokemonList);

	const filteredPokemon = allPokemon.filter(pokemon => pokemon.weight < 100 && pokemon.height < 5);
	console.log(filteredPokemon);
	filteredPokemon.forEach(item => console.log(item.name));
	
}

fetchPokemon();

//Examples to add to site: Ash 4"7- 4"10, 75-85lbs
//Examples to add to site: Misty 4"10- 5"2, 90-100lbs
//Examples to add to site: Brock 5"6- 5"8, 130-150lbs
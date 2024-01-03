const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const voltarButton = document.getElementById('voltar');

const maxRecords = 151;
let limit = 5;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
    <button id="pokemonStatusButton${pokemon.number}" type="button" >
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    </button>
    `;
}

function loadPokemonItems(offset, limit) {
    const pokedexStylesheet = document.getElementById("pokedex")
    pokedexStylesheet.setAttribute("href", "./assets/css/pokedex.css");
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML = ''
        pokemonList.innerHTML += newHtml;

        // Adicionar evento de clique para cada botão de status
        pokemons.forEach((pokemon) => {
            const button = document.getElementById(`pokemonStatusButton${pokemon.number}`);
            button.addEventListener('click', () => {
                loadPokemonStats(offset = pokemon.number - 1, limit = 1);
            });
        });
        voltar.id = "loadMoreButton"
        loadMoreButton.innerHTML = "Load More"
    });
}

function loadPokemonStats(offset, limit) {
    const pokedexStylesheet = document.getElementById("pokedex")
    pokedexStylesheet.setAttribute("href", "./description/css/description.css");
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLiStatus).join('');
        pokemonList.innerHTML = newHtml;
        loadMoreButton.id = "voltar"
        voltar.innerHTML = "Voltar"
    });
}

function convertPokemonToLiStatus(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <div class="head">
               <span class="name">${pokemon.name}</span>
               <span class="number">#${pokemon.number}</span>
            </div>
            <div class="center">
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                </div>
                <div class="image">
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </div>
            <div class="more">
                <ul class="statusName">
                    ${pokemon.statusName.map((status) => `<li class="status">${status}</li>`).join('')}
                </ul>
                <ul class="statusValue">
                    ${pokemon.statusValue.map((value) => `<progress value="100" style="width: ${(value / 10)}rem;"></progress>`).join('')}
                </ul>
            </div>
        </li>
    `;
}


loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});

voltarButton.addEventListener('click', () => {
    loadPokemonItems(offset = 0, limit = 5);
});

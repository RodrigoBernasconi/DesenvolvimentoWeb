//* Os resultados da pesquisa devem ser exibidos dinamicamente na página. Para cada animal, apresente pelo menos:
// • Nome comum
// • Nome científico
// • Habitat
// • Dieta
// • Estado de conservação (quando disponível)
//* Detalhes do Animal
// Ao clicar/selecionar um animal, o usuário deve visualizar informações adicionais em uma seção dedicada
// da página ou em uma janela modal, como fizemos no último Trabalho Guiado.

// URLs das APIs em uso
const INATURALIST_API = "https://api.inaturalist.org/v1/taxa?q"

// Estado de aplicação
let currentAnimal = "";

// Buscando no DOM todos os elementos necessários
const statusMessage = document.getElementById("status-message");
const loader = document.getElementById("loader");
const resultsSection = document.getElementById("results-section");
const resultsTitle = document.getElementById("results-title");
const resultsCount = document.getElementById("results-count");
const resultsGrid = document.getElementById("results-grid");
const modalOverlay = document.getElementById("modal-overlay");
const modalFavorite = document.getElementById("modal-favorite");
const modalClose = document.getElementById("modal-close");
const modalBody = document.getElementById("modal-body");

modalFavorite.addEventListener("click", changeFavorite);

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

async function getAnimalConservation(animal) {
    const url = await fetch (
        `${INATURALIST_API}=${encodeURIComponent(animal)}`,
        {method: "GET"}
    );

    const data_animal = await url.json();
    const results = data_animal.results || [];
    const conservation = results[0]?.conservation_status?.status_name ?? "Not informed";
    console.log(conservation);
    return conservation;
};

async function renderFavorites(listFavorites) {
    console.log(`Lista de favoritos: ${listFavorites}`)

    for(let i = 0; i < localStorage.length; i++){
        console.log(listFavorites[i])
    }

    const cardsFavorites = listFavorites.map(createAnimalCard);
    const cards = await Promise.all(cardsFavorites);

    cards.forEach(card => {resultsGrid.appendChild(card);});

    resultsSection.hidden = false;
}

async function createAnimalCard(animal) {
    const name = animal.name || "Name not found";
    const scientificName = animal.taxonomy?.scientific_name || "Scientific name not found";
    const habitat = animal.characteristics?.habitat || "not informed";
    const diet = animal.characteristics?.diet || "not informed";

    // Buscando estado de conservação do animal
    const conservationStatus = await getAnimalConservation(scientificName);

    // Construindo o card no HTML
    const card = document.createElement("article");
    card.className = "animal-card";
    card.innerHTML = `
    <div class="animal-grid">
        <p class="animal-name">${escapeHTML(name)}</p>
        <p class="animal-sci-name"><span>${escapeHTML(scientificName)}</span></p>
        <p class="animal-info"><span>Diet: </span>${escapeHTML(diet)}</p>
        <p class="animal-info"><span>Habitat: </span>${escapeHTML(habitat)}</p>
        <p class="animal-status">${escapeHTML(conservationStatus)}</p>
    </div>
    `;
        
    card.addEventListener("click", () => openModal(animal));
    return card;
};

// Modal - Abre uma descrição com mais informações do animal
async function openModal(animal) {
    currentAnimal = animal;
    changeFavoriteButton();
    modalOverlay.hidden = false;
    const name = animal.name || "Name not found";
    const scientificName = animal.taxonomy?.scientific_name || "Scientific name not informed";
    const diet = animal.characteristics?.diet || "Not informed";
    const prey = animal.characteristics?.prey || "Not informed";
    const habitat = animal.characteristics?.habitat || "Not informed";
    const location = animal.characteristics?.location || "Not informed";
    const group = animal.characteristics?.group || "Not informed";
    const weight = animal.characteristics?.weight || "Not informed";
    const height = animal.characteristics?.height || "Not informed";

    // Renderizando as informações básicas para resultado de busca
    modalBody.innerHTML = `
    <div>
        <h2 class="modal-animal-name-l">${escapeHTML(name)}</h2>
        <p class="modal-animal-name-s">${escapeHTML(scientificName)}</p>
        <div class="modal-row-s">
            <div class="modal-card">
                <p class="animal-info"><span>Diet:</span> ${escapeHTML(diet)}</p>
                <p class="animal-info"><span>Prey:</span> ${escapeHTML(prey)}</p>
            </div>
            <div class="modal-card">
                <p class="animal-info"><span>Habitat:</span> ${escapeHTML(habitat)}</p>
                <p class="animal-info"><span>Location:</span> ${escapeHTML(location)}</p>
            </div>
        </div>
        <div class="modal-card">
            <h4>Characteristics:</h4>
            <p class="animal-info"><span>Group:</span> ${escapeHTML(group)}</p>
            <p class="animal-info"><span>Weight:</span> ${escapeHTML(weight)}</p>
            <p class="animal-info"><span>Height:</span> ${escapeHTML(height)}</p>
        </div>
    </div>
    `;
}

function verifyFavorite() {
    // Retorna a lista de favoritos para a checagem
    const listFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // Verifica se o animal já está presente na lista procurando pelo nome, retorna um index (sim/não)
    const index = listFavorites.findIndex(animal => animal.name === currentAnimal.name);
    // Retorna os dois resultados encontrados:
    // 1. Índice (Sim/Não)
    // 2. Lista dos favoritos
    return { index, listFavorites };
};

function changeFavoriteButton() {
    // Carrega as variáveis chamando a função de verificação
    const { index, listFavorites } = verifyFavorite();
    modalFavorite.textContent = (index !== -1) ? '❤️' : '🤍';
    closeModal();
}

function changeFavorite() {
    // Carrega as variáveis chamando a função de verificação
    const { index, listFavorites } = verifyFavorite();
    if (index !== -1) {
        // Remove o animal na lista de favoritos 
        listFavorites.splice(index, 1);
    } else {
        // Adiciona o animal na lista de favoritos 
        listFavorites.push(currentAnimal);
    }
    // Insere a nova lista de favoritos no localStorage
    localStorage.setItem('favorites', JSON.stringify(listFavorites));
    // Troca o botão se necessário
    changeFavoriteButton();
    window.location.reload();
}

function closeModal() {
    modalOverlay.hidden = true;
    modalBody.innerHTML = "";
};

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.hidden = false;
};

function escapeHTML(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
};

// Randeriza os favoritos ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem('favorites')) || [];
    if (data.length > 0){
        renderFavorites(data);
    } else {
        showStatus("Nenhum animal na lista de favoritos.", "info");
    }
});
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
const NINJA_API = "https://api.api-ninjas.com/v1/animals?name";
const API_KEY = "atB8dgsr9nKBaJHM3xSdxIKzkRF0EAVkXwiCzDez";
const INATURALIST_API = "https://api.inaturalist.org/v1/taxa?q"
const PAGE_SIZE = 8;

// Estados da aplicação
let currentQuery = "";
let currentType = "";
let currentPage = 1;
let totalResults = 0;

// Buscando no DOM todos os elementos necessários
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const statusMessage = document.getElementById("status-message");
const loader = document.getElementById("loader");
const resultsSection = document.getElementById("results-section");
const resultsTitle = document.getElementById("results-title");
const resultsCount = document.getElementById("results-count");
const resultsGrid = document.getElementById("results-grid");
const pagination = document.getElementById("pagination");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const pageIndicator = document.getElementById("page-indicator");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalBody = document.getElementById("modal-body");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    if (currentQuery) fetchAnimals();
});

btnPrev.addEventListener("click", () => {
    currentPage--;
    fetchAnimals();
});

btnNext.addEventListener("click", () => {
    currentPage++;
    fetchAnimals();
});

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

async function fetchAnimals() {
    // Estado de carregamento
    loader.hidden = false;
    searchBtn.disabled = true;
    searchBtn.textContent = "Pesquisando...";
    statusMessage.hidden = true;
    resultsSection.hidden = true;
    resultsGrid.innerHTML = "";

    const response = await fetch(
        `${NINJA_API}=${encodeURIComponent(currentQuery)}`,
        {
            method: "GET",
            headers: {
                "X-Api-Key": API_KEY
            },
        }
    );

    try {
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);

        const data = await response.json();
        totalResults = data.length ?? 0;
        // Renderização X animais por página --------------------------------
        const offset = (currentPage - 1) * PAGE_SIZE;
        const endLimit = offset + PAGE_SIZE;
        const animalsPage = data.slice(offset, endLimit);

        if (data.length > 0) {
            renderResults(animalsPage);
        } else {
            showStatus("Nenhum animal encontrado. Tente uma busca diferente.", "info");
        }
    } catch (error) {
        console.error("Erro na requisição: ", error);
        showStatus(`Algo deu errado na requisição: ${error.message}`, "error");
    } finally {
        loader.hidden = true;
        searchBtn.disabled = false;
        searchBtn.textContent = "Pesquisar";
    }
};

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

async function renderResults(animals) {
    resultsTitle.textContent = `Resultados para "${currentQuery}"`;
    const totalPages = Math.ceil(totalResults / PAGE_SIZE);
    resultsCount.textContent = `${totalResults} animais encontrados. Página ${currentPage} de ${totalPages}`;

    const cardsPromises = animals.map(createAnimalCard);    // Um array com a chamada de createAnimalCard(animal[0]) e assim por diante...
    const cards = await Promise.all(cardsPromises);         // Espera as requisições terminarem e me devolve os resultados

    cards.forEach(card => {resultsGrid.appendChild(card);});

    resultsSection.hidden = false;

    if (totalPages > 1) {
        pagination.hidden = false;
        pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
        btnPrev.disabled = currentPage === 1;
        btnNext.disabled = currentPage === totalPages;
    } else {
        pagination.hidden = true;
    }
};

async function createAnimalCard(animal) {
    const name = animal.name || "Nome desconhecido";
    const scientificName = animal.taxonomy?.scientific_name;
    const habitat = animal.characteristics?.habitat;
    const diet = animal.characteristics?.diet;

    // Buscando estado de conservação do animal
    const conservationStatus = await getAnimalConservation(scientificName);

    // Construindo o card no HTML
    const card = document.createElement("article");
    card.className = "animal-card";
    card.innerHTML = `
    <div>
        <p class="animal-name">${escapeHTML(name)}</p>
        <p class="animal-info">${escapeHTML(scientificName)}</p>
        <p class="animal-info">${escapeHTML(habitat)}</p>
        <p class="animal-info">${escapeHTML(diet)}</p>
        <p class="animal-info">${escapeHTML(conservationStatus)}</p>
    </div>
    `;
        
    card.addEventListener("click", () => openModal(animal));
    return card;
};

// Modal - Abre uma descrição com mais informações do animal
async function openModal(animal) {
    console.log("Fui clicado para abrir modal", animal)
    modalOverlay.hidden = false;
    const name = animal.name || "Name not informed";
    const scientificName = animal.taxonomy?.scientific_name || "Scientific name not informed";
    const diet = animal.characteristics?.diet || "Diet not informed";
    const prey = animal.characteristics?.prey || "Prey not informed";
    const habitat = animal.characteristics?.habitat || "Habitat not informed";
    const location = animal.characteristics?.location || "Location not informed";
    const group = animal.characteristics?.group || "Group not informed";
    const weight = animal.characteristics?.weight || "Weight not informed";
    const height = animal.characteristics?.height || "Height not informed";

    // Renderizando as informações básicas para resultado de busca
    modalBody.innerHTML = `
    <div>
        <h2 class="modal-animal-name-l">${escapeHTML(name)}</h2>
        <p class="modal-animal-name-s">${escapeHTML(scientificName)}</p>
        <div class="modal-row-s">
            <div class="modal-card">
                <h4>Diet:</h4>
                <p class="animal-info">${escapeHTML(diet)}</p>
                <p class="animal-info">${escapeHTML(prey)}</p>
            </div>
            <div class="modal-card">
                <h4>Habitat:</h4>
                <p class="animal-info">${escapeHTML(habitat)}</p>
                <p class="animal-info">${escapeHTML(location)}</p>
            </div>
        </div>
        <div class="modal-card">
            <h4>Characteristics:</h4>
            <p class="animal-info">${escapeHTML(group)}</p>
            <p class="animal-info">${escapeHTML(weight)}</p>
            <p class="animal-info">${escapeHTML(height)}</p>
        </div>
    </div>
    `;
}

function closeModal() {
    modalOverlay.hidden = true;
    modalBody.innerHTML = "";
}

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
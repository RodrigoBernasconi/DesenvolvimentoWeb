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

// modalClose.addEventListener("click", closeModal);
// modalOverlay.addEventListener("click", (e) => {
//     if (e.target === modalOverlay) closeModal();
// });
// document.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") closeModal();
// });

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

function renderResults(animals) {
    resultsTitle.textContent = `Resultados para "${currentQuery}"`;
    const totalPages = Math.ceil(totalResults / PAGE_SIZE);
    resultsCount.textContent = `${totalResults} animais encontrados. Página ${currentPage} de ${totalPages}`;

    animals.forEach((animal) => resultsGrid.appendChild(createAnimalCard(animal)));
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

function createAnimalCard(animal) {
    const name = animal.name || "Nome desconhecido";
    const scientific_name = animal.taxonomy?.scientific_name;
    const habitat = animal.characteristics?.habitat;
    const diet = animal.characteristics?.diet;

    const card = document.createElement("article");
    card.className = "animal-card";
    card.innerHTML = `
    <div>
        <p class="animal-name">${escapeHTML(name)}</p>
        <p class="animal-info">${escapeHTML(scientific_name)}</p>
        <p class="animal-info">${escapeHTML(habitat)}</p>
        <p class="animal-info">${escapeHTML(diet)}</p>
    </div>
    `;

    card.addEventListener("click", () => openModal(animal));
    return card;
};

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

// async function getInfos(data) {
//     for(let i = 0; i < data.length; i++){
//         const animal = data[i];
//         const name = animal.name;
//         const scientificName = animal.taxonomy?.scientific_name ?? "Nome Científico não informado" ;
//         const diet = animal.characteristics?.diet;
//         const conservationStatus = animal.characteristics?.conversation_status ?? "Não informado";
//         // Exibição detalhada
//         console.log(`Nome: ${name} | NC: ${scientificName} | Dieta: ${diet} | EdC: ${conservationStatus}`);
//     }
// }

// async function getAnimal(animalName) {
//   try {
//     const response = await fetch(
//     //   `https://api.api-ninjas.com/v1/animals?name=${encodeURIComponent(animalName)}`,
//         `${NINJA_API}=${encodeURIComponent(animalName)}`,
//       {
//         method: "GET",
//         headers: {
//           "X-Api-Key": API_KEY
//         }
//       }
//     );

//     if (!response.ok) { throw new Error(`HTTP ${response.status}`); }

//     const data = await response.json();
//     console.log(data);
//     getInfos(data);

//     //* Pegando estado de conservação dos animais com outra API do inaturalist ========
//     // const animal_teste = data[0]
//     // const cn = animal_teste.taxonomy?.scientific_name
//     // const url_inaturalist = await fetch(
//     //     `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(cn)}`,
//     //     {
//     //         method: "GET",
//     //     }
//     // );

//     // const test_data = await url_inaturalist.json();
//     // const results = test_data.results || [];
//     // const edc = results[0].conservation_status.status_name;
//     // console.log(edc);
//     //* ===============================================================================

//     return data;
//   } catch (error) {
//     console.error("Erro na chamada da API:", error);
//   }
// }

// Método com panda como parâmetro. Lembrem que o nome do animal precisa estar em inglês
// getAnimal("Black Rhino");
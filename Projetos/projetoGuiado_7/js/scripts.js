// URLs das APIs em uso
const SEARCH_API = "https://openlibrary.org/search.json";
const COVERS_API = "https://covers.openlibrary.org/b/id";
const WORKS_API = "https://openlibrary.org";
const PAGE_SIZE = 12;

// Estados da aplicação. Ou seja, variaveis que guardam onde estamos conforme o usuário interage com o App
let currentQuery = "";
let currentType = "";
let currentPage = 1;
let totalResults = 0;

// Buscamos no DOM todos os elementos necessários
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchTypeEl = document.getElementById("search-type");
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

// EventListeners
// Envio do form ao clicar em pesquisar ou Enter com o foco no Text area
searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita o comportamento do button type="submit" de recarregar a tela
    currentQuery = searchInput.value.trim(); // Retira espaços em branco nas extremidades
    currentType = searchTypeEl.value;
    currentPage = 1;
    if(currentQuery) fetchBooks();
});

btnPrev.addEventListener("click", () => {
    currentPage--;
    fetchBooks();
});

btnNext.addEventListener("click", () => {
    currentPage++;
    fetchBooks();
});


modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
    if(e.target === modalOverlay) closeModal();
});

document.addEventListener("keydown", (e) => {
    if(e.key === "esc") closeModal();
});

// Async / away requisições de rede levam se o JS esperasse por elas a página fica travada, async marca nossa função como assincrona, e "await" pausa apenas aquela função até o resultado chegar, mas mantém a página responsiva
async function fetchBooks() {
    loader.hidden = false;
    searchBtn.disabled = true;
    searchBtn.textContent = "Pesquisando...";
    statusMessage.hidden = true;
    resultsSection.hidden = true;
    resultsGrid.innerHTML = "";

    /* Constroi a URL com parâmetros de consulta
    uma query string vai ser semelhante a: ?q=tolkien&limit=12
    URLSeachParams monta essa string e trata caracteres especiais
    */ 
    const params = new URLSearchParams({
        [currentType]: currentQuery,
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
        fields:
            "key,title,author_name,first_publish_year,cover_i,edition_count,subject",
    });

    const url = `${SEARCH_API}?${params}`;
    console.log("URL da requisição: ", url);

    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error(`Error HTTP! Status: ${response.status}`);

        // response.json lê o corpo da resposta e converte o texto em JSON
        // em um 
        const data = await response.json();
        console.log("Resposta da API:", data);

        totalResults = data.numFound || 0;

        if(data.docs && data.docs.length > 0){
            renderResults(data.docs);
        } else {
            showStatus("Nenhum livro encontrado");
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

// Renderização de resultados
function renderResults(books){
    resultsTitle.textContent = `Resultados para ${currentQuery}`;
    const totalPages = Math.ceil(totalResults / PAGE_SIZE);
    resultsCount.textContent = `${totalResults} livros encontrados. Página ${currentPage} de ${totalPages}`;

    books.forEach((book) => resultsGrid.appendChild(createBookCard(book)));
    resultsSection.hidden = false;

    if (totalPages > 1) {
        pagination.hidden = false;
        pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
        btnPrev.disabled = currentPage === 1;
        btnNext.disabled = currentPage === totalPages;
    } else {
        pagination.hidden = true;
    }
}

function createBookCard(book){
    const title = book.title || "Título desconhecido";
    const authors = book.author_name
        ? book.author_name.join(", ")
        : "Autor desconhecido";
    const year = book.first_publish_year ? `Primeira públicação: ${book.first_publish_year}` : "";
    const coverHTML = book.cover_i 
        ? `<img class="book-cover" src="${COVERS_API}${book.cover_i}-M.jpg" alt="capa" loading="lazy">`
        : `<div class="book-cover-placeholder">&x1F4D6</div>`;

    const card = document.createElement("article");
    card.className = "book-card";
    card.innerHTML = `
    ${coverHTML}
    <div class="book-info">
        <p class="book-title">${escapeHTML(title)}</p>
        <p class="book-author">${escapeHTML(authors)}</p>
        <p class="book-year">${escapeHTML(year)}</p>
    </div>
    `;

    card.addEventListener("click", () => openModal(book));
    return card;
}

// openModal - Popular a modal com a descrição do livro
async function openModal(book) {
    modalOverlay.hidden = false;
    const title = book.title || "Título desconhecido";
    const author = book.author_name ? book.author_name.join(", ") : "Autor desconhecido";
    const coverHTML = book.cover_i 
        ? `<img class="modal-book-cover" src="${COVERS_API}${book.cover_i}-L.jpg" alt="capa" loading="lazy">`
        : `<div class="modal-book-cover-placeholder">&x1F4D6</div>`;
    // Renderiza as infos básicas que já temos do resultado da busca
    modalBody.innerHTML = 
    `<div class="modal-cover-wrap">${coverHTML}</div>
    <h2 id="modal-title">${escapeHTML(title)}</h2>
    <p style="color: var(--muted)">${escapeHTML(authors)}</p>

    <div>
        ${book.first_publish_year ? `<span class="badge">&#x1F4D6; ${book.first_publish_year}</span>` : ""}
        ${book.edition_count ? `<span class="badge">&#x1F4D6; ${book.edition_count}</span>` : ""}
    </div>

    <p id="modal-description" class="modal-description>
        Carregando descrição ...
    </p>

    <a href=${WORKS_API}${book.key} target="_blank" class="modal-ol-link">
        Ver na Open Library
    </a>
    `;

    try {
        const response = await fetch(`${WORKS_API}${book.key}.json`);
        if (!response.ok) throw new Error("Não encontrado");
        const data = await response.json();

        const desc = typeof data.description === "string" ? data.description : data.description?.value || "Descrição indisponível";
        document.getElementById("modal-description").textContent = desc;
    } catch {
        document.getElementById("modal-description").textContent = "Descrição não disponível";
    }
}

function closeModal() {
    modalOverlay.hidden = true;
    modalBody.innerHTML = "";
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.hidden = false;
}

function escapeHTML(str){
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}
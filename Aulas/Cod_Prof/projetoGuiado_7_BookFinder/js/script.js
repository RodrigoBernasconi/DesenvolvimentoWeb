// URLs das APIs em uso
const SEARCH_API = "https://openlibrary.org/search.json";
const COVERS_API = "https://covers.openlibrary.org/b/id/";
const WORKS_API = "https://openlibrary.org";
const PAGE_SIZE = 12; // Número máximo de cards por página

// Estados da aplicação. Ou seja, variáveis que guardam "onde estamos" conforme o usuário interage com o app.
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

// eventListeners
// Envio do form ao clicar em Pesquisar ou Enter com o foco no text area
searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita o comportamento padrão do button type="submit" que recarrega a tela
    currentQuery = searchInput.value.trim(); // Atribui a currentQuery o valor digitado do usuário, retirando espaços em branco no final e início
    currentType = searchTypeEl.value;
    currentPage = 1;
    if (currentQuery) fetchBooks();
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
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

/**
 * async / away - Requisições de rede levam tempo. Se o JS esperasse por elas, a página
 * ficaria travada. "async" marca nossa função como assíncrona, e "await" pausa apenas
 * aquela função até o resultado chegar, mas mantém a página responsiva.
 */
async function fetchBooks() {
    // Exibe o estado de carregamento
    loader.hidden = false;
    searchBtn.disabled = true;
    searchBtn.textContent = "Pesquisando...";
    statusMessage.hidden = true;
    resultsSection.hidden = true;
    resultsGrid.innerHTML = "";

    /** Constrói a URL com parâmetros de consulta
     * Uma query string vai ser semelhante a: ?q=tolkien&limit=12
     * URLSearchParams monta essa string e trata caracteres especiais
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
        // fetch(url) envia a requisição HTTP GET. Ela retorna uma "promise", usamos o await para obter o objeto Response
        const response = await fetch(url);
        // Se o código for diferente de 200, tocamos um erro.
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);

        // response.json lê o corpo da resposta e converte o texto em JSON
        // em um objeto JS com o qual podemos trabalhar daqui em diante.
        const data = await response.json();
        console.log("Resposta da API: ", data);

        totalResults = data.numFound || 0;

        if (data.docs && data.docs.length > 0) {
            renderResults(data.docs);
        } else {
            showStatus("Nenhum livro encontrado. Tenta uma busca diferente.", "info");
        }
    } catch (error) {
        console.error("Erro na requisição: ", error);
        showStatus(`Algo deu errado na requisição: ${error.message}`, "error");
    } finally {
        // Independentemente de ter rodado o try ou o catch, vai executar o que está no bloco finally
        loader.hidden = true;
        searchBtn.disabled = false;
        searchBtn.textContent = "Pesquisar";
    }
}

// renderização de resultados
function renderResults(books) {
    resultsTitle.textContent = `Resultados para "${currentQuery}"`;
    const totalPages = Math.ceil(totalResults / PAGE_SIZE);
    resultsCount.textContent = `${totalResults} livros encontrados. Página ${currentPage} de ${totalPages}`;

    // Manipulação do DOM: cria um elemento card por livro e adiciona à página
    books.forEach((book) => resultsGrid.appendChild(createBookCard(book)));
    resultsSection.hidden = false;

    // Páginação
    if (totalPages > 1) {
        pagination.hidden = false;
        pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
        btnPrev.disabled = currentPage === 1;
        btnNext.disabled = currentPage === totalPages;
    } else {
        pagination.hidden = true;
    }
}

// createBookCard
function createBookCard(book) {
    const title = book.title || "Título desconhecido";
    const authors = book.author_name ? book.author_name.join(", ") : "Autor desconhecido";
    const year = book.first_publish_year ? `Primeira publicação: ${book.first_publish_year}` : "";

    // URL da capa
    const coverHTML = book.cover_i 
        ? `<img class="book-cover" src="${COVERS_API}${book.cover_i}-M.jpg" alt="capa" loading="lazy">`
        : `<div class="book-cover-placeholder">&#x1F4D6;</div>`;

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

// openModal - Essa função faz a segunda chamada à API, que irá popular a nossa modal com a descrição do livro
async function openModal(book) {
    modalOverlay.hidden = false;
    const title = book.title || "Título desconhecido";
    const authors = book.author_name ? book.author_name.join(", ") : "Author desconhecido";
    const coverHTML = book.cover_i 
        ? `<img class="modal-cover" src="${COVERS_API}${book.cover_i}-L.jpg" alt="capa" loading="lazy">`
        : `<div class="modal-cover-placeholder">&#x1F4D6;</div>`;

    // Renderiza as infos básicas que já temos do resultado da busca
    modalBody.innerHTML = `
    <div class="modal-cover-wrap">${coverHTML}</div>
    <h2 id="modal-title">${escapeHTML(title)}</h2>
    <p style="color: var(--muted)">${escapeHTML(authors)}</p>

    <div class="modal-meta">
        ${book.first_publish_year ? `<span class="badge">&#x1F4D6; ${book.first_publish_year}</span>` : ""}
        ${book.edition_count ? `<span class="badge">&#x1F4D6; ${book.edition_count}</span>` : ""}
    </div>

    <p id="modal-description" class="modal-description">
        Carregando descrição...
    </p>

    <a href="https://openlibrary.org${book.key}" target="_blank" class="modal-ol-link">
        Ver na Open Library
    </a>
    `;

    // Agora busca a descrição no endpoint WORKS que criamos no topo
    try {
        const response = await fetch(`${WORKS_API}${book.key}.json`);
        if (!response.ok) throw new Error("Não encontrado");
        const data = await response.json();

        // A descrição pode ser uma string simples, ou um obj com a propriedade value
        const desc = typeof data.description === "string" ? data.description : data.description?.value || "Descrição não disponível";
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

function escapeHTML(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}

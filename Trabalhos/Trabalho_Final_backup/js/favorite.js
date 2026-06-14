
async function createAnimalCard(animal) {
    const name = animal.name || "Name not found";
    const scientificName = animal.taxonomy?.scientific_name || "Scientific name not found";
    const habitat = animal.characteristics?.habitat || "not informed";
    const diet = animal.characteristics?.diet || "not informed";

    // Buscando estado de conservação do animal
    // const conservationStatus = await getAnimalConservation(scientificName);

    // Construindo o card no HTML
    const card = document.createElement("article");
    card.className = "animal-card";
    card.innerHTML = `
    <div class="animal-grid">
        <p class="animal-name">${escapeHTML(name)}</p>
        <p class="animal-sci-name"><span>${escapeHTML(scientificName)}</span></p>
        <p class="animal-info"><span>Diet: </span>${escapeHTML(diet)}</p>
        <p class="animal-info"><span>Habitat: </span>${escapeHTML(habitat)}</p>
    </div>
    `;
        // <p class="animal-status">${escapeHTML(conservationStatus)}</p>
        
    card.addEventListener("click", () => openModal(animal));
    return card;
};

async function openModal(animal) {
    currentAnimal = animal;
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

window.addEventListener("DOMContentLoaded", () => {
    const listFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
})
// Nome de cahve padrão em imagens transformadas em base64
// const STORAGE_KEY = "savedImageBase64";
const STORAGE_KEY_ARR = ["savedImgBase64_1", "savedImgBase64_2", "savedImgBase64_3"];
// Buscando elementos do HTML
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const removeBtn = document.getElementById("removeBtn");
const galeryBtn = document.getElementById("galeryBtn");
const photoLink = document.getElementById("photo-page");
const body = document.querySelector(".container");
// Varaiveis auxiliares
let count = 0;
let images = [];

function showAlert(txt) {
    alert(txt);
}

uploadBtn.addEventListener("click", () => {
    fileInput.click();
});

removeBtn.addEventListener("click", () => {
    localStorage.clear();
    galeryBtn.style.display = "none";
    count = 0;
});

galeryBtn.addEventListener("click", () => {
    photoLink.click();
});

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if(!file) return;

    if((count) == STORAGE_KEY_ARR.length){
        showAlert("Array cheio, clique no botão remover para esvaziar o armazenamento");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){
        const base64Image = e.target.result;
        localStorage.setItem(STORAGE_KEY_ARR[count], base64Image);
        count++;
    };
    unlockGallery();
    
    reader.readAsDataURL(file);
});

function unlockGallery() {
    galeryBtn.style.display = "inline-block"
}

window.addEventListener("DOMContentLoaded", () => {
    const savedImage = localStorage.getItem(STORAGE_KEY_ARR[0]);
    if (savedImage){
        count = localStorage.length;
        unlockGallery();
    }
});
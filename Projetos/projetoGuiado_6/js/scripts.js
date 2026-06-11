// Nome de cahve padrão em imagens transformadas em base64
const STORAGE_KEY = "savedImageBase64"
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const pewview = document.getElementById("preview");
const removeBtn = document.getElementById("removeBtn");

uploadBtn.addEventListener("click", () => {
    fileInput.click();
})

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){
        const base64Image = e.target.result;
        localStorage.setItem(STORAGE_KEY, base64Image);
        displayImage(base64Image);
        // preview.style.display = "block";
    };

    reader.readAsDataURL(file);
});

function displayImage(src) {
    preview.src = src;
    preview.style.display = "block";
}

removeBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    preview.src = "";
    preview.style.display = "none";
})

window.addEventListener("DOMContentLoaded", () => {
    const savedImage = localStorage.getItem(STORAGE_KEY);
    if (savedImage){
        displayImage(savedImage);
    }
})
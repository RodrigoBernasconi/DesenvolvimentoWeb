const body = document.querySelector(".main-container");

function createPhoto() {
    for(let i = 0; i < localStorage.length; i++){
        let contImg = document.createElement("div");
        contImg.classList.add("img-container");
        body.appendChild(contImg);

        let img = document.createElement("img");
        contImg.appendChild(img);
        img.classList.add("photo");

        let src = localStorage.getItem(localStorage.key(i));
        img.src = src;
    };
};

window.addEventListener("DOMContentLoaded", () => {
    const savedImage = localStorage.key(0);
    if (savedImage){
        createPhoto();
    }
});
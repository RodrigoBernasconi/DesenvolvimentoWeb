let plusBtn = document.querySelector("#plus-btn");
let minusBtn = document.querySelector("#minus-btn");
let imgs = document.getElementsByClassName("box");
let imgsClasses = ["img-x100", "img-x200", "img-x300"];
let control = 1;

const resizeImgs = (curSize, newsize) => {
    for (let i = 0; i < imgs.length; i++){
        imgs[i].classList.remove(imgsClasses[curSize])
        imgs[i].classList.add(imgsClasses[newsize])
    };
};

plusBtn.addEventListener("click", () => {
    if (control < 2){
        control++;
        resizeImgs(control-1, control);
    };
});

minusBtn.addEventListener("click", () => {
    if (control > 0){
        control--;
        resizeImgs(control+1, control)
    };
});
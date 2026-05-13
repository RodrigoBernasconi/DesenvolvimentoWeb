// let meuTexto = document.getElementById("banner");
// console.log(meuTexto.innerText);

// let arrayParagrafos = document.getElementsByTagName('p');
// console.log(arrayParagrafos[2].innerText);

// for(let i = 0; i < arrayParagrafos.length; i ++){
//     console.log(arrayParagrafos[i].innerText);
// };

// // Imprimindo conteudo textual de umas divs
// const imprimeDivs = () => {
//     let divs = document.getElementsByTagName("div");
//     for (let i = 0; i < divs.length; i++){
//         console.log(`Div ${i} = ${divs[i].innerHTML}`);
//         // console.log(`Div ${i} = ${divs[i].innerText}`);
//     };
// };
// imprimeDivs();

// Alterando propriedades CSS
const coresDivs = () => {
    let cores = ["red", "blue", "green", "gold"];
    let divs = document.getElementsByTagName("div");
    let textos = document.getElementsByTagName("p");

    for (let i = 0; i < divs.length; i++){
        divs[i].style.backgroundColor = cores[i];
        textos[i].style.color = "white";
        textos[i].style.fontSize = "25px";
    };
};

// coresDivs();

const aparecer = () => {
    let casasHog = document.getElementsByClassName("oculto");
    for (let i = 0; i < casasHog.length; i++){
        casasHog[i].style.display = "block";
        // casasHog[i].classList.remove("oculto");
    };
};

let btnRevelio = document.getElementById("btn");
btnRevelio.classList.add("btnVermelho");
// Pega o primeiro elemento no singular com essa classe e atualiza
document.querySelector(".oculto").innerHTML = "Griffindor";
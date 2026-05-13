let btn = document.querySelector("#new-quote");
let quote = document.querySelector(".quote");
let person = document.querySelector(".person");

const quotes = [{
    quote: `"Todo mundo deveria aprender a programar um computador, pois isso ensina a pensar."`,
    person: ` Steve Jobs`
}, {
    quote: `"Se debugar é o processo de remover bugs, então programar deve ser o processo de criá-los."`,
    person: ` Edsger Dijkstra`
}, {
    quote: `"Programação é a arte de descobrir o que você quer fazer e, então, traduzi-lo para uma linguagem que o computador entenda."`,
    person: ` Chris Pine`
}, {
    quote: `"Programação é como escrever poesia, mas com menos palavras e mais expressões matemáticas."`,
    person: ` Donald Knuth`
}, {
    quote: `"A programação é a melhor alquimia da mente humana. Transforma pensamentos em realidade."`,
    person: ` Benjamin Franklin`
}, {
    quote: `"If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough."`,
    person: ` Alan Turing`
}, {
    quote: `"Programação é a arte de encontrar soluções elegantes para problemas complexos."`,
    person: ` Matt Mullenweg`
}, {
    quote: `" Otimização prematura é a raíz de todos os males."`,
    person: ` Donald Knuth`
}, {
    quote: `"A propriedade mais importante em um programa é se ele possui capacidade de fazer o que o usuário quer."`,
    person: ` Tony Hoare`
}, {
    quote: `"Qualquer software que pode ser desenvolvido em JavaScript, eventualmente será escrito em JavaScript."`,
    person: ` Jeff Atwood`
}, ];

btn.addEventListener("click", () => {
    let random = Math.floor(Math.random() * quotes.length);

    quote.innerText = quotes[random].quote;
    person.innerText = quotes[random].person;
});
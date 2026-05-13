// alert("E ai brow!");
// Criação de variavel global, não indicado
// var sobrenome = "Bernasconi";
// // Criação de variavel
// let nome = "Rodrigo";
// // Constante então não muda né
// const pi = 3.14;

// let nome = prompt("Digite seu nome: ");
// alert(`Olá, ${nome}!`);

const nomes = ["Rodrigo", "Maria", "João", "Ana"];
const valores = new Array(10);
// alert(valores[9])
nomes.push("Carlos"); //Insere na última posição
nomes.pop(); //Remove na última posição
/*
    1° parametro: posição onde quero inserir
    2° parametro: quantos elementos quero remover a partir da posição (0 -> não quero remover nenhum)
    3° parametro em diante: os elementos que quero inserir a partir da posição
*/
nomes.splice(1, 0, "A", "B");
console.log(nomes);
// É recomendado sempre fazer um novo array para concatenar, pois o método concat não altera os arrays originais
const nomes_e_valores = nomes.concat(valores);
console.log(nomes_e_valores);
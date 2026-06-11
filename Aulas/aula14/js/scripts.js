//* F12 > Application > Local Storage > 127001
//! Primeira parte da aula:
// localStorage.setItem("aluno0", "Fulano de Tal");

// let meuH = document.querySelector("h1");
// meuH.innerHTML = localStorage.getItem("aluno0");

// localStorage.removeItem("aluno0");
// localStorage.clear()

// * Criando um array de alunos e vamos persistir todos no local storage
const arrayAlunos = ["Fulano de tal", 19, "Ana Julia", 20, "Zelda Link", 31, "Beltrano da Silva", 29];
localStorage.setItem("alunos", JSON.stringify(arrayAlunos));

// Pega o array de volta do local storage
const alunosRetornados = JSON.parse(localStorage.getItem("alunos"));
let meuNome0 = document.getElementById("nome0");
let idade0 = document.getElementById("idade0");

meuNome0.innerText = alunosRetornados[0];
idade0.innerText = ", " + alunosRetornados[1] + " anos";

localStorage.clear()
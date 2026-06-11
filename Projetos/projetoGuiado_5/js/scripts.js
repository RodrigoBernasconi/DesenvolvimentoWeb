const ul = document.querySelector("ul");
const input = document.getElementById("item");
// Se houver items no localStorage colocamos no array, caso contrário inicializa vazio
let itemArray = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];

itemArray.forEach(addTask); //Executa a função recebida para cada elemento do array

// Para cada valor (tarefa) contido no item array cria um <li>Texto da tarefa</li> e insere no nosso ul
function addTask(text){
    const li = document.createElement("li");
    li.textContent = text;
    // li.classList.add("class", "tasks");
    ul.appendChild(li);
};

function add() {
    if(itemArray.value != ""){
        itemArray.push(input.value);
        localStorage.setItem("items", JSON.stringify(itemArray));
        addTask(input.value);
        input.value = "";
    }else {
        alert("Você não digitou nada!")
    }
};

function remove() {
    localStorage.clear();
    ul.innerHTML = "";
    itemArray = [];
};
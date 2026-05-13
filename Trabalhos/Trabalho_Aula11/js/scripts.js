// Crie uma classe chamada Funcionario:
// 1. Crie atributos para nome, sobrenome e o número de anos trabalhados pelo funcionário.

// 2. Instancie ao menos 5 funcionários com valores dos atributos definidos por você. Após,
// adicione os funcionários em um array.

// 3. Defina, via prototype, uma função que deve retornar um texto com todos os detalhes do
// funcionário de forma organizada.

// 4. Itere por todos os funcionários contidos no array, invocando a função definida via
// prototype para cada um deles e exiba os resultados no console.

class Funcionario {
    #nome;
    #sobrenome;
    #numAnosTrabalhados;
    constructor(nome, sobrenome, numAnosTrabalhados){
        this.#nome = nome;
        this.#sobrenome = sobrenome;
        this.#numAnosTrabalhados = numAnosTrabalhados
    };

    get nome(){return this.#nome};
    set nome(novoNome){this.#nome = novoNome};

    get sobrenome(){return this.#sobrenome};
    set sobrenome(novoSobrenome){this.#sobrenome = novoSobrenome};

    get numAnosTrabalhados(){return this.#numAnosTrabalhados};
    set numAnosTrabalhados(novoNumAnosTrabalhados){this.#numAnosTrabalhados = novoNumAnosTrabalhados};
};

// Instanciando funcionários
let func1 = new Funcionario("Rodrigo", "Bernasconi", 5);
let func2 = new Funcionario("Gabriel", "Bernasconi", 10);
let func3 = new Funcionario("Luciana", "Bernasconi", 12);
let func4 = new Funcionario("Paola", "Scalco", 8);
let func5 = new Funcionario("Manoela", "Ritzel", 3);

// Interando funcionarios no array
let meusFuncionarios = [func1, func2, func3, func4, func5];

// Apresentação de pessoal
Funcionario.prototype.apresentacao = function() {
    console.log(`Meu nome é ${this.nome} ${this.sobrenome} e trabalho à ${this.numAnosTrabalhados} anos.`)
};

// Iterando cada um dos funcionários dentro do array
meusFuncionarios.forEach(f => f.apresentacao());
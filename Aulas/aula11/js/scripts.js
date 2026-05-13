// class Cachorro {
//     constructor(nome, peso, cor){
//         this.nome = nome;
//         this.peso = peso;
//         this.cor = cor;
//     };
// };

// let meuCao = new Cachorro("Rex", 20, "Marrom");
// let outroCao = new Cachorro("Lassie", 33);

// console.log(`Meu cão se chama ${meuCao.nome}, pesa ${meuCao.peso} kg e é da cor ${meuCao.cor}`);
// console.log(`Meu cão se chama ${outroCao.nome}, pesa ${outroCao.peso} kg e é da cor ${outroCao.cor}`);

class Aluno {
    #nome;
    #idade;
    #curso;
    constructor(nome, idade="18", curso="Desenvolvimento Web"){
        this.#nome = nome;
        this.#idade = idade;
        this.#curso = curso;
    };

    get nome(){return this.#nome};
    set nome(novoNome){this.#nome = novoNome};

    get idade(){return this.#idade};
    set idade(novoIdade){this.#idade = novoIdade};

    get curso(){return this.#curso};
    set curso(novoCurso){this.#curso = novoCurso};

    apresentacao() {
        console.log(`O aluno se chama ${this.#nome}, tem ${this.#idade} anos e estuda ${this.#curso}`);
    };

    materiaFavorita(materia){
        return `A matéria favorita de ${this.#nome} é ${materia}`;
    };
};

let aluno1 = new Aluno("Maria", "22", "Nutrição");
let aluno2 = new Aluno("João", "20");

console.log(aluno1);
console.log(aluno2);

aluno2.apresentacao();
console.log(aluno1.materiaFavorita("Nutrição esportiva"))

// Testando os getters e setters com atributos privados
console.log(aluno1.nome);
console.log(aluno1.idade);
console.log(aluno1.curso);

aluno2.curso = "Engenharia de Software";
aluno2.idade = 27;

aluno2.apresentacao();

// Herança

class Veiculo {
    constructor(cor, velocidadeAtual, velocidadeMax){
        this.cor = cor;
        this.velocidadeAtual = velocidadeAtual;
        this.velocidadeMax = velocidadeMax;
    };

    acelerar(aumentaVelocidade){
        this.velocidadeAtual += aumentaVelocidade;
        if (this.velocidadeAtual > this.velocidadeMax){
            console.log("Velocidade máxima atingida!");
            this.velocidadeAtual = this.velocidadeMax;
        };
    };

    move(){
        console.log(`O veículo está se movendo a ${this.velocidadeAtual} km/h`);
    };
};

class Moto extends Veiculo {
    constructor(cor, velocidadeAtual, velocidadeMax, combustivel){
        super(cor, velocidadeAtual, velocidadeMax);
        this.combustivel = combustivel;
    };

    empinar(){
        console.log("A moto está empinando!");
    };

};

let moto1 = new Moto("Vermelha", 60, 220, "Gasolina");

moto1.move();
moto1.acelerar(50);
moto1.move();
moto1.empinar();
moto1.acelerar(150);
moto1.move();

// Prototype
class Pessoa {
    constructor(nome, idade){
        this.nome = nome;
        this.idade = idade;
    };

    dizOi() {
        console.log(`Oi, meu nome é ${this.nome} e tenho ${this.idade} anos!`);
    };
};

let pessoa1 = new Pessoa("Carlos", 30);
pessoa1.dizOi();

Pessoa.prototype.dizTchau = function() {
    console.log("Tchaau!");
};

Pessoa.prototype.corFavorita;
pessoa1.dizTchau();
pessoa1.corFavorita = "Azul";
console.log(`A cor favorita de ${pessoa1.nome} é ${pessoa1.corFavorita}`);
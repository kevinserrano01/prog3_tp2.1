class Card {
    constructor(name, img) {
        this.name = name;
        this.img = img;
        this.isFlipped = false;
        this.element = this.#createCardElement();
    }
    
    // Metodos privados
    #createCardElement() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("cell");
        cardElement.innerHTML = `
          <div class="card" data-name="${this.name}">
              <div class="card-inner">
                  <div class="card-front"></div>
                  <div class="card-back">
                      <img src="${this.img}" alt="${this.name}">
                  </div>
              </div>
          </div>
      `;
        return cardElement;
    }

    // Implemente esta funcion ya que si reinicio el juego con toggleFlip() Las cartas que adivine no se dan vuelta cuando reinicio el juego.
    ocultarCartas(){
        this.#unflip();
    }

    toggleFlip() {
        this.isFlipped = !this.isFlipped; // cambia el estado de la carta de volteada a no volteada y viceversa
        if (this.isFlipped) {
            this.#flip();
        } else {
            this.#unflip();
        }
    }

    matches(otherCard){
        return this.name === otherCard.name;
    }

    #flip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.add("flipped");
    }

    #unflip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.remove("flipped");
    }
}

class Board {
    constructor(cards) {
        this.cards = cards;
        this.fixedGridElement = document.querySelector(".fixed-grid");
        this.gameBoardElement = document.getElementById("game-board");
    }

    #calculateColumns() {
        const numCards = this.cards.length;
        let columns = Math.floor(numCards / 2);
        columns = Math.max(2, Math.min(columns, 12));
        if (columns % 2 !== 0) {
            columns = columns === 11 ? 12 : columns - 1;
        }
        return columns;
    }

    #setGridColumns() {
        const columns = this.#calculateColumns();
        this.fixedGridElement.className = `fixed-grid has-${columns}-cols`;
    }

    render() {
        this.#setGridColumns();
        this.gameBoardElement.innerHTML = "";
        this.cards.forEach((card) => {
            card.element
                .querySelector(".card")
                .addEventListener("click", () => this.onCardClicked(card));
            this.gameBoardElement.appendChild(card.element);
        });
    }

    onCardClicked(card) {
        if (this.onCardClicked) {
            console.log(`Click en la carta con la imagen de ${card.name}`)
            this.onCardClick(card);
        }
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Genero un indice aleatorio entre 0 e i
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]; // Intercambia las cartas en las posiciones i y j
        }
        this.render(); // Vuelvo a renderizar las cartas en el tablero para reflejar el nuevo orden
    }

    reset() {
        this.cards.forEach((card) => {
            card.isFlipped = false; // Pongo todas las cartas como no volteadas
            card.ocultarCartas();
        });

        this.shuffleCards();
    }

    
}


class MemoryGame {
    constructor(board, flipDuration = 500) {
        this.board = board;
        this.flippedCards = [];
        this.matchedCards = [];
        if (flipDuration < 350 || isNaN(flipDuration) || flipDuration > 3000) {
            flipDuration = 350;
            alert(
                "La duración de la animación debe estar entre 350 y 3000 ms, se ha establecido a 350 ms"
            );
        }
        this.flipDuration = flipDuration;
        this.board.onCardClick = this.#handleCardClick.bind(this);
        this.board.reset();
    }

    #handleCardClick(card) {
        if (this.flippedCards.length < 2 && !card.isFlipped) {
            card.toggleFlip();
            this.flippedCards.push(card);

            if (this.flippedCards.length === 2) {
                setTimeout(() => this.checkForMatch(), this.flipDuration);
            }
        }
    }

    checkForMatch() {
        if (this.flippedCards.length === 2) {
            const [card1, card2] = this.flippedCards;

            if (card1.name === card2.name) {
                this.matchedCards.push(card1, card2);
                this.flippedCards = [];
            } else {
                setTimeout(() => {
                    card1.toggleFlip();
                    card2.toggleFlip();
                    this.flippedCards = [];
                }, this.flipDuration);
            }
        }
    }

    resetGame() {
        this.board.reset();
        this.matchedCards = [];
        this.flippedCards = [];
        console.log("Juego Reiniciado")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cardsData = [
        { name: "Python", img: "./img/Python.png" },
        { name: "JavaScript", img: "./img/JS.svg" },
        { name: "Java", img: "./img/Java.svg" },
        { name: "CSharp", img: "./img/CSharp.svg" },
        { name: "Go", img: "./img/Go.svg" },
        { name: "Ruby", img: "./img/Ruby.svg" },
    ];

    const cards = cardsData.flatMap((data) => [
        new Card(data.name, data.img),
        new Card(data.name, data.img),
    ]);
    const board = new Board(cards);
    const memoryGame = new MemoryGame(board, 1000);

    document.getElementById("restart-button").addEventListener("click", () => {
        memoryGame.resetGame();
    });
});

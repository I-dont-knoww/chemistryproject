import { ELEMENTS_TO_NAME, SQUARES_TO_MOVE_BACK } from './constants.mjs';

class EmptyScreen {
    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('screen');
        document.querySelector('body').appendChild(this.element);
    }
}

export class StartScreen extends EmptyScreen {
    static #instructions = `
Up to four players may play the game.
When the game begins, all players start at square zero.

1. The current player rolls the dice, they will move that many squares forward.
2. Depending on the square they land on, they may have to answer a question as to not be moved backwards ${SQUARES_TO_MOVE_BACK} squares.
3. If they answer incorrectly, they will be given an opportunity to avoid the punishment if they name ${ELEMENTS_TO_NAME} elements from the periodic table that haven't been named yet in this game session.
    `.trim();

    constructor() {
        super();

        const title = document.createElement('h1');
        title.innerText = 'Instructions';
        this.element.appendChild(title);

        const instructions = document.createElement('p');
        instructions.innerText = StartScreen.#instructions;
        instructions.style.margin = '0 auto';
        this.element.appendChild(instructions);

        const player = document.createElement('input');
        player.type = 'number';
        player.placeholder = 'Enter the number of players here';
        player.style.display = 'block';
        player.style.width = '100%';
        player.style.marginTop = '1em';
        this.element.appendChild(player);

        const { promise, resolve } = Promise.withResolvers();

        const button = document.createElement('button');
        button.innerText = 'Begin';
        button.style.marginTop = '1em';
        button.onclick = () => {
            this.element.style.display = 'none';
            resolve(Math.max(2, Math.min(4, Number(player.value) || 4)));
        }
        this.element.appendChild(button);

        this.playerCount = promise;
    }
}

export class EndScreen extends EmptyScreen {
    /**
     * @param {number} playerWon
     */
    constructor(playerWon) {
        super();

        const title = document.createElement('h1');
        title.innerText = `Player ${playerWon + 1} Wins!`;
        this.element.appendChild(title);
    }
}

import { PLAYER_GRID_SIZE, PLAYER_RADIUS, PLAYER_MARGIN, PLAYER_MOVE_DELAY, SQUARES_TO_MOVE_BACK, BOARD_SIZE } from './constants.mjs';
import { Square } from './squares.mjs';

import { sleep } from './util.mjs';

export default class PlayerManager {
    #players; #playerTurn;
    static #colors = ['#cb0404', '#f4631e', '#ff9f00', '#309898'];

    constructor(length, container) {
        this.#playerTurn = 0;

        this.#players = Array.from({ length }, (_, i) => {
            return new Player(i + 1, PlayerManager.#colors[i], container);
        });
        this.#players[0].highlight();
    }

    /**
     * @param {number} distance
     * @returns {Promise<number>}
     */
    async moveCurrentPlayer(distance) {
        for (let i = 0; i < distance; i++) {
            this.#players[this.#playerTurn].position++;
            await sleep(PLAYER_MOVE_DELAY);

            if (this.#players[this.#playerTurn].position == BOARD_SIZE - 1) return this.#playerTurn;
        }

        return -1;
    }

    async punishCurrentPlayer() {
        const player = this.#players[this.#playerTurn];

        const distance = Math.min(SQUARES_TO_MOVE_BACK, player.position);
        for (let i = 0; i < distance; i++) {
            player.position--;
            await sleep(PLAYER_MOVE_DELAY);
        }
    }

    /**
     * @param {string} text
     * @param {Object|undefined} css
     */
    displayTextOnCurrentPlayer(text, css = {}) {
        this.#players[this.#playerTurn].display(text, css);
    }

    displayCorrect() {
        this.clearCurrentPlayerInteractor();
        this.displayTextOnCurrentPlayer('Correct!', { color: '#00B000' });
    }
    
    displayIncorrect() {
        this.clearCurrentPlayerInteractor();
        this.displayTextOnCurrentPlayer('Incorrect!', { color: 'red' });
    }

    /**
     * @returns {HTMLElement}
     */
    getCurrentPlayerInteractor() {
        return this.#players[this.#playerTurn].getInteractor();
    }

    clearCurrentPlayerInteractor() {
        this.#players[this.#playerTurn].clearInteractor();
    }

    /**
     * @returns {number}
     */
    getCurrentPlayerPosition() {
        return this.#players[this.#playerTurn].position;
    }

    goToNextTurn() {
        this.#players[this.#playerTurn].unhighlight();

        this.#playerTurn++;
        this.#playerTurn %= this.#players.length;

        this.#players[this.#playerTurn].highlight();
    }

    /**
     * @param {OffscreenCanvasRenderingContext2D} ctx
     * @param {Square[]} squares
     */
    render(ctx, squares) {
        const positionCount = {};
        for (const player of this.#players) {
            player.render(ctx, squares, positionCount);

            if (!positionCount[player.position]) positionCount[player.position] = 0;
            positionCount[player.position]++;
        }
    }
}

class Player {
    #count; #color;

    /**
     * @type {HTMLElement}
     */
    #container;

    /**
     * @param {number} count
     * @param {string} color
     * @param {HTMLElement} container
     */
    constructor(count, color, container) {
        this.#count = count;
        this.#color = color;

        this.position = 0;

        container.appendChild(this.#generateElement(this.#color));
    }

    /**
     * @param {OffscreenCanvasRenderingContext2D} ctx
     * @param {Square[]} squares
     */
    render(ctx, squares, playerPositionCounts) {
        ctx.fillStyle = this.#color;

        const square = squares[this.position];
        const positionCount = playerPositionCounts[this.position] ?? 0;

        const startX = square.x + PLAYER_MARGIN;
        const startY = square.y + PLAYER_MARGIN;
        const maxX = square.x + square.w - PLAYER_MARGIN;
        const maxY = square.y + square.h - PLAYER_MARGIN;
        const gridSize = PLAYER_GRID_SIZE + PLAYER_RADIUS * 2;

        let players = 0;
        for (let y = startY; y < maxY; y += gridSize) for (let x = startX; x < maxX; x += gridSize) {
            if (players < positionCount) {
                players++;
                continue;
            }

            ctx.beginPath();
            ctx.arc(x, y, PLAYER_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            return;
        }

        throw new Error('Too many players in one square, failed to render.');
    }

    /**
     * @param {string} text
     * @param {Object|undefined} css
     */
    display(text, css = {}) {
        const interactor = this.#container.querySelector('#interactions');

        const container = document.createElement('div');
        interactor.appendChild(container);

        const textElement = document.createElement('p');
        textElement.innerText = text;
        textElement.style.margin = '0 auto';
        Object.assign(textElement.style, css);
        container.appendChild(textElement);
    }

    /**
     * @returns {HTMLElement}
    */
    getInteractor() {
        return this.#container.querySelector('#interactions');
    }

    clearInteractor() {
        this.#container.querySelector('#interactions').innerHTML = '';
    }

    highlight() {
        this.#container.style.borderWidth = '0.5em';
    }

    unhighlight() {
        this.#container.style.borderWidth = '0.25em';
    }

    /**
     * @param {string} color
     * @returns {HTMLElement}
     */
    #generateElement(color) {
        const container = document.createElement('div');
        container.style.border = `0.25em solid ${color}`;
        container.style.margin = '0.5em';
        container.style.padding = '0.5em';
        container.id = 'container';
        this.#container = container;

        const title = document.createElement('h2');
        title.style.color = color;
        title.style.margin = '0';
        title.innerText = `Player ${this.#count}`;
        title.id = 'title';
        container.appendChild(title);

        this.interactions = document.createElement('div');
        this.interactions.id = 'interactions';
        container.appendChild(this.interactions);

        return container;
    }
}

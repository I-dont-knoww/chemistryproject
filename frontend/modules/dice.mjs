import Canvas from './canvas.mjs';
import { DICE_ROLL_COUNT, DICE_ROLL_DELAY } from './constants.mjs';

import { getButtonPress, sleep, getRandomWeightedValue } from './util.mjs';

export default class Dice {
    static StandardValues = [1, 2, 3, 4, 5, 6];
    static StandardWeights = Array.from({ length: 6 }, () => 1 / 6);

    #values; #weights; #value;

    /**
     * @type {Canvas}
     */
    #canvas;

    /**
     * @type {HTMLElement}
     */
    #container;

    /**
     * @type {HTMLImageElement}
     */
    static #image;

    /**
     * @param {number[]} values
     * @param {number[]} weights
     * @param {HTMLElement} container
     */
    constructor(values, weights, container) {
        this.#values = values;
        this.#weights = weights;

        this.#value = this.#values[0];

        container.appendChild(this.#generateElement());
    }

    #generateElement() {
        const container = document.createElement('div');
        container.style.display = 'table';
        container.style.border = '0.25em solid black';
        container.style.margin = '0.5em';
        container.style.padding = '0.5em';
        container.style.textAlign = 'center';
        container.id = 'container';
        this.#container = container;

        const centeredContainer = document.createElement('div');
        centeredContainer.style.display = 'table-cell';
        centeredContainer.style.verticalAlign = 'middle';
        container.appendChild(centeredContainer);

        const canvasContainer = document.createElement('div');
        canvasContainer.id = 'canvasContainer';
        centeredContainer.appendChild(canvasContainer);

        const canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.id = 'canvas';
        canvasContainer.appendChild(canvas);
        this.#canvas = new Canvas(canvas);

        const button = document.createElement('button');
        button.innerText = 'Roll';
        button.style.display = 'none';
        button.style.width = '75%';
        button.style.fontSize = '1em';
        button.style.backgroundColor = 'white';
        button.style.border = '0.125em solid black';
        button.style.borderRadius = '3px';
        button.style.margin = 'auto';
        button.style.marginTop = '0.5em';
        button.onmouseenter = () => button.style.backgroundColor = 'lightgrey';
        button.onmouseleave = () => button.style.backgroundColor = 'white';
        button.onmousedown = () => button.style.backgroundColor = 'grey';
        button.onmouseup = () => button.style.backgroundColor = 'lightgrey';
        button.id = 'button';
        centeredContainer.appendChild(button);

        return container;
    }

    async getRandomNumber() {
        const button = this.#container.querySelector('#button');
        button.style.display = 'block';
        await getButtonPress(button);
        await sleep(DICE_ROLL_DELAY);
        button.style.display = 'none';

        for (let i = 0; i < DICE_ROLL_COUNT; i++) {
            const randomNumber = getRandomWeightedValue(this.#values, this.#weights);
            this.#value = randomNumber;

            if (i == DICE_ROLL_COUNT - 1) return randomNumber;

            await sleep(DICE_ROLL_DELAY);
        }
    }

    highlight() {
        this.#container.style.borderWidth = '0.5em';
    }

    unhighlight() {
        this.#container.style.borderWidth = '0.25em';
    }

    render() {
        const canvas = this.#canvas.canvas;
        const ctx = this.#canvas.ctx;

        ctx.clearRect(0, 0, this.#canvas.canvas.width, this.#canvas.canvas.height);

        const size = Math.min(canvas.width, canvas.height);

        const image = Dice.#getImage(this.#value);
        ctx.drawImage(image.img, image.x, image.y, image.size, image.size, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size);
    }

    /**
     * @typedef {Object} diceImage
     * @property {HTMLImageElement} img
     * @property {number} x
     * @property {number} y
     * @property {number} size
     */

    /**
     * @param {number} value
     * @returns {diceImage}
     */
    static #getImage(value) {
        if (!Dice.#image) {
            this.#image = new Image();
            this.#image.src = '../assets/dice.jpg';
        }

        const img = Dice.#image;

        const size = 145;

        switch (value) {
            case 1: return { img, x: 20, y: 25, size };
            case 2: return { img, x: 182, y: 25, size };
            case 3: return { img, x: 344, y: 25, size };
            case 4: return { img, x: 20, y: 190, size };
            case 5: return { img, x: 182, y: 190, size };
            case 6: return { img, x: 344, y: 190, size };
            default: throw new Error(`${value} could not be rendered by dice`);
        }
    }
}

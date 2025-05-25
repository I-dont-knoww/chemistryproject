import { BOARD_RESOLUTION, BOARD_SCREEN_PERCENTAGE, BOARD_SIZE } from './constants.mjs';
import Canvas from './canvas.mjs';
import PlayerManager from './player.mjs';
import Squares, { Square } from './squares.mjs';

import { getRandomWeightedValue } from './util.mjs';

export default class Board {
    #dimensions;

    /**
     * @param {number} playerCount
     * @param {typeof Square[]} squares
     */
    constructor(squares) {
        const { positions, dimensions } = this.#getPositionMapping(squares.length);
        this.#dimensions = dimensions;

        /**
         * @type {Square[]}
         */
        this.squares = Array.from(squares, (type, index) => {
            const position = positions[index];
            return new type(index + 1, position.x, position.y, position.w, position.h);
        });
    }

    /**
     * @typedef {Object} rectangle
     * @property {number} x
     * @property {number} y
     * @property {number} w
     * @property {number} h
     */

    /**
     * @typedef {Object} dimensions
     * @property {number} width
     * @property {number} height
     */

    /**
     * @typedef {Object} mapping
     * @property {rectangle[]} positions
     * @property {dimensions} dimensions
     */

    /**
     * @param {number} size
     * @returns {mapping}
     */
    #getPositionMapping(size) {
        const positions = Board.#snake(size, 9).map(position => {
            return {
                x: position.x * BOARD_RESOLUTION,
                y: position.y * BOARD_RESOLUTION,
                w: BOARD_RESOLUTION,
                h: BOARD_RESOLUTION
            };
        });

        return {
            positions,
            dimensions: this.#getDimensions(positions)
        };
    }

    /**
     * @param {rectangle[]} positions
     * @returns {dimensions}
     */
    #getDimensions(positions) {
        let width = 0;
        let height = 0;
        for (const position of positions) {
            if (position.x < 0 || position.y < 0) throw new Error('square x and/or y was negative');

            width = Math.max(width, position.x + position.w);
            height = Math.max(height, position.y + position.h);
        }

        return { width, height };
    }

    /**
     * @param {Canvas} canvas
     * @param {PlayerManager} players
     */
    render(canvas, players) {
        const ctx = canvas.ctx;

        const offscreenCanvas = new OffscreenCanvas(this.#dimensions.width, this.#dimensions.height);
        const offscreenCtx = offscreenCanvas.getContext('2d');

        for (const square of this.squares) square.render(offscreenCtx);
        players.render(offscreenCtx, this.squares);

        const { x, y, width, height } = Board.#createBound(canvas.canvas, this.#dimensions.width, this.#dimensions.height);
        ctx.drawImage(offscreenCanvas, x, y, width, height);
    }

    /**
     * @typedef {Object} positions
     * @property {number} x
     * @property {number} y
     */

    /**
     * @param {number} count
     * @param {number} width
     * @returns {positions[]}
     */
    static #snake(count, width) {
        const positions = [];

        let yLevel = 0;
        while (positions.length <= count) {
            for (let i = 0; i < width; i++) positions.push({ x: i, y: yLevel });
            positions.push({ x: width - 1, y: yLevel + 1 });
            yLevel += 2;

            for (let i = width - 1; i >= 0; i--) positions.push({ x: i, y: yLevel });
            positions.push({ x: 0, y: yLevel + 1 });
            yLevel += 2;
        }

        return positions.slice(0, count);
    }

    /**
     * @typedef {Object} bound
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     */

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {number} width
     * @param {number} height
     * @returns {bound}
     */
    static #createBound(canvas, width, height) {
        const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();

        const maxWidth = canvasWidth * BOARD_SCREEN_PERCENTAGE;
        const maxHeight = canvasHeight * BOARD_SCREEN_PERCENTAGE;

        const maxWidthFactor = maxWidth / width;
        const maxHeightFactor = maxHeight / height;

        const factor = Math.min(maxWidthFactor, maxHeightFactor);

        const newWidth = width * factor;
        const newHeight = height * factor;

        const x = canvasWidth / 2 - newWidth / 2;
        const y = canvasHeight / 2 - newHeight / 2;

        return { x, y, width: newWidth, height: newHeight };
    }
    

    static generateBoard(weights) {
        const squares = Array.from({ length: BOARD_SIZE - 1 }, () => getRandomWeightedValue(Object.values(Squares), weights));
        return new Board([Squares.Basic].concat(squares));
    }
}

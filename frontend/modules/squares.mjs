import { BACKGROUND_COLOR, DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, ELEMENTS_TO_NAME, SQUARES_TO_MOVE_BACK } from './constants.mjs';
import Elements from './elements.mjs';
import PlayerManager from './player.mjs';
import Question from './aiquestion.mjs';

import { sleep } from './util.mjs';

export class Square {
    /**
     * @param {number} count
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     */
    constructor(count, x, y, w, h) {
        this.count = count;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /**
     * @param {PlayerManager} players
     */
    async onPlayerEnter(players) {
        throw new Error('method onPlayerEnter() must be implemented for class Square');
    }

    /**
     * @param {OffscreenCanvasRenderingContext2D} ctx
     */
    render(ctx) {
        throw new Error('method render() must be implemented for class Square');
    }

    /**
     * @param {OffscreenCanvasRenderingContext2D} ctx
     * @param {string} backgroundColor
     * @param {string} text
     * @param {string} font
     */
    drawSquare(ctx, backgroundColor, { text, font }) {
        const innerX = this.x + ctx.lineWidth / 2;
        const innerY = this.y + ctx.lineWidth / 2;
        const innerW = this.w - ctx.lineWidth;
        const innerH = this.h - ctx.lineWidth;

        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = DEFAULT_BORDER_COLOR;
        ctx.lineWidth = DEFAULT_BORDER_WIDTH;

        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x + ctx.lineWidth / 2, this.y + ctx.lineWidth / 2, this.w - ctx.lineWidth, this.h - ctx.lineWidth);

        ctx.fillStyle = DEFAULT_BORDER_COLOR;
        ctx.font = '2rem Trebuchet MS';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';

        ctx.fillText(this.count, innerX + innerW - 3, innerY + innerH);

        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, innerX + innerW / 2, innerY + innerH / 2);
    }
}

class BasicSquare extends Square {
    static #color = BACKGROUND_COLOR;

    onPlayerEnter() { }

    /**
     * @param {OffscreenCanvasRenderingContext2D} ctx
     */
    render(ctx) {
        super.drawSquare(ctx, BasicSquare.#color, { text: '' });
    }
}

class QuestionSquare extends Square {
    /**
     * @callback QuestionGenerator
     * @param {HTMLElement} interactor
     * @returns {Promise<boolean>}
     */

    /**
     * @param {PlayerManager} players
     * @param {string} titleText
     * @param {QuestionGenerator} questionSet
     */
    async onPlayerEnter(players, titleText, questionSet) {
        players.clearCurrentPlayerInteractor();
        players.displayTextOnCurrentPlayer(titleText, { fontSize: '0.75em' });

        const interactor = players.getCurrentPlayerInteractor();
        const passedQuestion = await questionSet(interactor);

        if (!passedQuestion) {
            players.displayIncorrect();
            await sleep(1000);
            players.clearCurrentPlayerInteractor();

            const { successful: passedElements, feedback } = await Elements.generateHTML(interactor);

            if (!passedElements) {
                players.displayIncorrect();
                players.displayTextOnCurrentPlayer(feedback, { color: 'red', fontSize: '0.75em' });
                await players.punishCurrentPlayer();
            } else players.displayCorrect();

        } else players.displayCorrect();
    }

    /**
     * @param {OffscreenCanvasRenderingContext2D} ctx
     */
    render(ctx) {
        throw new Error('method render() must be implemented for class QuestionSquare');
    }
}

class QuizSquare extends QuestionSquare {
    static #color = '#e6d7ff';

    /**
     * @param {PlayerManager} players
     */
    async onPlayerEnter(players) {
        await super.onPlayerEnter(players, `Quiz: Answer correctly or you'll be moved back ${SQUARES_TO_MOVE_BACK} squares.`, Question.getQuizQuestion);
    }

    /**
     * @param {OffscreenCanvasRenderingContext2D} ctx
     */
    render(ctx) {
        super.drawSquare(ctx, QuizSquare.#color, { text: 'Quiz', font: '2.5rem Trebuchet MS' });
    }
}

class LabSquare extends QuestionSquare {
    static #color = '#ffdbbb';

    /**
     * @param {PlayerManager} players
     */
    async onPlayerEnter(players) {
        await super.onPlayerEnter(players, `Lab Question: Answer correctly or you'll be moved back ${SQUARES_TO_MOVE_BACK} squares.`, Question.getLabQuestion);
    }

    /**
     * @param {OffscreenCanvasRenderingContext2D} ctx
     */
    render(ctx) {
        super.drawSquare(ctx, LabSquare.#color, { text: 'Lab', font: '2.5rem Trebuchet MS' });
    }
}

export default {
    Basic: BasicSquare,
    Quiz: QuizSquare,
    Lab: LabSquare
};

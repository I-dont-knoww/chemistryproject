import Board from './modules/board.mjs';
import Canvas from './modules/canvas.mjs';
import Dice from './modules/dice.mjs';
import PlayerManager from './modules/player.mjs';
import Question from './modules/aiquestion.mjs';

import { sleep } from './modules/util.mjs';

const canvas = new Canvas(document.querySelector('canvas'));
const ui = document.querySelector('.interface');

// const board = Board.generateBoard([0.6, 0.2, 0.2]);
const board = Board.generateBoard([0, 1, 0]);
const dice = new Dice(Dice.StandardValues, Dice.StandardWeights, ui);
const players = new PlayerManager(4, ui);

function render() {
    canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);

    board.render(canvas, players);
    dice.render();

    requestAnimationFrame(render);
}
requestAnimationFrame(render);

async function mainGameLoop() {
    const interactor = players.getCurrentPlayerInteractor();

    // ask player a question and let them move if they get it correct
    players.clearCurrentPlayerInteractor();
    players.displayTextOnCurrentPlayer('Answer the question below to roll the dice:', { fontSize: '0.75em' });
    const passedQuestion = await Question.getSimpleQuestion(interactor);
    if (passedQuestion) {
        players.displayCorrect();

        // ask player to roll dice
        dice.highlight();
        const distance = await dice.getRandomNumber();
        await sleep(500);

        // play animation to move player
        await players.moveCurrentPlayer(distance);
        await sleep(250);
        dice.unhighlight();

        // do the thing that the current square wishes to do
        const currentSquare = board.squares[players.getCurrentPlayerPosition()];
        await currentSquare.onPlayerEnter(players);
        await sleep(250);
    } else {
        players.displayIncorrect();
        await sleep(1000);
    }

    players.goToNextTurn();

    setTimeout(mainGameLoop, 0);
}

mainGameLoop();

import Board from './modules/board.mjs';
import Canvas from './modules/canvas.mjs';
import Dice from './modules/dice.mjs';
import PlayerManager from './modules/player.mjs';

import { sleep } from './modules/util.mjs';
import { StartScreen, EndScreen } from './modules/screen.mjs';

const playerCount = await new StartScreen().playerCount;

const canvas = new Canvas(document.querySelector('canvas'));
const ui = document.querySelector('.interface');

const board = Board.generateBoard([0.2, 0.4, 0.4]);
const dice = new Dice(Dice.StandardValues, Dice.StandardWeights, ui);
const players = new PlayerManager(playerCount, ui);

function render() {
    canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);

    board.render(canvas, players);
    dice.render();

    requestAnimationFrame(render);
}
requestAnimationFrame(render);

async function mainGameLoop() {
    players.clearCurrentPlayerInteractor();

    // ask player to roll dice
    dice.highlight();
    const distance = await dice.getRandomNumber();
    await sleep(500);

    // play animation to move player
    const playerWon = await players.moveCurrentPlayer(distance);
    await sleep(250);
    dice.unhighlight();

    // do the thing that the current square wishes to do
    const currentSquare = board.squares[players.getCurrentPlayerPosition()];
    await currentSquare.onPlayerEnter(players);
    await sleep(250);

    // finally check playerWon here so that they can answer potential quizzes
    if (playerWon >= 0) {
        onWin(playerWon);
        return;
    }

    players.goToNextTurn();

    setTimeout(mainGameLoop, 0);
}

/**
 * @param {number} playerWon
 */
function onWin(playerWon) {
    new EndScreen(playerWon);
}

mainGameLoop();

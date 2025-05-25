import { SERVER_NAME } from './constants.mjs';

class Question {
    #question;

    /**
     * @param {string} question
     */
    constructor(question) {
        this.#question = question;
    }

    /**
     * @param {HTMLElement} interactor
     * @returns {Promise<boolean>}
     */
    generateHTML(interactor) {
        const container = document.createElement('div');
        interactor.appendChild(container);

        const question = document.createElement('p');
        question.style.margin = '0.25em auto';
        question.innerText = this.#question;
        container.appendChild(question);

        const answer = document.createElement('input');
        answer.type = 'text';
        answer.style.display = 'block';
        answer.style.width = '100%';
        container.appendChild(answer);

        const { promise, resolve } = Promise.withResolvers();

        const checkAnswer = document.createElement('button');
        checkAnswer.innerText = 'Check Answer';
        checkAnswer.onclick = async () => resolve(await this.#answer(answer.value));
        container.appendChild(checkAnswer);

        return promise;
    }

    /**
     * @param {string} userAnswer
     * @returns {Promise<boolean>}
     */
    async #answer(userAnswer) {
        userAnswer = userAnswer.replaceAll('~', '');
        const output = await (await fetch(SERVER_NAME, { method: 'POST', body: `${this.#question}~${userAnswer}` })).text();

        return output.indexOf('true') >= 0;
    }
}

export default {
    getSimpleQuestion: async function (interactor) {
        const questionString = await(await fetch(`${SERVER_NAME}/simple`)).text();

        const question = new Question(questionString);
        return await question.generateHTML(interactor);
    },

    /**
     * @param {HTMLElement} interactor
     * @returns {Promise<boolean>}
     */
    getQuizQuestion: async function (interactor) {
        const questionString = await (await fetch(`${SERVER_NAME}/quiz`)).text();

        const question = new Question(questionString);
        return await question.generateHTML(interactor);
    },

    /**
     * @param {HTMLElement} interactor
     * @returns {Promise<boolean>}
     */
    getLabQuestion: async function (interactor) {
        const questionString = await(await fetch(`${SERVER_NAME}/lab`)).text();

        const question = new Question(questionString);
        return await question.generateHTML(interactor);
    }
};

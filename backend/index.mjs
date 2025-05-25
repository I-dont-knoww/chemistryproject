import { GoogleGenAI } from '@google/genai';
import * as http from 'http'

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL = 'gemini-2.0-flash';
const ALLOW_ACCESS = process.env.CORS;

const COMMON_PROMPT = 'The response should not contain the character "~". The question should not require to be answered by drawing, graphing, or anything that can not be accomplished with just a keyboard. Do not provide the answer to the problem you generated. In the text input, there will more instructions and a history of all the problems you generated previously, all on separate lines. Try to create problems that are not the same as those that you have generated previously. There should not be any context required, ie. there should not be a "Which of the following..." in the generated question.';
const SIMPLE_QUESTION_PROMPT = `Generate a SIMPLE one line AP Chemistry question. The question should not require the use of a calculator, and should be knowledge based.`;
const QUIZ_QUESTION_PROMPT = `Generate a medium difficulty one line AP Chemistry question that does not require the use of a lot of math.`;
const LAB_QUESTION_PROMPT = `Generate a one line AP Chemistry question relating to any of the following labs: Gravimetric Analysis, Combustion Analysis, Titration, Making a Solution, Fractional Distillation, or Calorimetry. The question may require the use of a calculator.`;

const CHECK_ANSWER_PROMPT = 'On the first line there will be a question relating to AP Chemistry, and on the second line, there will be an answer provided by a user. Check if the answer provided by the user is correct, and if it is, respond with "true", and if it is not, respond with "false". Do not provide feedback. Only respond with either "true" or "false".';

const answerHistory = {
    simple: [],
    quiz: [],
    lab: [],
};
const MAX_ANSWER_HISTORY_LENGTH = 10;

/**
 * @param {string} newResponse
 * @param {string} type
 */
function updateAnswerHistory(newResponse, type) {
    answerHistory[type].push(newResponse);
    if (answerHistory.length > MAX_ANSWER_HISTORY_LENGTH) answerHistory.shift();
}

/**
 * @returns {string}
 */
function generateUnit() {
    const units = ['atomic structure and properties', 'compound structure and properties', 'properties of substances and mixtures', 'chemical reactions', 'kinetics', 'thermochemistry', 'equilibrium', 'acids and bases', 'thermodynamics and electrochemistry'];
    return `The question should be from the ${units[Math.floor(Math.random() * units.length)]} unit of the AP Chemistry curriculum.`;
}

/**
 * @returns {string}
 */
function generateLab() {
    const labs = ['Gravimetric Analysis', 'Combustion Analysis', 'Titration', 'Making a Solution', 'Fractional Distillation', 'Calorimetry'];
    return `The question shoulbe from the ${labs[Math.floor(Math.random() * labs.length)]} lab.`;
}

/**
 * @returns {Promise<string>}
 */
async function createSimpleQuestion() {
    const response = await ai.models.generateContent({
        model: MODEL,
        contents: `${SIMPLE_QUESTION_PROMPT} ${generateUnit()}\n${answerHistory.simple.join('\n')}`,
        config: {
            systemInstruction: `${COMMON_PROMPT}`
        }
    });

    updateAnswerHistory(response.text, 'simple');
    return response.text;
}

/**
 * @returns {Promise<string>}
 */
async function createQuizQuestion() {
    const response = await ai.models.generateContent({
        model: MODEL,
        contents: `${QUIZ_QUESTION_PROMPT} ${generateUnit()}\n${answerHistory.quiz.join('\n')}`,
        config: {
            systemInstruction: `${COMMON_PROMPT}`
        }
    });

    updateAnswerHistory(response.text, 'quiz');
    return response.text;
}

/**
 * @returns {Promise<string>}
 */
async function createLabQuestion() {
    const response = await ai.models.generateContent({
        model: MODEL,
        contents: `${LAB_QUESTION_PROMPT} ${generateLab()}\n${answerHistory.lab.join('\n')}`,
        config: {
            systemInstruction: `${COMMON_PROMPT}`
        }
    });

    updateAnswerHistory(response.text, 'lab');
    return response.text;
}

/**
 * @param {string} question
 * @param {string} answer
 * @returns {Promise<boolean>}
 */
async function checkQuestion(question, answer) {
    if (answer == '') return 'false';
    
    const response = await ai.models.generateContent({
        model: MODEL,
        contents: `${question}\n${answer}`,
        config: {
            systemInstruction: `${CHECK_ANSWER_PROMPT}`
        }
    });

    return response.text;
}

http.createServer(async function (request, response) {
    // response.setHeader('Access-Control-Allow-Origin', ALLOW_ACCESS);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'text/plain');

    if (request.method == 'GET') {
        console.log(`Generating ${request.url.substring(1)} question.`);

        if (request.url == '/simple') response.end(await createSimpleQuestion());
        else if (request.url == '/quiz') response.end(await createQuizQuestion());
        else if (request.url == '/lab') response.end(await createLabQuestion());
        else response.end('not supported');
    } else if (request.method == 'POST') {
        let body = '';

        request.on('data', function (data) {
            body += data;
            if (body.length > 1e6) request.socket.destroy();
        });

        request.on('end', async function () {
            const [question, answer] = body.split('~');

            console.log(`Checking if "${answer}" is correct for "${question.trim()}"`);
            response.end(await checkQuestion(question, answer));
        });
    }
}).listen(process.env.PORT, () => {
    console.log(`Server listening to port ${process.env.PORT}`);
});

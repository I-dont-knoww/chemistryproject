import { PeriodicTable } from './molecules.mjs';

const questionScope = {
    check: function (input, ...answers) {
        return answers.reduce((returnVal, answer) => returnVal || input == answer, false);
    },

    p: new PeriodicTable(),

    getBondingStructure: function (s, l) {
        if (s == 1) return 'linear';
        if (s == 2) return 'linear';

        if (s == 3) {
            if (l == 0) return 'trigonal planar';
            if (l == 1) return 'bent';
            if (l == 2) return 'linear';
        }

        if (s == 4) {
            if (l == 0) return 'tetrahedral';
            if (l == 1) return 'trigonal pyramid';
            if (l == 2) return 'bent';
            if (l == 3) return 'linear';
        }

        if (s == 5) {
            if (l == 0) return 'trigonal bipyramid';
            if (l == 1) return 'seesaw';
            if (l == 2) return 't-shape';
            if (l == 3) return 'linear';
            if (l == 4) return 'linear';
        }

        if (s == 6) {
            if (l == 0) return 'octahedral';
            if (l == 1) return 'square pyramid';
            if (l == 2) return 'square planar';
            if (l == 3) return 't-shape';
            if (l == 4) return 'linear';
            if (l == 5) return 'linear';
        }

        return `doesn't exist`;
    },
    bondingStructure: ['linear,', 'trigonal planar', 'bent', 'tetrahedral', 'trigonal pyramid', 'trigonal bipyramid', 'seesaw', 't-shape', 'octahedral', 'square pyramid', 'square planar'],
    getBondingAngle: function (name) {
        if (name == 'linear') return ['180'];
        if (name == 'trigonal planar') return ['120'];
        if (name == 'bent') return ['<120'];
        if (name == 'tetrahedral') return ['109.5'];
        if (name == 'trigonal pyramid') return ['<109.5'];
        if (name == 'trigonal bipyramid') return ['90', '120'];
        if (name == 'seesaw') return ['<90', '<120'];
        if (name == 't-shape') return ['<90'];
        if (name == 'octahedral') return ['90'];
        if (name == 'square pyramid') return ['<90'];
        if (name == 'square planar') return ['90'];
    },
    checkBondingAngle: function (input, name) {
        const inputAngles = input.split(',').map(v => v.trim());
        const actualAngles = this.getBondingAngle(name);
        if (actualAngles.length == 2)
            return (inputAngles[0] == actualAngles[0] && inputAngles[1] == actualAngles[1]) || (inputAngles[0] == actualAngles[1] && inputAngles[1] == actualAngles[0]);
        else return inputAngles[0] == actualAngles[0];
    }
};

class RandomVariable {
    /**
     * @param {string} name
     * @param {number} min
     * @param {number} max
     * @param {string[]} modifiers
     */
    constructor(name, min, max, modifiers) {
        this.name = name;
        this.min = min;
        this.max = max;
        this.modifiers = modifiers;
    }

    generateNumber() {
        if (this.modifiers.indexOf('floor') >= 0) {
            const number = Math.random() * (this.max - this.min + 1) + this.min;
            return this.modifiers.indexOf('floor') >= 0 ? Math.floor(number) : number;
        } else return Math.random() * (this.max - this.min) + this.min;
    }

    /**
     * @param {string} unparsed
     * @returns {RandomVariable}
     */
    static parseVariable(unparsed) {
        const [name, minString, maxString, ...modifiers] = unparsed.split('_');

        const min = Number(minString);
        const max = Number(maxString);

        return new RandomVariable(name, min, max, modifiers);
    }
}

class QuestionGenerator {
    #questionGenerator; #answerGenerator; #randomVariables;

    /**
     * @callback generator
     * @param {...number} randoms
     */

    /**
     * @param {generator} questionGenerator
     * @param {generator} answerGenerator
     * @param {RandomVariable[]} randomVariables
     */
    constructor(questionGenerator, answerGenerator, randomVariables) {
        this.#questionGenerator = questionGenerator;
        this.#answerGenerator = answerGenerator;
        this.#randomVariables = randomVariables;
    }

    /**
     * @param {HTMLElement} interactor
     * @returns {Promise<boolean>}
     */
    askQuestion(interactor) {
        const randomNumbers = this.#randomVariables.map(variable => variable.generateNumber());

        const questionString = this.#questionGenerator(...randomNumbers);
        const answerString = this.#answerGenerator.bind(window, ...randomNumbers);

        const question = new Question(questionString, answerString, interactor);
        return question.generateHTML(interactor);
    }

    /**
     * @param {string} unparsed
     * @returns {QuestionGenerator}
     */
    static parseQuestion(unparsed) {
        const buffer = read(unparsed.split('\n'));

        const variableString = buffer.next().value;
        const variables = variableString == '!' ? [] :
            variableString.split(';').map(variable => RandomVariable.parseVariable(variable));
        const variableNames = variables.map(variable => variable.name);

        const questionGenerator = new Function(...variableNames, `return \`${buffer.next().value.replaceAll('@', '$').replaceAll('~', '`')}\`;`).bind(questionScope);
        const answerGenerator = new Function(...variableNames, 'answer', `${buffer.next().value.replaceAll('@', '$').replaceAll('~', '`')};`).bind(questionScope);

        return new QuestionGenerator(questionGenerator, answerGenerator, variables);
    }
}

class Question {
    #question; #answer;

    /**
     * @callback AnswerChecker
     * @param {string} userAnswer
     * @returns {boolean}
     */

    /**
     * @param {string} question
     * @param {AnswerChecker} answer
     */
    constructor(question, answer) {
        this.#question = question;
        this.#answer = answer;
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
        checkAnswer.onclick = () => resolve(this.#answer(answer.value));
        container.appendChild(checkAnswer);

        return promise;
    }
}

/**
 * @param {string} unparsed
 * @returns {QuestionGenerator[]}
 */
function parseQuestionMap(unparsed) {
    return unparsed.split('\n\t\n').map(question => QuestionGenerator.parseQuestion(question));
}

const quizQuestionMap = parseQuestionMap(`
x_1_54_floor
What is the name of the element with symbol @{this.p.elWith(e => e.num == x).sym}?
return answer.toLowerCase() == this.p.elWith(e => e.num == x).name.toLowerCase()
\t
x_1_54_floor
What is the symbol of the element with name @{this.p.elWith(e => e.num == x).name}?
return answer.toLowerCase() == this.p.elWith(e => e.num == x).sym.toLowerCase()
\t
!
Which subatomic particle determines the behavior of an element?
return this.check(answer.toLowerCase(), 'electron', 'e-')
\t
period_2_6_floor;charge_1_2_floor
Which element has the smaller atomic radius: @{this.p.elWith(e => e.charge == charge && e.period == period).sym} or @{this.p.elWith(e => e.charge == 2 - (charge - 1) && e.period == period).sym}?
const el = this.p.elWith(e => e.period == period && e.charge == 2); return this.check(answer.toLowerCase(), el.sym.toLowerCase(), el.name.toLowerCase())
\t
period_2_6_floor;charge_1_2_floor
Which element has the larger ionization energy: @{this.p.elWith(e => e.charge == charge && e.period == period).sym} or @{this.p.elWith(e => e.charge == 2 - (charge - 1) && e.period == period).sym}?
const el = this.p.elWith(e => e.period == period && e.charge == 1); return this.check(answer.toLowerCase(), el.sym.toLowerCase(), el.name.toLowerCase())
\t
x_1_118_floor;y_1_118_floor;z_0_1_floor
If an atom with an atomic mass of @{Math.max(x, y)} has @{Math.min(x, y)} @{!!z ? 'proton' : 'neutron'}s, how many @{!z ? 'proton' : 'neutron'}s would it have?
return this.check(answer.toLowerCase(), Math.max(x, y) - Math.min(x, y), Math.max(x, y) - Math.min(x, y) + ' ' + (!z ? 'proton' : 'neutron') + 's');
\t
x_1_6_floor;y_0_6_floor
What is the shape of a molecule with a steric number of @{Math.max(x, y)} and a lone pair count of @{Math.min(x, y)}? If the shape does not have a name, enter "doesn't exist".
return this.check(answer.toLowerCase(), this.getBondingStructure(Math.max(x, y), Math.min(x, y)))
\t
x_0_10_floor
What is/are the bond angle(s) in a @{this.bondingStructure[x]} molecule?
return this.checkBondingAngle(answer.toLowerCase(), this.bondingStructure[x])
\t
x_1_3_floor
Which type of bonding (covalent, ionic, metallic) involves @{x == 1 ? 'the sharing of electrons' : (x == 2 ? 'the transfer of an electron' : 'delocalized electrons')}?
return answer.toLowerCase() == ((x == 1) ? 'covalent' : (x == 2 ? 'ionic' : 'metallic'))
`.trim());

const labQuestionMap = parseQuestionMap(`
x_1_10_floor;y_1_10_floor
What is @{x} + @{y}?
answer == x + y
\t
!
What is 1 + 1?
answer == 2
`.trim());

export default {
    /**
     * @param {HTMLElement} interactor
     * @returns {Promise<boolean>}
     */
    getQuizQuestion: function (interactor) {
        // const generator = quizQuestionMap[Math.floor(Math.random() * quizQuestionMap.length)];
        const generator = quizQuestionMap.at(-1);
        return generator.askQuestion(interactor);
    },

    /**
     * @param {HTMLElement} interactor
     * @returns {Promise<boolean>}
     */
    getLabQuestion: function (interactor) {
        const generator = labQuestionMap[Math.floor(Math.random() * labQuestionMap.length)];
        return generator.askQuestion(interactor);
    }
};

/**
 * @param {string[]} lines
 * @yields {string}
 */
function* read(lines) {
    for (const line of lines) yield line;
}

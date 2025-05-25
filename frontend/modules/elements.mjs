import { ELEMENTS_TO_NAME, TIME_TO_NAME_ELEMENTS } from './constants.mjs';

export default class Elements {
    static #elements = [
        'Hydrogen',
        'Helium',
        'Lithium',
        'Beryllium',
        'Boron',
        'Carbon',
        'Nitrogen',
        'Oxygen',
        'Fluorine',
        'Neon',
        'Sodium',
        'Magnesium',
        'Aluminium',
        'Silicon',
        'Phosphorus',
        'Sulfur',
        'Chlorine',
        'Argon',
        'Potassium',
        'Calcium',
        'Scandium',
        'Titanium',
        'Vanadium',
        'Chromium',
        'Manganese',
        'Iron',
        'Cobalt',
        'Nickel',
        'Copper',
        'Zinc',
        'Gallium',
        'Germanium',
        'Arsenic',
        'Selenium',
        'Bromine',
        'Krypton',
        'Rubidium',
        'Strontium',
        'Yttrium',
        'Zirconium',
        'Niobium',
        'Molybdenum',
        'Technetium',
        'Ruthenium',
        'Rhodium',
        'Palladium',
        'Silver',
        'Cadmium',
        'Indium',
        'Tin',
        'Antimony',
        'Tellurium',
        'Iodine',
        'Xenon',
        'Caesium',
        'Barium',
        'Lanthanum',
        'Cerium',
        'Praseodymium',
        'Neodymium',
        'Promethium',
        'Samarium',
        'Europium',
        'Gadolinium',
        'Terbium',
        'Dysprosium',
        'Holmium',
        'Erbium',
        'Thulium',
        'Ytterbium',
        'Lutetium',
        'Hafnium',
        'Tantalum',
        'Tungsten',
        'Rhenium',
        'Osmium',
        'Iridium',
        'Platinum',
        'Gold',
        'Mercury',
        'Thallium',
        'Lead',
        'Bismuth',
        'Polonium',
        'Astatine',
        'Radon',
        'Francium',
        'Radium',
        'Actinium',
        'Thorium',
        'Protactinium',
        'Uranium',
        'Neptunium',
        'Plutonium',
        'Americium',
        'Curium',
        'Berkelium',
        'Californium',
        'Einsteinium',
        'Fermium',
        'Mendelevium',
        'Nobelium',
        'Lawrencium',
        'Rutherfordium',
        'Dubnium',
        'Seaborgium',
        'Bohrium',
        'Hassium',
        'Meitnerium',
        'Darmstadtium',
        'Roentgenium',
        'Copernicium',
        'Nihonium',
        'Flerovium',
        'Moscovium',
        'Livermorium',
        'Tennessine',
        'Oganesson'
    ].map(element => element.toLowerCase());

    /**
     * @typedef {Object} ElementFeedback
     * @param {boolean} successful
     * @param {string} feedback
     */

    /**
     * @param {HTMLElement} interactor
     * @returns {Promise<ElementFeedback>}
     */
    static generateHTML(interactor) {
        const container = document.createElement('div');
        interactor.appendChild(container);

        const instructions = document.createElement('p');
        instructions.innerText = `You failed the question. In order to avoid a penalization, you must name ${ELEMENTS_TO_NAME} real elements that haven't been named yet by other players.`;
        instructions.style.margin = '0 auto';
        container.appendChild(instructions);

        const clarifications = document.createElement('p');
        clarifications.innerText = 'Separate the elements with commas. Use their full names.';
        clarifications.style.margin = '0 auto';
        clarifications.style.fontSize = '0.75em';
        container.appendChild(clarifications);

        const { promise, resolve } = Promise.withResolvers();

        const answer = document.createElement('input');
        answer.type = 'text';
        answer.style.display = 'block';
        answer.style.width = '100%';
        container.appendChild(answer);

        const timer = document.createElement('p');
        timer.style.margin = '0 auto';
        timer.style.fontSize = '0.75em';
        container.appendChild(timer);

        const button = document.createElement('button');
        button.innerText = 'Check Answer';
        button.onclick = () => resolve(Elements.#elementsNamedSuccessfully(answer.value));
        container.appendChild(button);

        let time = TIME_TO_NAME_ELEMENTS;
        (function updateTimer() {
            if (time == 0) {
                button.click();
                return;
            }

            timer.innerText = `You have ${time--} seconds left to name ${ELEMENTS_TO_NAME} elements.`;
            setTimeout(updateTimer, 1000);
        })()

        return promise;
    }

    /**
     * @param {string} elementsNamed
     * @returns {ElementFeedback}
     */
    static #elementsNamedSuccessfully(unformattedElements) {
        const elementsEntered = Elements.#formatAnswer(unformattedElements);
        if (elementsEntered.length < ELEMENTS_TO_NAME) return { successful: false, feedback: 'Not enough elements named.' };

        const indicesToRemove = [];
        const elementsNamed = [];

        let successful = true;
        let invalidElements = [];

        for (const element of elementsEntered) {
            const index = Elements.#elements.findIndex(v => v == element);

            if (index == -1 || elementsNamed.findIndex(v => v == element) >= 0) {
                successful = false;
                invalidElements.push(element);
            }

            indicesToRemove.push(index);
            elementsNamed.push(Elements.#elements[index]);
        }

        if (successful) {
            indicesToRemove.sort((a, b) => a - b);
            indicesToRemove.reverse();
            for (const index of indicesToRemove) Elements.#elements.splice(index, 1);
        }

        return { successful, feedback: `The following elements were either already used or were spelled incorrectly: ${Elements.#getFeedback(invalidElements)}` };
    }

    /**
     * @param {string} unformatted
     */
    static #formatAnswer(unformatted) {
        const formatted = unformatted.split(',').map(element => element.trim().toLowerCase());
        if (formatted.length > ELEMENTS_TO_NAME) formatted.length = ELEMENTS_TO_NAME;
        return formatted;
    }

    /**
     * @param {string[]} invalidElements
     * @returns {string}
     */
    static #getFeedback(invalidElements) {
        if (invalidElements.length == 0) return '';
        if (invalidElements.length == 1) return invalidElements[0];
        if (invalidElements.length == 2) return invalidElements[0] + ' and ' + invalidElements[1];

        const firstSection = invalidElements.filter((_, i) => i < invalidElements.length - 1).join(', ');
        return firstSection + ', and ' + invalidElements.at(-1);
    }
}

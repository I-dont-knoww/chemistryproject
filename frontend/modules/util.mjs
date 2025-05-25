/**
 * @param {number} ms
 */
export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @param {HTMLButtonElement} button
 */
export async function getButtonPress(button) {
    const { promise, resolve } = Promise.withResolvers();
    button.addEventListener('mousedown', resolve, { once: true });

    return promise;
}

/**
 * @param {number[]} values
 * @param {number[]} weights
 */
export function getRandomWeightedValue(values, weights) {
    const cdf = weights.map((sum => value => sum += value)(0));
    const rand = Math.random();

    const index = cdf.findIndex(el => rand <= el);

    return index == -1 ? values[0] : values[index];
}

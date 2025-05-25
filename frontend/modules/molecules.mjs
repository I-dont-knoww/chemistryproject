class Element {
    /**
     * @param {number} num
     * @param {string} sym
     * @param {string} name
     * @param {number} group
     * @param {number} period
     * @param {number} weight
     * @param {number} eneg
     */
    constructor(num, sym, name, group, period, weight, eneg) {
        this.num = num;
        this.sym = sym;
        this.name = name;
        this.group = group;
        this.period = period;
        this.weight = weight;
        this.eneg = eneg;

        this.charge = Element.#getCharge(group);
    }

    /**
     * @param {number} group
     */
    static #getCharge(group) {
        if (group == 1) return 1;
        if (group == 2) return 2;
        if (group == 13) return 3;
        if (group == 15) return -3;
        if (group == 16) return -2;
        if (group == 17) return -1;
        if (group == 18) return 0;

        return NaN;
    }
}

export class PeriodicTable {
    static SMALL_ELEMENT_CUTOFF = 54;

    constructor() {
        this.Elements = [
            new Element(1, 'H', 'Hydrogen', 1, 1, 1.008, 2.2),
            new Element(2, 'He', 'Helium', 18, 1, 4.0026, -1),
            new Element(3, 'Li', 'Lithium', 1, 2, 6.94, 0.98),
            new Element(4, 'Be', 'Beryllium', 2, 2, 9.0122, 1.57),
            new Element(5, 'B', 'Boron', 13, 2, 10.81, 2.04),
            new Element(6, 'C', 'Carbon', 14, 2, 12.011, 2.55),
            new Element(7, 'N', 'Nitrogen', 15, 2, 14.007, 3.04),
            new Element(8, 'O', 'Oxygen', 16, 2, 15.999, 3.44),
            new Element(9, 'F', 'Fluorine', 17, 2, 18.998, 3.98),
            new Element(10, 'Ne', 'Neon', 18, 2, 20.18, -1),
            new Element(11, 'Na', 'Sodium', 1, 3, 22.99, 0.93),
            new Element(12, 'Mg', 'Magnesium', 2, 3, 24.305, 1.31),
            new Element(13, 'Al', 'Aluminium', 13, 3, 26.982, 1.61),
            new Element(14, 'Si', 'Silicon', 14, 3, 28.085, 1.9),
            new Element(15, 'P', 'Phosphorus', 15, 3, 30.974, 2.19),
            new Element(16, 'S', 'Sulfur', 16, 3, 32.06, 2.58),
            new Element(17, 'Cl', 'Chlorine', 17, 3, 35.45, 3.16),
            new Element(18, 'Ar', 'Argon', 18, 3, 39.95, -1),
            new Element(19, 'K', 'Potassium', 1, 4, 39.098, 0.82),
            new Element(20, 'Ca', 'Calcium', 2, 4, 40.078, 1),
            new Element(21, 'Sc', 'Scandium', 3, 4, 44.956, 1.36),
            new Element(22, 'Ti', 'Titanium', 4, 4, 47.867, 1.54),
            new Element(23, 'V', 'Vanadium', 5, 4, 50.942, 1.63),
            new Element(24, 'Cr', 'Chromium', 6, 4, 51.996, 1.66),
            new Element(25, 'Mn', 'Manganese', 7, 4, 54.938, 1.55),
            new Element(26, 'Fe', 'Iron', 8, 4, 55.845, 1.83),
            new Element(27, 'Co', 'Cobalt', 9, 4, 58.933, 1.88),
            new Element(28, 'Ni', 'Nickel', 10, 4, 58.693, 1.91),
            new Element(29, 'Cu', 'Copper', 11, 4, 63.546, 1.9),
            new Element(30, 'Zn', 'Zinc', 12, 4, 65.38, 1.65),
            new Element(31, 'Ga', 'Gallium', 13, 4, 69.723, 1.81),
            new Element(32, 'Ge', 'Germanium', 14, 4, 72.63, 2.01),
            new Element(33, 'As', 'Arsenic', 15, 4, 74.922, 2.18),
            new Element(34, 'Se', 'Selenium', 16, 4, 78.971, 2.55),
            new Element(35, 'Br', 'Bromine', 17, 4, 79.904, 2.96),
            new Element(36, 'Kr', 'Krypton', 18, 4, 83.798, 3),
            new Element(37, 'Rb', 'Rubidium', 1, 5, 85.468, 0.82),
            new Element(38, 'Sr', 'Strontium', 2, 5, 87.62, 0.95),
            new Element(39, 'Y', 'Yttrium', 3, 5, 88.906, 1.22),
            new Element(40, 'Zr', 'Zirconium', 4, 5, 91.224, 1.33),
            new Element(41, 'Nb', 'Niobium', 5, 5, 92.906, 1.6),
            new Element(42, 'Mo', 'Molybdenum', 6, 5, 95.95, 2.16),
            new Element(43, 'Tc', 'Technetium', 7, 5, 97, 1.9),
            new Element(44, 'Ru', 'Ruthenium', 8, 5, 101.07, 2.2),
            new Element(45, 'Rh', 'Rhodium', 9, 5, 102.91, 2.28),
            new Element(46, 'Pd', 'Palladium', 10, 5, 106.42, 2.2),
            new Element(47, 'Ag', 'Silver', 11, 5, 107.87, 1.93),
            new Element(48, 'Cd', 'Cadmium', 12, 5, 112.41, 1.69),
            new Element(49, 'In', 'Indium', 13, 5, 114.82, 1.78),
            new Element(50, 'Sn', 'Tin', 14, 5, 118.71, 1.96),
            new Element(51, 'Sb', 'Antimony', 15, 5, 121.76, 2.05),
            new Element(52, 'Te', 'Tellurium', 16, 5, 127.6, 2.1),
            new Element(53, 'I', 'Iodine', 17, 5, 126.9, 2.66),
            new Element(54, 'Xe', 'Xenon', 18, 5, 131.29, 2.6),
            new Element(55, 'Cs', 'Caesium', 1, 6, 132.91, 0.79),
            new Element(56, 'Ba', 'Barium', 2, 6, 137.33, 0.89),
            new Element(57, 'La', 'Lanthanum', -1, 6, 138.91, 1.1),
            new Element(58, 'Ce', 'Cerium', -1, 6, 140.12, 1.12),
            new Element(59, 'Pr', 'Praseodymium', -1, 6, 140.91, 1.13),
            new Element(60, 'Nd', 'Neodymium', -1, 6, 144.24, 1.14),
            new Element(61, 'Pm', 'Promethium', -1, 6, 145, 1.13),
            new Element(62, 'Sm', 'Samarium', -1, 6, 150.36, 1.17),
            new Element(63, 'Eu', 'Europium', -1, 6, 151.96, 1.2),
            new Element(64, 'Gd', 'Gadolinium', -1, 6, 157.25, 1.2),
            new Element(65, 'Tb', 'Terbium', -1, 6, 158.93, 1.2),
            new Element(66, 'Dy', 'Dysprosium', -1, 6, 162.5, 1.22),
            new Element(67, 'Ho', 'Holmium', -1, 6, 164.93, 1.23),
            new Element(68, 'Er', 'Erbium', -1, 6, 167.26, 1.24),
            new Element(69, 'Tm', 'Thulium', -1, 6, 168.93, 1.25),
            new Element(70, 'Yb', 'Ytterbium', -1, 6, 173.05, 1.1),
            new Element(71, 'Lu', 'Lutetium', 3, 6, 174.97, 1.27),
            new Element(72, 'Hf', 'Hafnium', 4, 6, 178.49, 1.3),
            new Element(73, 'Ta', 'Tantalum', 5, 6, 180.95, 1.5),
            new Element(74, 'W', 'Tungsten', 6, 6, 183.84, 2.36),
            new Element(75, 'Re', 'Rhenium', 7, 6, 186.21, 1.9),
            new Element(76, 'Os', 'Osmium', 8, 6, 190.23, 2.2),
            new Element(77, 'Ir', 'Iridium', 9, 6, 192.22, 2.2),
            new Element(78, 'Pt', 'Platinum', 10, 6, 195.08, 2.28),
            new Element(79, 'Au', 'Gold', 11, 6, 196.97, 2.54),
            new Element(80, 'Hg', 'Mercury', 12, 6, 200.59, 2),
            new Element(81, 'Tl', 'Thallium', 13, 6, 204.38, 1.62),
            new Element(82, 'Pb', 'Lead', 14, 6, 207.2, 1.87),
            new Element(83, 'Bi', 'Bismuth', 15, 6, 208.98, 2.02),
            new Element(84, 'Po', 'Polonium', 16, 6, 209, 2),
            new Element(85, 'At', 'Astatine', 17, 6, 210, 2.2),
            new Element(86, 'Rn', 'Radon', 18, 6, 222, 2.2),
            new Element(87, 'Fr', 'Francium', 1, 7, 223, 0.79),
            new Element(88, 'Ra', 'Radium', 2, 7, 226, 0.9),
            new Element(89, 'Ac', 'Actinium', -1, 7, 227, 1.1),
            new Element(90, 'Th', 'Thorium', -1, 7, 232.04, 1.3),
            new Element(91, 'Pa', 'Protactinium', -1, 7, 231.04, 1.5),
            new Element(92, 'U', 'Uranium', -1, 7, 238.03, 1.38),
            new Element(93, 'Np', 'Neptunium', -1, 7, 237, 1.36),
            new Element(94, 'Pu', 'Plutonium', -1, 7, 244, 1.28),
            new Element(95, 'Am', 'Americium', -1, 7, 243, 1.13),
            new Element(96, 'Cm', 'Curium', -1, 7, 247, 1.28),
            new Element(97, 'Bk', 'Berkelium', -1, 7, 247, 1.3),
            new Element(98, 'Cf', 'Californium', -1, 7, 251, 1.3),
            new Element(99, 'Es', 'Einsteinium', -1, 7, 252, 1.3),
            new Element(100, 'Fm', 'Fermium', -1, 7, 257, 1.3),
            new Element(101, 'Md', 'Mendelevium', -1, 7, 258, 1.3),
            new Element(102, 'No', 'Nobelium', -1, 7, 259, 1.3),
            new Element(103, 'Lr', 'Lawrencium', 3, 7, 266, 1.3),
            new Element(104, 'Rf', 'Rutherfordium', 4, 7, 267, -1),
            new Element(105, 'Db', 'Dubnium', 5, 7, 268, -1),
            new Element(106, 'Sg', 'Seaborgium', 6, 7, 267, -1),
            new Element(107, 'Bh', 'Bohrium', 7, 7, 270, -1),
            new Element(108, 'Hs', 'Hassium', 8, 7, 271, -1),
            new Element(109, 'Mt', 'Meitnerium', 9, 7, 278, -1),
            new Element(110, 'Ds', 'Darmstadtium', 10, 7, 281, -1),
            new Element(111, 'Rg', 'Roentgenium', 11, 7, 282, -1),
            new Element(112, 'Cn', 'Copernicium', 12, 7, 285, -1),
            new Element(113, 'Nh', 'Nihonium', 13, 7, 286, -1),
            new Element(114, 'Fl', 'Flerovium', 14, 7, 289, -1),
            new Element(115, 'Mc', 'Moscovium', 15, 7, 290, -1),
            new Element(116, 'Lv', 'Livermorium', 16, 7, 293, -1),
            new Element(117, 'Ts', 'Tennessine', 17, 7, 294, -1),
            new Element(118, 'Og', 'Oganesson', 18, 7, 294, -1),
        ];
    }

    /**
     * @param {string} propertyName
     */
    getProperty(propertyName) {
        return this.Elements.map(element => element[propertyName]);
    }

    /**
     * @callback Condition
     * @param {Element} element
     * @param {number} index
     * @param {Element[]} array
     * @returns {boolean}
     */

    map(property1, property2) {
        return Object.fromEntries(this.Elements.map(element => [element[property1], element[property2]]));
    }

    /**
     * @param {Condition} condition
     * @returns {Element}
     */
    elWith(condition) {
        return this.Elements.find(condition);
    }

    /**
     * @param {Condition} condition
     * @returns {Element[]}
     */
    elsWith(condition) {
        return this.Elements.filter(condition);
    }
}

class Compound {
    /**
     * @param {string} name
     * @param {string} formula
     * @param {string[]} labels
     */
    constructor(name, formula, labels) {
        this.name = name;
        this.formula = formula;
        this.labels = labels;
    }
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function gcd(a, b) {
    while (b != 0) [a, b] = [b, a % b];
    return a;
}


export class Compounds {
    static generateCompounds() {
        const commonCompounds = [
            new Compound('water', 'H2O', ['common', 'covalent']),
            new Compound('hydrogen peroxide', 'H2O2', ['common', 'covalent']),
            new Compound('carbon monoxide', 'CO', ['common', 'covalent']),
            new Compound('carbon dioxide', 'CO2', ['common', 'covalent']),
            new Compound('oxygen', 'O2', ['common', 'covalent']),
            new Compound('ozone', 'O3', ['common', 'covalent']),
            new Compound('nitrogen', 'N2', ['common', 'covalent']),
            new Compound('ammonia', 'NH3', ['common', 'covalent']),
            new Compound('silicon dioxide', 'SiO2', ['common', 'covalent']),
            new Compound('aluminum oxide', 'Al2O3', ['common', 'covalent']),
            new Compound('benzene', 'C6H6', ['common', 'covalent'])
        ];

        const ionicCompounds = [
            new Compound('sodium chloride', 'NaCl', ['common', 'ionic']),
            new Compound('sodium bicarbonate', 'NaHCO3', ['common', 'ionic']),
            new Compound('calcium carbonate', 'CaCO3', ['common', 'ionic']),
            new Compound('magnesium sulfate', 'MgSO4', ['common', 'ionic']),
            new Compound('potassium iodide', 'KI', ['common', 'ionic']),
            new Compound('calcium chloride', 'CaCl2', ['common', 'ionic']),
            new Compound('sodium nitrate', 'NaNO3', ['common', 'ionic']),
            new Compound('potassium nitrate', 'KNO3', ['common', 'ionic']),
            new Compound('ammonium chloride', 'NH4Cl', ['common', 'ionic']),
            new Compound('sodium sulfate', 'Na2SO4', ['common', 'ionic']),
            new Compound('silver nitrate', 'AgNO3', ['common', 'ionic']),
            new Compound('zinc oxide', 'ZnO', ['common', 'ionic']),
            new Compound('hydrogen cyanide', 'HCN', ['common', 'ionic']),
            new Compound('sodium hypochlorite', 'NaClO', ['common', 'ionic']),
            new Compound('calcium sulfate', 'CaSO4', ['common', 'ionic'])
        ];
        const zip = (list1, list2) => list1.map((_, i) => [list1[i], list2[i]]);
        const periodic = new PeriodicTable();
        for (const cationSymbol of ['Li', 'Na', 'K', 'Rb', 'Cs', 'Mg', 'Ca', 'Sr', 'Ba']) {
            const cation = periodic.elWith(e => e.sym == cationSymbol);

            for (const anionPackage of zip(['F', 'Cl', 'Br', 'I'], ['fluoride', 'chloride', 'bromide', 'iodide'])) {
                const [anionSymbol, anionName] = anionPackage;

                const anion = periodic.elWith(e => e.sym == anionSymbol);

                const cationCount = anion.charge / gcd(cation.charge, anion.charge);
                const anionCount = -cation.charge / gcd(cation.charge, anion.charge);

                const formula = `${cation.sym}${cationCount == 1 ? '' : cationCount}${anion.sym}${anionCount == 1 ? '' : anionCount}`;
                if (ionicCompounds.findIndex(compound => compound.formula == formula))
                    ionicCompounds.push(new Compound(`${cation.name.toLowerCase()} ${anionName}`, formula, ['ionic']));
            }
        }

        const strongAcids = [
            new Compound('hydrochloric acid', 'HCl', ['common', 'strong acid', 'ionic']),
            new Compound('hydrobromic acid', 'HBr', ['common', 'strong acid', 'ionic']),
            new Compound('hydroiodic acid', 'HI', ['common', 'strong acid', 'ionic']),
            new Compound('perchloric acid', 'HClO4', ['common', 'strong acid', 'ionic']),
            new Compound('nitric acid', 'HNO3', ['common', 'strong acid', 'ionic']),
            new Compound('sulfuric acid', 'HSO4', ['common', 'strong acid', 'ionic'])
        ];

        const strongBases = [
            new Compound('lithium hydroxide', 'LiOH', ['common', 'strong base', 'ionic']),
            new Compound('sodium hydroxide', 'NaOH', ['common', 'strong base', 'ionic']),
            new Compound('potassium hydroxide', 'KOH', ['common', 'strong base', 'ionic']),
            new Compound('calcium hydroxide', 'Ca(OH)2', ['common', 'strong base', 'ionic']),
            new Compound('strontium hydroxide', 'Sr(OH)2', ['common', 'strong base', 'ionic']),
            new Compound('barium hydroxide', 'Ba(OH)2', ['common', 'strong base', 'ionic'])
        ];

        const alkanes = [
            new Compound('methane', 'CH4', ['alkane', 'covalent']),
            new Compound('ethane', 'C2H6', ['alkane', 'covalent']),
            new Compound('propane', 'C3H8', ['alkane', 'covalent']),
            new Compound('butane', 'C4H10', ['alkane', 'covalent']),
            new Compound('pentane', 'C5H12', ['alkane', 'covalent']),
            new Compound('hexane', 'C6H14', ['alkane', 'covalent']),
            new Compound('heptane', 'C7H16', ['alkane', 'covalent']),
            new Compound('octane', 'C8H18', ['alkane', 'covalent']),
            new Compound('nonane', 'C9H20', ['alkane', 'covalent']),
            new Compound('decane', 'C10H22', ['alkane', 'covalent'])
        ];

        return [...commonCompounds, ...ionicCompounds, ...strongAcids, ...strongBases, ...alkanes];
    }
}

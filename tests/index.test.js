const parse = require('../index');

describe("Correct return value", () => {
    test('Returns an object with the correct properties', () => {
        const result = parse('1 cup water');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('measurement');
        expect(result).toHaveProperty('additional');
        expect(result.measurement).toHaveProperty('quantity');
        expect(result.measurement).toHaveProperty('unit');
        expect(result.measurement).toHaveProperty('isRange');
    });
});

describe('Correctly extracts the ingredient measurement quantity', () => {
    test('Quantity is a whole number', () => {});
    test('Quantity is a fraction', () => {});
    test('Quantity is a range with whole numbers', () => {});
    test('Quantity is a range with fractions', () => {});
});

describe('Correctly extracts the ingredient measurement unit', () => {
    test('Unit is any variation of "teaspoon"', () => {});
    test('Unit is any variation of "tablespoon"', () => {});
    test('Unit is any variation of "cup"', () => {});
    test('Unit is any variation of "ounce"', () => {});
    test('Unit is any variation of "pound"', () => {});
    test('Unit is any variation of "milligram"', () => {});
    test('Unit is any variation of "gram"', () => {});
    test('Unit is any variation of "kilogram"', () => {});
    test('Unit is any variation of "pint"', () => {});
    test('Unit is any variation of "quart"', () => {});
    test('Unit is any variation of "gallon"', () => {});
    test('Unit is any variation of "milliliters"', () => {});
    test('Unit is any variation of "liters"', () => {});
    test('Unit is any variation of "pinch"', () => {});
    test('Unit is any variation of "piece"', () => {});
    test('Unit is any variation of "slice"', () => {});
    test('Unit is any variation of "stick"', () => {});
    test('Unit is any variation of "clove"', () => {});
    test('Unit is any variation of "can"', () => {});
    test('Unit is any variation of "bag"', () => {});
    test('Unit is any variation of "box"', () => {});
    test('Unit is any variation of "package"', () => {});
    test('Unit is any variation of "small"', () => {});
    test('Unit is any variation of "medium"', () => {});
    test('Unit is any variation of "large"', () => {});
});

describe('Correctly extracts the ingredient name', () => {
    test('Simple ingredient name', () => {});
    test('Ingredient name using preposition "of"', () => {});
});
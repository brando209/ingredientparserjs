const { parse } = require('../index');

test('Returns an object with the correct properties', () => {
    const result = parse('1 cup water');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('measurement');
    expect(result).toHaveProperty('additional');
    expect(result).toHaveProperty('measurement.quantity');
    expect(result).toHaveProperty('measurement.unit');
    expect(result).toHaveProperty('measurement.isRange');
});

describe('Correctly extracts the ingredient measurement quantity', () => {
    test('Quantity is a whole number', () => {
        expect(parse('1 cup of water')).toHaveProperty('measurement.quantity', 1);
        expect(parse('2 liters of water')).toHaveProperty('measurement.quantity', 2);
        expect(parse('10 pints water')).toHaveProperty('measurement.quantity', 10);
        expect(parse('100 grams of water')).toHaveProperty('measurement.quantity', 100);
    });
    test('Quantity is a fraction', () => {
        expect(parse('1/2 cup of water')).toHaveProperty('measurement.quantity', 0.5);
        expect(parse('1/3 cup of water')).toHaveProperty('measurement.quantity', 0.333);
        expect(parse('2/3 cup of water')).toHaveProperty('measurement.quantity', 0.667);
        expect(parse('1/4 oz. cheese')).toHaveProperty('measurement.quantity', 0.25);
        expect(parse('1/8 tsp salt')).toHaveProperty('measurement.quantity', 0.125);
    });
    test('Quantity is a whole number and fraction', () => {
        //TODO: Add support for '&' and 'and' when giving fraction > 1. (Ex: '1 & 1/2 cups water')
        expect(parse('1 1/2 cup of water')).toHaveProperty('measurement.quantity', 1.5);
        expect(parse('1 1/3 cup of water')).toHaveProperty('measurement.quantity', 1.333);
        expect(parse('2 2/3 cup of water')).toHaveProperty('measurement.quantity', 2.667);
        expect(parse('3 1/4 oz. cheese')).toHaveProperty('measurement.quantity', 3.25);
        expect(parse('3 1/8 tsp salt')).toHaveProperty('measurement.quantity', 3.125);
    });
    //TODO: Add support for measurement quantity as a decimal
    // test('Quantity is a decimal', () => {
    //     expect(parse('1.5 cup of water')).toHaveProperty('measurement.quantity', 1.5);
    //     expect(parse('1.3 cup of water')).toHaveProperty('measurement.quantity', 1.3);
    //     expect(parse('2.6 cup of water')).toHaveProperty('measurement.quantity', 2.6);
    //     expect(parse('3.25 oz. cheese')).toHaveProperty('measurement.quantity', 3.25);
    //     expect(parse('3.125 tsp salt')).toHaveProperty('measurement.quantity', 3.125);
    // });
    test('Quantity is a range with whole numbers', () => {
        expect(parse('1-2 cups of water')).toHaveProperty('measurement.quantity', [1, 2]);
        expect(parse('1 to 2 cups of water')).toHaveProperty('measurement.quantity', [1, 2]);
        expect(parse('2 - 3 cups of water')).toHaveProperty('measurement.quantity', [2, 3]);
        expect(parse('3-4 oz. cheese')).toHaveProperty('measurement.quantity', [3, 4]);
        expect(parse('9-10 tsp salt')).toHaveProperty('measurement.quantity', [9, 10]);
    });
    test('Quantity is a range with fractions', () => {
        expect(parse('1/2 - 2/3 cup of water')).toHaveProperty('measurement.quantity', [0.5, 0.667]);
        expect(parse('1/3 to 1/2 cup of water')).toHaveProperty('measurement.quantity', [0.333, 0.5]);
        expect(parse('2/3-3/4 cups of water')).toHaveProperty('measurement.quantity', [0.667, 0.75]);
        expect(parse('1/8-1/4 oz. cheese')).toHaveProperty('measurement.quantity', [0.125, 0.25]);
        expect(parse('1/8-2/3 tsp salt')).toHaveProperty('measurement.quantity', [0.125, 0.667]);
    });
    //TODO: decimals
    // test('Quantity is a range with decimals', () => {});
    test('Quantity is a range with any of whole numbers, fractions, or decimals', () => {
        expect(parse('1/2 - 1 cup of water')).toHaveProperty('measurement.quantity', [0.5, 1]);
        expect(parse('1 1/3 to 1 1/2 cup of water')).toHaveProperty('measurement.quantity', [1.333, 1.5]);
        expect(parse('2 2/3-2 3/4 cups of water')).toHaveProperty('measurement.quantity', [2.667, 2.75]);
        expect(parse('1 1/8 - 1 1/4 oz. cheese')).toHaveProperty('measurement.quantity', [1.125, 1.25]);
        expect(parse('2 1/8- 3 2/3 tsp salt')).toHaveProperty('measurement.quantity', [2.125, 3.667]);
    });
});

describe('Correctly extracts the ingredient measurement unit', () => {
    test('Unit is any variation of "teaspoon"', () => {
        expect(parse('1 teaspoon water')).toHaveProperty('measurement.unit', 'teaspoon');
        expect(parse('1 tsp water')).toHaveProperty('measurement.unit', 'teaspoon');
        expect(parse('1 tsp. water')).toHaveProperty('measurement.unit', 'teaspoon');
        expect(parse('1 tspn water')).toHaveProperty('measurement.unit', 'teaspoon');
        expect(parse('1 tspn. water')).toHaveProperty('measurement.unit', 'teaspoon');
        expect(parse('2 teaspoons water')).toHaveProperty('measurement.unit', 'teaspoon');
        expect(parse('2 tspns water')).toHaveProperty('measurement.unit', 'teaspoon');
        expect(parse('2 tspns. water')).toHaveProperty('measurement.unit', 'teaspoon');

    });
    test('Unit is any variation of "tablespoon"', () => {
        expect(parse('1 tablespoon water')).toHaveProperty('measurement.unit', 'tablespoon');
        expect(parse('1 tbs water')).toHaveProperty('measurement.unit', 'tablespoon');
        expect(parse('1 tbs. water')).toHaveProperty('measurement.unit', 'tablespoon');
        expect(parse('1 tbsp water')).toHaveProperty('measurement.unit', 'tablespoon');
        expect(parse('1 tbsp. water')).toHaveProperty('measurement.unit', 'tablespoon');
        expect(parse('2 tbspn water')).toHaveProperty('measurement.unit', 'tablespoon');
        expect(parse('2 tbspn. water')).toHaveProperty('measurement.unit', 'tablespoon');
        expect(parse('2 tablespoons water')).toHaveProperty('measurement.unit', 'tablespoon');
        expect(parse('2 tbspns water')).toHaveProperty('measurement.unit', 'tablespoon');
        expect(parse('2 tbspns. water')).toHaveProperty('measurement.unit', 'tablespoon');
    });
    test('Unit is any variation of "cup"', () => {
        expect(parse('1 cup water')).toHaveProperty('measurement.unit', 'cup');
        expect(parse('1 c water')).toHaveProperty('measurement.unit', 'cup');
        expect(parse('1 c. water')).toHaveProperty('measurement.unit', 'cup');
        expect(parse('1 C water')).toHaveProperty('measurement.unit', 'cup');
        expect(parse('1 C. water')).toHaveProperty('measurement.unit', 'cup');
        expect(parse('2 cups water')).toHaveProperty('measurement.unit', 'cup');
    });
    test('Unit is any variation of "ounce"', () => {
        expect(parse('1 ounce cheese')).toHaveProperty('measurement.unit', 'ounce');
        expect(parse('1 oz cheese')).toHaveProperty('measurement.unit', 'ounce');
        expect(parse('1 oz. cheese')).toHaveProperty('measurement.unit', 'ounce');
        expect(parse('2 ounces cheese')).toHaveProperty('measurement.unit', 'ounce');

    });
    test('Unit is any variation of "pound"', () => {
        expect(parse('1 pound cheese')).toHaveProperty('measurement.unit', 'pound');
        expect(parse('1 lb cheese')).toHaveProperty('measurement.unit', 'pound');
        expect(parse('1 lb. cheese')).toHaveProperty('measurement.unit', 'pound');
        expect(parse('2 pounds cheese')).toHaveProperty('measurement.unit', 'pound');
        expect(parse('2 lbs cheese')).toHaveProperty('measurement.unit', 'pound');
        expect(parse('2 lbs. cheese')).toHaveProperty('measurement.unit', 'pound');

    });
    test('Unit is any variation of "milligram"', () => {
        expect(parse('1 milligram salt')).toHaveProperty('measurement.unit', 'milligram');
        expect(parse('1 mg salt')).toHaveProperty('measurement.unit', 'milligram');
        expect(parse('1 mg. salt')).toHaveProperty('measurement.unit', 'milligram');
        expect(parse('2 milligrams salt')).toHaveProperty('measurement.unit', 'milligram');

    });
    test('Unit is any variation of "gram"', () => {
        expect(parse('1 gram salt')).toHaveProperty('measurement.unit', 'gram');
        expect(parse('1 g salt')).toHaveProperty('measurement.unit', 'gram');
        expect(parse('1 g. salt')).toHaveProperty('measurement.unit', 'gram');
        expect(parse('2 grams salt')).toHaveProperty('measurement.unit', 'gram');
    });
    test('Unit is any variation of "kilogram"', () => {
        expect(parse('1 kilogram salt')).toHaveProperty('measurement.unit', 'kilogram');
        expect(parse('1 kg salt')).toHaveProperty('measurement.unit', 'kilogram');
        expect(parse('1 kg. salt')).toHaveProperty('measurement.unit', 'kilogram');
        expect(parse('2 kilogram salt')).toHaveProperty('measurement.unit', 'kilogram');
    });
    test('Unit is any variation of "pint"', () => {
        expect(parse('1 pint water')).toHaveProperty('measurement.unit', 'pint');
        expect(parse('1 pt water')).toHaveProperty('measurement.unit', 'pint');
        expect(parse('1 pt. water')).toHaveProperty('measurement.unit', 'pint');
        expect(parse('2 pints water')).toHaveProperty('measurement.unit', 'pint');       
        expect(parse('2 pts water')).toHaveProperty('measurement.unit', 'pint');       
        expect(parse('2 pts. water')).toHaveProperty('measurement.unit', 'pint');       
    });
    test('Unit is any variation of "quart"', () => {
        expect(parse('1 quart water')).toHaveProperty('measurement.unit', 'quart');
        expect(parse('1 qt water')).toHaveProperty('measurement.unit', 'quart');
        expect(parse('1 qt. water')).toHaveProperty('measurement.unit', 'quart');
        expect(parse('2 quarts water')).toHaveProperty('measurement.unit', 'quart');       
        expect(parse('2 qts water')).toHaveProperty('measurement.unit', 'quart');       
        expect(parse('2 qts. water')).toHaveProperty('measurement.unit', 'quart'); 
    });
    test('Unit is any variation of "gallon"', () => {
        expect(parse('1 gallon water')).toHaveProperty('measurement.unit', 'gallon');
        expect(parse('1 gal water')).toHaveProperty('measurement.unit', 'gallon');
        expect(parse('1 gal. water')).toHaveProperty('measurement.unit', 'gallon');
        expect(parse('2 gallons water')).toHaveProperty('measurement.unit', 'gallon');       
        expect(parse('2 gals water')).toHaveProperty('measurement.unit', 'gallon');       
        expect(parse('2 gals. water')).toHaveProperty('measurement.unit', 'gallon'); 
    });
    test('Unit is any variation of "milliliter"', () => {
        expect(parse('1 milliliter water')).toHaveProperty('measurement.unit', 'milliliter');
        expect(parse('1 ml water')).toHaveProperty('measurement.unit', 'milliliter');
        expect(parse('1 ml. water')).toHaveProperty('measurement.unit', 'milliliter');
        expect(parse('1 mL water')).toHaveProperty('measurement.unit', 'milliliter');
        expect(parse('1 mL. water')).toHaveProperty('measurement.unit', 'milliliter');
        expect(parse('2 milliliters water')).toHaveProperty('measurement.unit', 'milliliter');       
    });
    test('Unit is any variation of "liter"', () => {
        expect(parse('1 liter water')).toHaveProperty('measurement.unit', 'liter');
        expect(parse('1 l water')).toHaveProperty('measurement.unit', 'liter');
        expect(parse('1 l. water')).toHaveProperty('measurement.unit', 'liter');
        expect(parse('1 L water')).toHaveProperty('measurement.unit', 'liter');
        expect(parse('1 L. water')).toHaveProperty('measurement.unit', 'liter');
        expect(parse('2 liters water')).toHaveProperty('measurement.unit', 'liter');
    });
    test('Unit is any variation of "pinch"', () => {
        expect(parse('1 pinch salt')).toHaveProperty('measurement.unit', 'pinch');
        expect(parse('2 pinches salt')).toHaveProperty('measurement.unit', 'pinch');

    });
    test('Unit is any variation of "piece"', () => {
        expect(parse('1 piece chocolate')).toHaveProperty('measurement.unit', 'piece');
        expect(parse('2 pieces chocolate')).toHaveProperty('measurement.unit', 'piece');
    });
    test('Unit is any variation of "slice"', () => {
        expect(parse('1 slice cheese')).toHaveProperty('measurement.unit', 'slice');
        expect(parse('2 slices cheese')).toHaveProperty('measurement.unit', 'slice');

    });
    test('Unit is any variation of "stick"', () => {
        expect(parse('1 stick butter')).toHaveProperty('measurement.unit', 'stick');
        expect(parse('2 sticks butter')).toHaveProperty('measurement.unit', 'stick');
        
    });
    test('Unit is any variation of "clove"', () => {
        expect(parse('1 clove garlic')).toHaveProperty('measurement.unit', 'clove');
        expect(parse('2 cloves garlic')).toHaveProperty('measurement.unit', 'clove');
    });
    test('Unit is any variation of "can"', () => {
        expect(parse('1 can fruit')).toHaveProperty('measurement.unit', 'can');
        expect(parse('1 can (8 oz.) fruit')).toHaveProperty('measurement.unit', 'can');
        expect(parse('2 cans fruit')).toHaveProperty('measurement.unit', 'can');
        expect(parse('2 cans (8 oz.) fruit')).toHaveProperty('measurement.unit', 'can');
    });
    test('Unit is any variation of "bag"', () => {
        expect(parse('1 bag potato chips')).toHaveProperty('measurement.unit', 'bag');
        expect(parse('1 bag (10oz.) potato chips')).toHaveProperty('measurement.unit', 'bag');
        expect(parse('2 bags potato chips')).toHaveProperty('measurement.unit', 'bag');
        expect(parse('2 bags (10oz.) potato chips')).toHaveProperty('measurement.unit', 'bag');
    });
    test('Unit is any variation of "box"', () => {
        expect(parse('1 box cake mix')).toHaveProperty('measurement.unit', 'box');
        expect(parse('2 boxes cake mix')).toHaveProperty('measurement.unit', 'box');
    });
    test('Unit is any variation of "package"', () => {
        expect(parse('1 package dried fruit')).toHaveProperty('measurement.unit', 'package');
        expect(parse('1 pkg dried fruit')).toHaveProperty('measurement.unit', 'package');
        expect(parse('1 pkg. dried fruit')).toHaveProperty('measurement.unit', 'package');
        expect(parse('2 packages dried fruit')).toHaveProperty('measurement.unit', 'package');
        expect(parse('2 pkgs dried fruit')).toHaveProperty('measurement.unit', 'package');
        expect(parse('2 pkgs. dried fruit')).toHaveProperty('measurement.unit', 'package');
    });
    test('Unit is any variation of "small"', () => {
        expect(parse('1 small egg')).toHaveProperty('measurement.unit', 'small');
        expect(parse('1 sm egg')).toHaveProperty('measurement.unit', 'small');
        expect(parse('1 sm egg')).toHaveProperty('measurement.unit', 'small');
    });
    test('Unit is any variation of "medium"', () => {
        expect(parse('1 medium egg')).toHaveProperty('measurement.unit', 'medium');
        expect(parse('1 med egg')).toHaveProperty('measurement.unit', 'medium');
        expect(parse('1 med egg')).toHaveProperty('measurement.unit', 'medium');
    });
    test('Unit is any variation of "large"', () => {
        expect(parse('1 large egg')).toHaveProperty('measurement.unit', 'large');
        expect(parse('1 lg egg')).toHaveProperty('measurement.unit', 'large');
        expect(parse('1 lg. egg')).toHaveProperty('measurement.unit', 'large');
    });
});

describe('Correctly extracts the ingredient name', () => {
    test('Simple ingredient names', () => {
        expect(parse('1 cup water')).toHaveProperty('name', 'water');
        expect(parse('1 cup fried rice')).toHaveProperty('name', 'fried rice');
        expect(parse('2 large eggs')).toHaveProperty('name', 'eggs');
    });
    test('Ingredient names using preposition "of"', () => {
        expect(parse('1 cup of water')).toHaveProperty('name', 'water');
        expect(parse('1 cup of fried rice')).toHaveProperty('name', 'fried rice');
        expect(parse('1 ounce of shrimp')).toHaveProperty('name', 'shrimp');
    });
    //TODO: More tests with ingredient names
});
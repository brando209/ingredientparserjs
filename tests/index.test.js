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

describe('Correctly extracts the ingredient measurements', () => {
    describe('Quantity', () => {
        test('Quantity is a whole number', () => {
            expect(parse('1 tomato')).toHaveProperty('measurement.quantity', 1);
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
            expect(parse('1 1/2 cup of water')).toHaveProperty('measurement.quantity', 1.5);
            expect(parse('1 1/3 cup of water')).toHaveProperty('measurement.quantity', 1.333);
            expect(parse('2 2/3 cup of water')).toHaveProperty('measurement.quantity', 2.667);
            expect(parse('3 1/4 oz. cheese')).toHaveProperty('measurement.quantity', 3.25);
            expect(parse('3 1/8 tsp salt')).toHaveProperty('measurement.quantity', 3.125);
            expect(parse('1 and 1/2 cup of water')).toHaveProperty('measurement.quantity', 1.5);
            expect(parse('1 & 1/2 cup of water')).toHaveProperty('measurement.quantity', 1.5);
            expect(parse('9and3/4 lb. of sugar')).toHaveProperty('measurement.quantity', 9.75);
            expect(parse('9&3/4 lb. of sugar')).toHaveProperty('measurement.quantity', 9.75);
        });
        test('Quantity is a decimal', () => {
            expect(parse('1.5 cup of water')).toHaveProperty('measurement.quantity', 1.5);
            expect(parse('1.3 cup of water')).toHaveProperty('measurement.quantity', 1.3);
            expect(parse('2.6 cup of water')).toHaveProperty('measurement.quantity', 2.6);
            expect(parse('3.25 oz. cheese')).toHaveProperty('measurement.quantity', 3.25);
            expect(parse('3.125 tsp salt')).toHaveProperty('measurement.quantity', 3.125);
        });
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
        test('Quantity is a range with decimals', () => {
            expect(parse('1.5 - 2.5 cup of water')).toHaveProperty('measurement.quantity', [1.5, 2.5]);
            expect(parse('1.3 - 1.5 cup of water')).toHaveProperty('measurement.quantity', [1.3, 1.5]);
            expect(parse('2.6 - 3.0 cup of water')).toHaveProperty('measurement.quantity', [2.6, 3]);
            expect(parse('3.25-3.75 oz. cheese')).toHaveProperty('measurement.quantity', [3.25, 3.75]);
            expect(parse('3.125-3.25 tsp salt')).toHaveProperty('measurement.quantity', [3.125, 3.25]);
        });
        test('Quantity is a range with any of whole numbers, fractions, or decimals', () => {
            expect(parse('0.5 - 1 cup of water')).toHaveProperty('measurement.quantity', [0.5, 1]);
            expect(parse('1/2 - 1 cup of water')).toHaveProperty('measurement.quantity', [0.5, 1]);
            expect(parse('1 1/3 to 1 1/2 cup of water')).toHaveProperty('measurement.quantity', [1.333, 1.5]);
            expect(parse('2 2/3-2 3/4 cups of water')).toHaveProperty('measurement.quantity', [2.667, 2.75]);
            expect(parse('1 1/8 - 1 1/4 oz. cheese')).toHaveProperty('measurement.quantity', [1.125, 1.25]);
            expect(parse('2 1/8- 3 2/3 tsp salt')).toHaveProperty('measurement.quantity', [2.125, 3.667]);

            expect(parse('2&1/8-3&2/3 tsp salt')).toHaveProperty('measurement.quantity', [2.125, 3.667]);
            expect(parse('2 & 1/8 - 3 & 2/3 tsp salt')).toHaveProperty('measurement.quantity', [2.125, 3.667]);
            expect(parse('2 and 1/8-3 and 2/3 tsp salt')).toHaveProperty('measurement.quantity', [2.125, 3.667]);
            expect(parse('2and1/8-3and2/3 tsp salt')).toHaveProperty('measurement.quantity', [2.125, 3.667]);
        });
        //TODO: Quantities with mixed unit ranges or units on high and low end of range
        // EX: '1 cup - 2 cups of water' or '14 grams - 1 oz of flour'
        
        test('Quantity is a unicode fraction', () => {
            expect(parse('½ cup cheese')).toHaveProperty('measurement.quantity', 0.5);
            expect(parse('⅓ cup cheese')).toHaveProperty('measurement.quantity', 0.333);
            expect(parse('⅔ cup cheese')).toHaveProperty('measurement.quantity', 0.667);
            expect(parse('¼ cup cheese')).toHaveProperty('measurement.quantity', 0.25);
            expect(parse('¾ cup cheese')).toHaveProperty('measurement.quantity', 0.75);
            expect(parse('⅕ cup cheese')).toHaveProperty('measurement.quantity', 0.2);
            expect(parse('⅖ cup cheese')).toHaveProperty('measurement.quantity', 0.4);
            expect(parse('⅗ cup cheese')).toHaveProperty('measurement.quantity', 0.6);
            expect(parse('⅘ cup cheese')).toHaveProperty('measurement.quantity', 0.8);
            expect(parse('⅙ cup cheese')).toHaveProperty('measurement.quantity', 0.167);
            expect(parse('⅚ cup cheese')).toHaveProperty('measurement.quantity', 0.833);
            expect(parse('⅐ cup cheese')).toHaveProperty('measurement.quantity', 0.143);
            expect(parse('⅛ cup cheese')).toHaveProperty('measurement.quantity', 0.125);
            expect(parse('⅜ cup cheese')).toHaveProperty('measurement.quantity', 0.375);
            expect(parse('⅝ cup cheese')).toHaveProperty('measurement.quantity', 0.625);
            expect(parse('⅞ cup cheese')).toHaveProperty('measurement.quantity', 0.875);
            expect(parse('⅑ cup cheese')).toHaveProperty('measurement.quantity', 0.111);
            expect(parse('⅒ cup cheese')).toHaveProperty('measurement.quantity', 0.1);
        });
    });

    describe('Unit', () => {
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
        test('Unit is any variation of "fluid ounce"', () => {
            expect(parse('1 fluid ounce of orange juice')).toHaveProperty('measurement.unit', 'fluid ounce');
            expect(parse('1 fl. ounce of orange juice')).toHaveProperty('measurement.unit', 'fluid ounce');
            expect(parse('1 fl ounce of orange juice')).toHaveProperty('measurement.unit', 'fluid ounce');
            expect(parse('1 fl oz of orange juice')).toHaveProperty('measurement.unit', 'fluid ounce');
            expect(parse('1 fl. oz of orange juice')).toHaveProperty('measurement.unit', 'fluid ounce');
            expect(parse('1 fl. oz. of orange juice')).toHaveProperty('measurement.unit', 'fluid ounce');
        });
        test('Unit is any variation of "head"', () => {
            expect(parse('1 head of lettuce')).toHaveProperty('measurement.unit', 'head');
            expect(parse('2 heads of lettuce')).toHaveProperty('measurement.unit', 'head');
        });
        test('Unit is any ariation of "crown"', () => {
            expect(parse('1 crown of broccoli')).toHaveProperty('measurement.unit', 'crown');
            expect(parse('2 crowns of broccoli')).toHaveProperty('measurement.unit', 'crown');
        })
        test('Unit is any variation of "centimeter"', () => {
            expect(parse('1 centimeter of ginger root')).toHaveProperty('measurement.unit', 'centimeter');
            expect(parse('1 cm of ginger root')).toHaveProperty('measurement.unit', 'centimeter');
            expect(parse('1 cm. of ginger root')).toHaveProperty('measurement.unit', 'centimeter');
            expect(parse('2 centimeters of ginger root')).toHaveProperty('measurement.unit', 'centimeter');
            expect(parse('2 cm. of ginger root')).toHaveProperty('measurement.unit', 'centimeter');
        });
        test('Unit is any variation of "inch"', () => {
            expect(parse('1 inch of ginger root')).toHaveProperty('measurement.unit', 'inch');
            expect(parse('1 in of ginger root')).toHaveProperty('measurement.unit', 'inch');
            expect(parse('1 in. of ginger root')).toHaveProperty('measurement.unit', 'inch');
            expect(parse('2 inches of ginger root')).toHaveProperty('measurement.unit', 'inch');
        })
        test('Unit is any variation of "foot"', () => {
            expect(parse('1 foot of licorice rope')).toHaveProperty('measurement.unit', 'foot');
            expect(parse('1 ft of licorice rope')).toHaveProperty('measurement.unit', 'foot');
            expect(parse('1 ft. of licorice rope')).toHaveProperty('measurement.unit', 'foot');
            expect(parse('1.5 feet of licorice rope')).toHaveProperty('measurement.unit', 'foot');
        });
        test('Unit is any variation of "head"', () => {
            expect(parse('1 head of lettuce')).toHaveProperty('measurement.unit', 'head');
            expect(parse('2 heads of lettuce')).toHaveProperty('measurement.unit', 'head');
        });
        test('Unit is any variation of "ear"', () => {
            expect(parse('1 ear of corn')).toHaveProperty('measurement.unit', 'ear');
            expect(parse('4 ears of corn')).toHaveProperty('measurement.unit', 'ear');
        });
        test('Unit is any variaton of "drop"', () => {
            expect(parse('1 drop of stevia extract')).toHaveProperty('measurement.unit', 'drop');
            expect(parse('4-5 drops of stevia extract')).toHaveProperty('measurement.unit', 'drop');
        });
        test('Unit is any variation of "dash"', () => {
            expect(parse('A dash of salt')).toHaveProperty('measurement.unit', 'dash');
            expect(parse('2 dashes of salt')).toHaveProperty('measurement.unit', 'dash');
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
        test('Unit is any variation of "sprig"', () => {
            expect(parse('1 sprig of rosemary')).toHaveProperty('measurement.unit', 'sprig');
            expect(parse('2 sprigs of rosemary')).toHaveProperty('measurement.unit', 'sprig');
        });
        test('Unit is any variation of "clove"', () => {
            expect(parse('1 clove garlic')).toHaveProperty('measurement.unit', 'clove');
            expect(parse('1 garlic clove')).toHaveProperty('measurement.unit', 'clove');
            expect(parse('2 cloves garlic')).toHaveProperty('measurement.unit', 'clove');
        });
        test('Unit is any variation of "can"', () => {
            expect(parse('1 can fruit')).toHaveProperty('measurement.unit', 'can');
            expect(parse('1 can (8 oz.) fruit')).toHaveProperty('measurement.unit', 'can');
            expect(parse('2 cans fruit')).toHaveProperty('measurement.unit', 'can');
            expect(parse('2 cans (8 oz.) fruit')).toHaveProperty('measurement.unit', 'can');
        });
        test('Unit is any variation of "carton"', () => {
            expect(parse('1 carton (28oz) of milk')).toHaveProperty('measurement.unit', 'carton');
            expect(parse('2 cartons (28oz) of milk')).toHaveProperty('measurement.unit', 'carton');
        });
        test('Unit is any variation of "container"', () => {
            expect(parse('1 container (2oz) of sprouts')).toHaveProperty('measurement.unit', 'container');
            expect(parse('2 containers (2oz) of sprouts')).toHaveProperty('measurement.unit', 'container');
        });
        test('Unit is any variation of "bag"', () => {
            expect(parse('1 bag potato chips')).toHaveProperty('measurement.unit', 'bag');
            expect(parse('1 bag (10oz.) potato chips')).toHaveProperty('measurement.unit', 'bag');
            expect(parse('1 10oz. bag potato chips')).toHaveProperty('measurement.unit', 'bag');
            expect(parse('2 bags potato chips')).toHaveProperty('measurement.unit', 'bag');
            expect(parse('2 bags (10oz.) potato chips')).toHaveProperty('measurement.unit', 'bag');
        });
        test('Unit is any variation of "box"', () => {
            expect(parse('1 box cake mix')).toHaveProperty('measurement.unit', 'box');
            expect(parse('2 boxes cake mix')).toHaveProperty('measurement.unit', 'box');
        });
        test('Unit is any variation of "bunch"', () => {
            expect(parse('1 bunch of cilantro')).toHaveProperty('measurement.unit', 'bunch');
            expect(parse('2 bunches of cilantro')).toHaveProperty('measurement.unit', 'bunch');
        });
        test('Unit is any variation of "pack"', () => {
            expect(parse('1 pack of dried fruit')).toHaveProperty('measurement.unit', 'pack');
            expect(parse('2 packs of dried fruit')).toHaveProperty('measurement.unit', 'pack');
        })
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
            expect(parse('1 sm. egg')).toHaveProperty('measurement.unit', 'small');
        });
        test('Unit is any variation of "medium"', () => {
            expect(parse('1 medium egg')).toHaveProperty('measurement.unit', 'medium');
            expect(parse('1 med egg')).toHaveProperty('measurement.unit', 'medium');
            expect(parse('1 med. egg')).toHaveProperty('measurement.unit', 'medium');
        });
        test('Unit is any variation of "large"', () => {
            expect(parse('1 large egg')).toHaveProperty('measurement.unit', 'large');
            expect(parse('1 lg egg')).toHaveProperty('measurement.unit', 'large');
            expect(parse('1 lg. egg')).toHaveProperty('measurement.unit', 'large');
        });
    });

    describe('Conversion',  () => {
        test('Converted measurement is whole number', () => {
            expect(parse('1 cup (4 tbsp.) honey').convertedMeasurement).toEqual({ quantity: 4, unit: 'tablespoon', isRange: false });
            expect(parse('1 cup(4 tbsp.) honey').convertedMeasurement).toEqual({ quantity: 4, unit: 'tablespoon', isRange: false });
            expect(parse('1 ounce / 28 g. chicken thigh').convertedMeasurement).toEqual({ quantity: 28, unit: 'gram', isRange: false });
            expect(parse('1 ounce /28 g. chicken thigh').convertedMeasurement).toEqual({ quantity: 28, unit: 'gram', isRange: false });
            expect(parse('1 ounce/ 28 g. chicken thigh').convertedMeasurement).toEqual({ quantity: 28, unit: 'gram', isRange: false });
            expect(parse('1 ounce/28 g. chicken thigh').convertedMeasurement).toEqual({ quantity: 28, unit: 'gram', isRange: false });
        });
        test('Converted measurement is fraction', () => {
            expect(parse('14 g. (1/2 oz.) chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
            expect(parse('14 g.(1/2 oz.) chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
            expect(parse('14 g. / 1/2 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
            expect(parse('14 g. /1/2 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
            expect(parse('14 g./ 1/2 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
            expect(parse('14 g./1/2 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
        });
        test('Converted measurement is decimal', () => {
            expect(parse('14 g. (0.5 oz.) chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
            expect(parse('14 g.(0.5 oz.) chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
            expect(parse('14 g. / 0.5 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
            expect(parse('14 g. /0.5 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
            expect(parse('14 g./ 0.5 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
            expect(parse('14 g./0.5 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 0.5, unit: 'ounce', isRange: false });
        });
        test('Converted measurement is whole number and fraction', () => {
            expect(parse('35 g. (1 1/4 oz.) chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g. (1 & 1/4 oz.) chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g. (1 and 1/4 oz.) chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g.(1 1/4 oz.) chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g.(1 & 1/4 oz.) chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g.(1 and 1/4 oz.) chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g. / 1 1/4 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g. / 1 & 1/4 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g. / 1 and 1/4 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g. /1 & 1/4 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g. /1 and 1/4 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g./ 1 1/4 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g./ 1 & 1/4 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g./ 1 and 1/4 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g./1 1/4 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g./1 & 1/4 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
            expect(parse('35 g./1 and 1/4 oz. chicken thigh').convertedMeasurement).toEqual({ quantity: 1.25, unit: 'ounce', isRange: false });
        });
        test('Converted measurement is a package size', () => {
            expect(parse('1 can (8 oz) of tomato paste').convertedMeasurement).toEqual({ quantity: 8, unit: 'ounce', isRange: false });
            expect(parse('1 (8 oz) can of tomato paste').convertedMeasurement).toEqual({ quantity: 8, unit: 'ounce', isRange: false });
            expect(parse('1 box (1 lb) of elbow pasta').convertedMeasurement).toEqual({ quantity: 1, unit: 'pound', isRange: false });
            expect(parse('1 (1 lb) box of elbow pasta').convertedMeasurement).toEqual({ quantity: 1, unit: 'pound', isRange: false });
            expect(parse('1 bag (1 lb) of spaghetti pasta').convertedMeasurement).toEqual({ quantity: 1, unit: 'pound', isRange: false });
            expect(parse('1 (1 lb) bag of spaghetti pasta').convertedMeasurement).toEqual({ quantity: 1, unit: 'pound', isRange: false });
            expect(parse('1 package (120g) of yeast').convertedMeasurement).toEqual({ quantity: 120, unit: 'gram', isRange: false });
            expect(parse('1 (120g) package of yeast').convertedMeasurement).toEqual({ quantity: 120, unit: 'gram', isRange: false });
        })
    });

    describe('Measurement plus other measurements', () => {
        test('Two measurements', () => {
            expect(parse('1 tbsp plus 1 tsp of water').hasAddedMeasurements).toBe(true);
            expect(parse('1 tbsp plus 1 tsp of water').measurement[0]).toEqual({ quantity: 1, unit: 'tablespoon', isRange: false });
            expect(parse('1 tbsp plus 1 tsp of water').measurement[1]).toEqual({ quantity: 1, unit: 'teaspoon', isRange: false });

            expect(parse('1 tbsp + 1 tsp of water').hasAddedMeasurements).toBe(true);
            expect(parse('1 tbsp + 1 tsp of water').measurement[0]).toEqual({ quantity: 1, unit: 'tablespoon', isRange: false });
            expect(parse('1 tbsp + 1 tsp of water').measurement[1]).toEqual({ quantity: 1, unit: 'teaspoon', isRange: false });

            expect(parse('1 tbsp and 1 tsp of water').hasAddedMeasurements).toBe(true);
            expect(parse('1 tbsp and 1 tsp of water').measurement[0]).toEqual({ quantity: 1, unit: 'tablespoon', isRange: false });
            expect(parse('1 tbsp and 1 tsp of water').measurement[1]).toEqual({ quantity: 1, unit: 'teaspoon', isRange: false });

            expect(parse('1 tbsp & 1 tsp of water').hasAddedMeasurements).toBe(true);
            expect(parse('1 tbsp & 1 tsp of water').measurement[0]).toEqual({ quantity: 1, unit: 'tablespoon', isRange: false });
            expect(parse('1 tbsp & 1 tsp of water').measurement[1]).toEqual({ quantity: 1, unit: 'teaspoon', isRange: false });
        });
        
        //Most likely will not see three or more added measurements but here is a test anyways. 
        test('Three measurements', () => {
            expect(parse('1/4 cup plus 1 tbsp plus 1 tsp of water').hasAddedMeasurements).toBe(true);
            expect(parse('1/4 cup plus 1 tbsp plus 1 tsp of water').measurement[0]).toEqual({ quantity: 0.25, unit: 'cup', isRange: false });
            expect(parse('1/4 cup plus 1 tbsp plus 1 tsp of water').measurement[1]).toEqual({ quantity: 1, unit: 'tablespoon', isRange: false });
            expect(parse('1/4 cup plus 1 tbsp plus 1 tsp of water').measurement[2]).toEqual({ quantity: 1, unit: 'teaspoon', isRange: false });
    
            expect(parse('1/4 cup + 1 tbsp + 1 tsp of water').hasAddedMeasurements).toBe(true);
            expect(parse('1/4 cup + 1 tbsp + 1 tsp of water').measurement[0]).toEqual({ quantity: 0.25, unit: 'cup', isRange: false });
            expect(parse('1/4 cup + 1 tbsp + 1 tsp of water').measurement[1]).toEqual({ quantity: 1, unit: 'tablespoon', isRange: false });
            expect(parse('1/4 cup + 1 tbsp + 1 tsp of water').measurement[2]).toEqual({ quantity: 1, unit: 'teaspoon', isRange: false });

            expect(parse('1/4 cup and 1 tbsp and 1 tsp of water').hasAddedMeasurements).toBe(true);
            expect(parse('1/4 cup and 1 tbsp and 1 tsp of water').measurement[0]).toEqual({ quantity: 0.25, unit: 'cup', isRange: false });
            expect(parse('1/4 cup and 1 tbsp and 1 tsp of water').measurement[1]).toEqual({ quantity: 1, unit: 'tablespoon', isRange: false });
            expect(parse('1/4 cup and 1 tbsp and 1 tsp of water').measurement[2]).toEqual({ quantity: 1, unit: 'teaspoon', isRange: false });

            expect(parse('1/4 cup & 1 tbsp & 1 tsp of water').hasAddedMeasurements).toBe(true);
            expect(parse('1/4 cup & 1 tbsp & 1 tsp of water').measurement[0]).toEqual({ quantity: 0.25, unit: 'cup', isRange: false });
            expect(parse('1/4 cup & 1 tbsp & 1 tsp of water').measurement[1]).toEqual({ quantity: 1, unit: 'tablespoon', isRange: false });
            expect(parse('1/4 cup & 1 tbsp & 1 tsp of water').measurement[2]).toEqual({ quantity: 1, unit: 'teaspoon', isRange: false });

            expect(parse('1/4 cup plus 1 tbsp and 1 tsp of water').hasAddedMeasurements).toBe(true);
            expect(parse('1/4 cup plus 1 tbsp and 1 tsp of water').measurement[0]).toEqual({ quantity: 0.25, unit: 'cup', isRange: false });
            expect(parse('1/4 cup plus 1 tbsp and 1 tsp of water').measurement[1]).toEqual({ quantity: 1, unit: 'tablespoon', isRange: false });
            expect(parse('1/4 cup plus 1 tbsp and 1 tsp of water').measurement[2]).toEqual({ quantity: 1, unit: 'teaspoon', isRange: false });
        });
    });

    describe('No quantity and/or unit present in input', () => {
        test('Measurement is not present', () => {
            expect(parse('salt').measurement).toBe(null);
            expect(parse('salt').convertedMeasurement).toBe(null);
        })
        test('Quantity with no unit', () => {
            expect(parse('1 onion')).toHaveProperty('measurement.quantity', 1);
            expect(parse('1 onion')).toHaveProperty('measurement.unit', null);
        });
        // TODO: test('Unit with no quantity?', () => {});
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
    test('Contains alternate ingredients', () => {
        expect(parse('1 tbsp butter or margarine').hasAlternativeIngredients).toBe(true);
        expect(parse('1 tbsp butter or margarine').name[0]).toBe('butter');
        expect(parse('1 tbsp butter or margarine').name[1]).toBe('margarine');

        //TODO: Support list of ingredients where part of the name is implied(Ex: 'olive, canola, or vegetable oil', where 'oil' is implied for all ingredients)
        expect(parse('1 tbsp olive oil, canola oil, or vegetable oil').hasAlternativeIngredients).toBe(true);
        expect(parse('1 tbsp olive oil, canola oil, or vegetable oil').name[0]).toBe('olive oil');
        expect(parse('1 tbsp olive oil, canola oil, or vegetable oil').name[1]).toBe('canola oil');
        expect(parse('1 tbsp olive oil, canola oil, or vegetable oil').name[2]).toBe('vegetable oil');

        expect(parse('1 tbsp rice vinegar,apple cider vinegar,or white vinegar').hasAlternativeIngredients).toBe(true);
        expect(parse('1 tbsp rice vinegar,apple cider vinegar,or white vinegar').name[0]).toBe('rice vinegar');
        expect(parse('1 tbsp rice vinegar,apple cider vinegar,or white vinegar').name[1]).toBe('apple cider vinegar');
        expect(parse('1 tbsp rice vinegar,apple cider vinegar,or white vinegar').name[2]).toBe('white vinegar');

        expect(parse('1 cup milk (or buttermilk, almond milk, or coconut milk)').hasAlternativeIngredients).toBe(true);
        expect(parse('1 cup milk (or buttermilk, almond milk, or coconut milk)').name[0]).toBe('milk');
        expect(parse('1 cup milk (or buttermilk, almond milk, or coconut milk)').name[1]).toBe('buttermilk');
        expect(parse('1 cup milk (or buttermilk, almond milk, or coconut milk)').name[2]).toBe('almond milk');
        expect(parse('1 cup milk (or buttermilk, almond milk, or coconut milk)').name[3]).toBe('coconut milk');

        expect(parse('1 ounce chocolate bar (or chocolate chips), melted').hasAlternativeIngredients).toBe(true);
        expect(parse('1 ounce chocolate bar (or chocolate chips), melted').name[0]).toBe('chocolate bar');
        expect(parse('1 ounce chocolate bar (or chocolate chips), melted').name[1]).toBe('chocolate chips');
    });
});

describe('Correctly extracts any additional information', () => {
    test('Additional information after comma', () => {
        expect(parse('1 stick of butter, sliced into tablespoons')).toHaveProperty('additional', 'sliced into tablespoons');
        expect(parse('1 garlic clove, minced')).toHaveProperty('additional', 'minced');
        expect(parse('1 ounce chocolate, melted')).toHaveProperty('additional', 'melted');
        expect(parse('1 tomato, thinly sliced')).toHaveProperty('additional', 'thinly sliced');
    });
    test('Additional information in parenthesis', () => {
        expect(parse('1 stick of butter (sliced into tablespoons)')).toHaveProperty('additional', 'sliced into tablespoons');
        expect(parse('1 stick (8tbsp.) butter (sliced into tablespoons)')).toHaveProperty('additional', 'sliced into tablespoons');
        expect(parse('1 can (16oz) of tomato sauce (you can use pasta sauce if you like)')).toHaveProperty('additional', 'you can use pasta sauce if you like');
        expect(parse('1 garlic clove (minced)')).toHaveProperty('additional', 'minced');
        expect(parse('1 ounce chocolate (melted)')).toHaveProperty('additional', 'melted');
        expect(parse('1 tomato (thinly sliced)')).toHaveProperty('additional', 'thinly sliced');
    });
    test('Additional information in parenthesis containing special characters', () => {
        expect(parse('1 teaspoon espresso powder (homemade or store-bought)').hasAlternativeIngredients).toBe(false);
        expect(parse('1 teaspoon espresso powder (homemade or store-bought)').additional).toBe('homemade or store-bought');

        expect(parse("1 tsp oil (it's okay to use any oil or none at all)").hasAlternativeIngredients).toBe(false);
        expect(parse("1 tsp oil (it's okay to use any oil or none at all)").additional).toBe("it's okay to use any oil or none at all");

        expect(parse("1 slice of pizza (one topping) (cheese, pepperoni, or sausage is the best!)").hasAlternativeIngredients).toBe(false);
        expect(parse("1 slice of pizza (one topping) (cheese, pepperoni, or sausage is the best!)").additional).toBe("one topping, cheese, pepperoni, or sausage is the best!");
    });
    test('Multiple additional information', () => {
        expect(parse('1 (very ripe) tomato, thinly sliced')).toHaveProperty('additional', 'very ripe, thinly sliced');
        expect(parse('1 (very ripe) tomato (thinly sliced)')).toHaveProperty('additional', 'very ripe, thinly sliced');
        expect(parse('1 (very ripe) tomato (thinly sliced) (optional)')).toHaveProperty('additional', 'very ripe, thinly sliced, optional');
        expect(parse('1 (very ripe) tomato (thinly sliced, optional)')).toHaveProperty('additional', 'very ripe, thinly sliced, optional');
        expect(parse('1 (very ripe) tomato (thinly sliced), optional')).toHaveProperty('additional', 'very ripe, thinly sliced, optional');
    });
    //TODO: test('Additional information before ingredient name', () => {});
});
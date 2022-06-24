# ingredientparserjs

Parses ingredient strings to extract the ingredient name, measurement details, and more. 

## Installation

```
npm install ingredientparserjs --save
```

## Usage
To use, first `require` the module. You may give the binding whatever name you like. In the examples on this page the module will be called `parser`.
```javascript
const parser = require('ingredientparserjs');
```
There is currently one function exported by this module, `parse`. 
This function accepts one string argument and returns an object with the properties shown below.

> Note: The `parse` function expects the quantity and unit of the ingredient measurement to come first in the input string, followed by the name and any extra information about the ingredient.

| Property Name | Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Explaination
| :--- | :--- | :--- |
| name  | `string` \| `[string]` | The name of the ingredient. This will be a string array if the ingredient includes alternates. In this case, `hasAlternateIngredients` will be `true`.
| measurement | `object` \| `[object]` \| `null` | An object describing the measurement of the ingredient, if any. This will be an object array if the measurement is two or more measurements added together. In this case, `hasAddedMeasurements` will be `true`.
| convertedMeasurement | `object` \| `null` | An object describing the converted measurement of the ingredient, if any. Currently, a converted measurement is simply extracted from the string and not calculated or verified to be a correct conversion.
| hasAlternateIngredients | `boolean` | A boolean describing if the ingredient is a list
| hasAddedMeasurements | `boolean` | A boolean describing if the measurement is two or more measurements added together.
| additional | `string` \| `null` | Any additional information in the input not assumed to be the ingredient name or measurement. Each piece of the input that is considered "additional" with be concatenated using a comma as a seperator.

The properties `measurement` and `convertedMeasurement` will be `null` if no measurement is present at the beginning of the input. Otherwise, they will contain objects with the properties shown below.

| Property Name | Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Explaination
| :--- | :--- | :--- |
| quantity | `number` \| `[number]` \| `null` | The quantity of the ingredient measurement, if any. If the quantity is a range, this will be a number array containing exactly two elements. The minimum of this range will be contained in `quantity[0]` and the maximum will be contained in `quantity[1]`. In this case, `isRange` will be `true`.
| unit | `string` \| `null` | The unit of measurement, if any. This will contain the singular long form of the unit of measurement. For example, if the input contains the unit 'ounces" or "oz.", this property will contain the string 'ounce'.
| unitPlural | `string` \| `null` | The plural form of the unit of measurement, if any.
| isRange | `boolean` | A boolean describing if the measurement quantity is a range.

### Example: Simple
```javascript
parser.parse('salt');
```
will return:
```
{
  name: 'salt',
  measurement: null,
  convertedMeasurement: null,
  hasAlternativeIngredients: false,
  hasAddedMeasurements: false,
  additional: null
}
```

<hr>

```javascript
parser.parse('1 tablespoon salt');
```
will return:
```
{
  name: 'salt',
  measurement: { quantity: 1, isRange: false, unit: 'tablespoon', unitPlural: 'tablespoons' },
  convertedMeasurement: null,
  hasAlternativeIngredients: false,
  hasAddedMeasurements: false,
  additional: null
}
```

### Example: Measurement Quantity Range
```javascript
parser.parse('1 - 2 tablespoons of salt');
```
or
```javascript
parser.parse('1 to 2 tablespoons of salt');
```
will return:
```
{
  name: 'salt',
  measurement: { quantity: [ 1, 2 ], isRange: true, unit: 'tablespoon', unitPlural: 'tablespoons' },
  convertedMeasurement: null,
  hasAlternativeIngredients: false,
  hasAddedMeasurements: false,
  additional: null
}
```
For these inputs, `measurement.isRange` will be `true` and `measurement.quantity` will be a tuple where the first index contains the minimum of the range and the second index contains the maximum.

### Examples: Measurement Conversion

```javascript
parser.parse('1 ounce (28 grams) salt');
```
will return:
```
{
  name: 'salt',
  measurement: { quantity: 1, isRange: false, unit: 'ounce', unitPlural: 'ounces' },
  convertedMeasurement: { quantity: 28, isRange: false, unit: 'gram', unitPlural: 'grams' },
  hasAlternativeIngredients: false,
  hasAddedMeasurements: false,
  additional: null
}
```

<hr>

```javascript
parser.parse('1 can (8 ounces) tomato paste');
```
will return:
```
{
  name: 'tomato paste',
  measurement: { quantity: 1, isRange: false, unit: 'can', unitPlural: 'cans' },
  convertedMeasurement: { quantity: 8, isRange: false, unit: 'ounce', unitPlural: 'ounces' },
  hasAlternativeIngredients: false,
  hasAddedMeasurements: false,
  additional: null
}
```
> Note: A converted measurement is assumed to come directly after the initial measurement. If a converted measurement is not after the initial measurement, it will be placed within the `additional` string instead of parsed into an object. This is shown below.

```javascript
parser.parse('1 can tomato paste (8 ounces)');
```
will return:
```
{
  name: 'tomato paste',
  measurement: { quantity: 1, isRange: false, unit: 'can', unitPlural: 'cans' },
  convertedMeasurement: null,
  hasAlternativeIngredients: false,
  hasAddedMeasurements: false,
  additional: '8 ounces'
}
```

### Examples: Alternate ingredients

```javascript
parser.parse('4 tablespoons butter or margarine');
```
will return:
```
{
  name: [ 'butter', 'margarine' ],
  measurement: { quantity: 4, isRange: false, unit: 'tablespoon', unitPlural: 'tablespoons' },
  convertedMeasurement: null,
  hasAlternativeIngredients: true,
  hasAddedMeasurements: false,
  additional: null
}
```

<hr>

```javascript
parser.parse('2 tablespoons rice vinegar, apple cider vinegar, or white vinegar');
```
will return:
```
{
  name: [ 'rice vinegar', 'apple cider vinegar', 'white vinegar' ],
  measurement: { quantity: 2, isRange: false, unit: 'tablespoon', unitPlural: 'tablespoons' },
  convertedMeasurement: null,
  hasAlternativeIngredients: true,
  hasAddedMeasurements: false,
  additional: null
}
```

<hr>


```javascript
parser.parse('1 cup milk (or buttermilk, almond milk, or coconut milk)');
```
will return:
```
{
  name: [ 'milk', 'buttermilk', 'almond milk', 'coconut milk' ],
  measurement: { quantity: 1, isRange: false, unit: 'cup', unitPlural: 'cups' },
  convertedMeasurement: null,
  hasAlternativeIngredients: true,
  hasAddedMeasurements: false,
  additional: null
}
```
> Note: For alternate ingredients within parenthesis to be recognized, the phrase within parenthesis must begin with the word 'or'. Otherwise, the phrase within parenthesis will be placed within the `additional` string.

### Example: Added measurements
```javascript
parser.parse('3 tablespoons plus 2 teaspoons vegetable oil');
```
will return:
```
{
  name: 'vegetable oil',
  measurement: [
    { quantity: 3, isRange: false, unit: 'tablespoon', unitPlural: 'tablespoons' },
    { quantity: 2, isRange: false, unit: 'teaspoon', unitPlural: 'teaspoons' }
  ],
  convertedMeasurement: null,
  hasAlternativeIngredients: false,
  hasAddedMeasurements: true,
  additional: null
}
```

### Example: Kitchen Sink 
```javascript
parser.parse('3 tablespoons plus 2 teaspoons (about 1/4 cup) avacado oil or olive oil (extra virgin), optional');
```
will return:
```
{
  name: [ 'avacado oil', 'olive oil' ],
  measurement: [
    { quantity: 3, isRange: false, unit: 'tablespoon', unitPlural: 'tablespoons' },
    { quantity: 2, isRange: false, unit: 'teaspoon', unitPlural: 'teaspoons' }
  ],
  convertedMeasurement: { quantity: 0.25, isRange: false, unit: 'cup', unitPlural: 'cups' },
  hasAlternativeIngredients: true,
  hasAddedMeasurements: true,
  additional: 'extra virgin, optional'
}
```

## Updates for minor release 1.1.0

As of version 1.1.0, the parser has support for inputs containing the following:
- Unicode fractions
- Decimals

## Updates for minor release 1.2.0

As of version 1.2.0, the parser has support for inputs containing the following:
- Alternate ingredients
- Added measurements
- Additional units of measurement

## Updates for patch 1.2.1

Patch 1.2.1 addresses issues [#1](https://github.com/brando209/ingredientparserjs/issues/1) and [#2](https://github.com/brando209/ingredientparserjs/issues/2).

## Updates for patch 1.2.2

Patch 1.2.2 addresses issues [#3](https://github.com/brando209/ingredientparserjs/issues/3) and [#4](https://github.com/brando209/ingredientparserjs/issues/4).

## Contributing
Found a bug? Please take the time to submit an issue [here](https://github.com/brando209/ingredientparserjs/issues). Have a bit more time than that? Track the bug down, fix it, then submit a pull request [here](https://github.com/brando209/ingredientparserjs/pulls). Alternately, if you just want to help improve the ingredient parser by recommending an improvement or a new feature, you can do that [here](https://github.com/brando209/ingredientparserjs/issues) as well. All help is greatly appreciated!
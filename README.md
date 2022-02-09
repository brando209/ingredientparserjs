# ingredientparserjs

Parses ingredient strings to extract the ingredient name, measurement details, and more. 

## Installation

```
npm install ingredientparserjs --save
```

## Usage

```javascript
const parser = require('ingredientparserjs');

let result = parser.parse('1 liter of water');
result.name //=> 'water'
result.measurement.quantity //=> 1
result.measurement.unit //=> 'liter'

result = parser.parse('2 cups sugar');
result.name //=> 'sugar'
result.measurement.quantity //=> 2
result.measurement.unit //=> 'cup'

result = parser.parse('1 ounce (28 grams) salt');
result.name //=> 'salt'
result.measurement.quantity //=> 1
result.measurement.unit //=> 'ounce'
result.convertedMeasurement.quantity //=> 28
result.convertedMeasurement.unit //=> 'gram'
```
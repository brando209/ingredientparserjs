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
result.measurement.quantity //=> 1
result.measurement.unit //=> 'liter'
result.name //=> 'water'

result = parser.parse('2 cups sugar');
result.measurement.quantity //=> 2
result.measurement.unit //=> 'cup'
result.name //=> 'sugar'
```
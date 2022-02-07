const units = {
    bag: ['bag'],
    box: ['box'],
    can: ['can'],
    cup: ['cup', 'c'],
    clove: ['clove'],
    gallon: ['gallon', 'gal'],
    ounce: ['ounce', 'oz'],
    pint: ['pint', 'pt'],
    pound: ['pound', 'lb'],
    quart: ['quart', 'qt'],
    tablespoon: ['tablespoon', 'tbs', 'tbsp', 'tbspn'],
    teaspoon: ['teaspoon', 'tsp', 'tspn'],
    gram: ['gram', 'g'],
    kilogram: ['kilogram', 'kg'],
    liter: ['liter', 'l', 'lt'],
    milligram: ['milligram', 'mg'],
    milliliter: ['milliliter', 'ml'],
    package: ['package', 'pkg'],
    piece: ['piece', 'pc'],
    pinch: ['pinch'],
    slice: ['slice'],
    stick: ['stick'],
    small: ['small', 'sm'],
    medium: ['medium', 'med'],
    large: ['large', 'lg']
}

const pluralUnits = {
    bag: ['bags'],
    box: ['boxes'],
    can: ['cans'],
    cup: ['cups'],
    clove: ['cloves'],
    gallon: ['gallons', 'gals'],
    ounce: ['ounces'],
    pint: ['pints', 'pts'],
    pound: ['pounds', 'lbs'],
    quart: ['quarts', 'qts'],
    tablespoon: ['tablespoons', 'tbspns'],
    teaspoon: ['teaspoons', 'tspns'],
    gram: ['grams'],
    kilogram: ['kilograms'],
    liter: ['liters'],
    milligram: ['milligrams'],
    milliliter: ['milliliters'],
    package: ['packages', 'pkgs'],
    piece: ['pieces', 'pcs'],
    pinch: ['pinches'],
    slice: ['slices'],
    stick: ['sticks'],
}

const unitMap = new Map();
//Map each possible unit 'variant' to a single unit
//Ex: 'oz', 'ounce', and 'ounces' map to 'ounce'
for (let unit in units) {
    for(let entry of units[unit]) {
        unitMap.set(entry, unit);
    }
    if(pluralUnits[unit]) {
        for(let entry of pluralUnits[unit]) {
            unitMap.set(entry, unit);
        }
    }
}

module.exports = { unitMap };
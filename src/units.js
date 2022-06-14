const units = {
    bag: ['bag'],
    box: ['box'],
    bunch: ['bunch'],
    can: ['can'],
    carton: ['carton'],
    centimeter: ['centimeter', 'cm'],
    clove: ['clove'],
    container: ['container'],
    crown: ['crown'],
    cup: ['cup', 'c'],
    dash: ['dash'],
    drop: ['drop'],
    ear: ['ear'],
    'fluid ounce': ['fluid ounce', 'fl ounce', 'fluid oz', 'fl oz'],
    foot: ['foot', 'ft'],
    gallon: ['gallon', 'gal'],
    gram: ['gram', 'g'],
    head: ['head'],
    inch: ['inch', 'in'],
    kilogram: ['kilogram', 'kg'],
    liter: ['liter', 'l', 'lt'],
    milligram: ['milligram', 'mg'],
    milliliter: ['milliliter', 'ml'],
    ounce: ['ounce', 'oz'],
    pack: ['pack'],
    package: ['package', 'pkg'],
    piece: ['piece', 'pc'],
    pinch: ['pinch'],
    pint: ['pint', 'pt'],
    pound: ['pound', 'lb'],
    quart: ['quart', 'qt'],
    slice: ['slice'],
    stick: ['stick'],
    sprig: ['sprig'],
    tablespoon: ['tablespoon', 'tbs', 'tbsp', 'tbspn'],
    teaspoon: ['teaspoon', 'tsp', 'tspn'],

    small: ['small', 'sm'],
    medium: ['medium', 'med'],
    large: ['large', 'lg']
}

const pluralUnits = {
    bag: ['bags'],
    box: ['boxes'],
    bunch: ['bunches'],
    can: ['cans'],
    carton: ['cartons'],
    centimeter: ['centimeters', 'cm'],
    clove: ['cloves'],
    container: ['containers'],
    crown: ['crowns'],
    cup: ['cups'],
    dash: ['dashes'],
    drop: ['drops'],
    ear: ['ears'],
    'fluid ounce': ['fluid ounces', 'fl ounces'],
    foot: ['feet'],
    gallon: ['gallons', 'gals'],
    gram: ['grams'],
    head: ['heads'],
    inch: ['inches'],
    kilogram: ['kilograms'],
    liter: ['liters'],
    milligram: ['milligrams'],
    milliliter: ['milliliters'],
    ounce: ['ounces'],
    pack: ['packs'],
    package: ['packages', 'pkgs'],
    piece: ['pieces', 'pcs'],
    pinch: ['pinches'],
    pint: ['pints', 'pts'],
    pound: ['pounds', 'lbs'],
    quart: ['quarts', 'qts'],
    slice: ['slices'],
    stick: ['sticks'],
    sprig: ['sprigs'],
    tablespoon: ['tablespoons', 'tbspns'],
    teaspoon: ['teaspoons', 'tspns'],
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

const pluralUnitMap = {};
for(let unit in pluralUnits) {
    pluralUnitMap[unit] = pluralUnits[unit][0];
}
pluralUnitMap['small'] = null;
pluralUnitMap['medium'] = null;
pluralUnitMap['large'] = null;

module.exports = { unitMap, pluralUnitMap };
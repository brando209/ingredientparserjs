const { unitMap } = require('./src/units');
const { toNumberFromString } = require('./src/utils');
/*
    Extracts measurement information from an ingredient string.
    Assumes that the string begins with the measurement details.
    Returns an object of the form:
        {
            quantity:   Number | [Number]
            unit:       String
            isRange:    Boolean
        }
*/
function extractMeasurement(ingredientString) {
    const measurement = {
        quantity: null,
        unit: null,
        isRange: false
    }

    //Extract the measurement quantity. Assumes measurement is at start of string.
    //If quantity is a range, assumes it to be structured like: '1-2' or '1 to 2' (may include whitespace in between)
    //Quantity may have fractions(Ex: '1/2 cup'). These fractions may be mixed with range(Ex: '1 1/2 to 2 cups).
    const quantityRegex = /^(\d+\/*\d*)\s*(\d\/\d)*\s*(\-|to)*\s*(\d+\/*\d*)*\s*(\d\/\d)*\s*/;
    //Five groups are captured:
    //  1. First number/fraction(may not be whole, ex: '1/2 cup')
    //  2. Fractional part of min range value (if exists)
    //  3. Range identifier, '-' or 'to' (if exists)
    //  4. Second number/fraction (if exists)
    //  5. Fractional part of max range value (if exists)
    let quantityStringLength = 0; //Length of the quantity portion of the string
    const quantityMatch = ingredientString.replace(/^an?\s+/i, "1 ").match(quantityRegex);

    if(quantityMatch) {
        const [minNum, minFrac] = [quantityMatch[1], quantityMatch[2]];
        const isRange = quantityMatch[3];
        const [maxNum, maxFrac] = [quantityMatch[4], quantityMatch[5]]
        //Length of measurement quantity portion of string
        quantityStringLength = quantityMatch[0].length;
        
        const minQuantity = toNumberFromString(minNum) + toNumberFromString(minFrac);
        const maxQuantity = toNumberFromString(maxNum) + toNumberFromString(maxFrac);
        
        if(isRange) {
            measurement.isRange = true;
            measurement.quantity = [minQuantity, maxQuantity];
        } else measurement.quantity = minQuantity;
    }
    
    let ingredientStringWithoutQuantity = ingredientString.substring(quantityStringLength).trim();
    let ingredientStringWithoutQuantityAndUnit = ingredientStringWithoutQuantity;
    
    //Extract the measurement unit
    //If the unit is 'bag', 'box', 'can', or 'package', it may come with a second measurement that gives the size
    //of the package(Ex: '1 (8 oz.) can of tomato paste' or '2 cans of tomato paste (8oz)'. Check this first and move second
    //measurement to the end of the string.
    const packageRegex = /bags?|boxe?s?|cans?|packages?|pkgs?.?/i
    const packageMatch = ingredientStringWithoutQuantity.match(packageRegex);
    if(packageMatch) {
        ingredientStringWithoutQuantityAndUnit = ingredientStringWithoutQuantityAndUnit.slice(packageMatch.index + packageMatch[0].length).trim() + " " + ingredientStringWithoutQuantityAndUnit.slice(0, packageMatch.index).trim();
        measurement.unit = unitMap.get(packageMatch[0].replace(".", "").toLowerCase().trim());
    }

    let unitStringLength = 0; //Length of measurement unit portion of string
    //If the unit is not 'bag', 'box', etc., assume the unit comes directly after the quantity(Ex: '4 oz. cheese').
    const unitRegex = /^\s*(cups?|c.?|cloves?|gallons?|gals?.?|ounces?|oz.?|pints?|pts?.?|pounds?|lbs?.?|quarts?|qts?.?|tablespoons?|tbsp?n?s?.?|teaspoons?|tspn?s?.?|grams?|g.?|kilograms?|kgs?.?|liters?|lt?.?|milligrams?|mgs?.?|milliliters?|mls?.?|pieces?|pcs?.?|pinche?s?|pieces?|pcs?.?|slices?|sticks?|small|sm.?|medium|med.?|large|lg.?)\s+/i
    //One group is captured: the unit (without ending period, if any)
    const unitMatch = ingredientStringWithoutQuantity.match(unitRegex);
    if(unitMatch) {
        unitStringLength = unitMatch[0].length;
        measurement.unit = unitMap.get(unitMatch[1].replace(".", "").toLowerCase().trim());
    }

    ingredientStringWithoutQuantityAndUnit = ingredientStringWithoutQuantityAndUnit.substring(unitStringLength).trim();

    return [measurement, ingredientStringWithoutQuantityAndUnit]
}

//TODO: Seperate ingredient name from the rest of the ingredient string, if any.
//Ex: extractName('garlic') returns ['garlic', null]
//Ex: extractName('garlic, minced') returns ['garlic', 'minced']
//Ex: extractName('garlic (peeled and chopped)') returns ['garlic', '(peeled and chopped)']
function extractName(ingredientString) {
    return [ingredientString.replace(/^of\s/, ""), null];
}

function parse(ingredientString) {
    const result = {
        name: null,
        measurement: null,
        additional: null
    }

    const [measurement, restOfIngredientString] = extractMeasurement(ingredientString);
    result.measurement = measurement;

    const [name, additionalDetails] = extractName(restOfIngredientString);
    result.name = name;
    result.additional = additionalDetails;

    return result;
}

exports.parse = parse;
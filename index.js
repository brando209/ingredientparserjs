const { unitMap } = require('./src/units');
const { toNumberFromString, convertUnicodeFractions } = require('./src/utils');

//Pre-process string
function preprocess(string) {
    string = convertUnicodeFractions(string);
    //If there is a slash directly preceeded by a non-digit, assume it is a measurement conversion and add a
    //space before the slash. Ex: '28g/1oz flour' becomes '28g /1oz flour'. (Needed with current `conversionRegex`)
    string = string.replace(/(?<!\d)\//g, ' /');
    //If there is an opening parens immediately proceeded by a digit and immediately preceeded by a non-digit,
    //assume it is a measurement conversion and add space. Ex: '28g(1oz) flour' becomes '28g (1oz) flour'.
    string = string.replace(/(?<!\d|\s)\((?=\d)/g, ' (');
    //If 'and' or '&' is immediately preceeded by a whole number and immediately proceeded by a fraction, 
    //remove the 'and' or '&'. Ex: '1 & 1/2 cups' becomes '1 1/2 cups'
    string = string.replace(/(?<=\d+)(\s*(and|&)\s*)(?=\d+\/\d+)/g, " ");
    //If there is a slash contained between two digits, assume it is a fraction and convert to a decimal
    string = string.replace(/(\d*)\s*(\d+\/\d+)/g, (match, whole, frac) => ((whole ? toNumberFromString(whole) : " ") + toNumberFromString(frac)));
    //If there are multiple consecutive spaces, converge to single space
    string = string.replaceAll(/\s{2,}/g, " ");
    //If there is a comma seperated list, ensure there is a space after each comma
    string = string.replaceAll(/,\s?/g, ", ");
    //If the string begins with the word 'A' or 'An', assume it to mean a single unit of ingredient and replace with the number '1'
    string = string.replace(/^an?\s+/i, "1 ");
    //Trim whitespace from edges
    string = string.trim();

    return string;
}

//Extract the measurement quantity. Assumes measurement is at start of string.
function extractQuantity(ingredientString) {
    let quantity = null;
    let isRange = false;
    let quantityStringLength = 0; //Length of the quantity portion of the string

    //If quantity is a range, assumes it to be structured like: '1-2' or '1 to 2' (may include whitespace in between)
    const quantityRegex = /^(\d+\.?\d*)\s*(\-|to(?=\d+|\s+))*\s*(\d+\.?\d*)*\s*/;
    //Three groups are captured:
    //  1. First number/decimal
    //  2. Range identifier, '-' or 'to' (if exists)
    //  3. Second number/decimal (if exists)
    const quantityMatch = ingredientString.match(quantityRegex);

    if(quantityMatch) {
        const minQuantity = toNumberFromString(quantityMatch[1]);
        const hasRange = quantityMatch[2];
        const maxQuantity = quantityMatch[3] ? toNumberFromString(quantityMatch[3]) : minQuantity;
        //Length of measurement quantity portion of string
        quantityStringLength = quantityMatch[0].length;
        
        if(hasRange) {
            isRange = true;
            quantity = [minQuantity, maxQuantity];
        } else quantity = minQuantity;
    }

    const ingredientStringWithoutQuantity = ingredientString.substring(quantityStringLength).trim();

    return { quantity, isRange, ingredientStringWithoutQuantity };
}

//Extract the measurement unit
function extractUnit(ingredientString) {
    let unit = null;
    let ingredientStringWithoutQuantityAndUnit = ingredientString;

    //First check if the unit is 'bag', 'box', 'can', or 'package'
    //TODO: Find better regex for units like 'bunches' amd 'dashes'. Currently /bunche?s?/ but this is not correct because it matches 'bunche'.
    const packageRegex = /\b(bags?|boxe?s?|bunche?s?|cans?|cartons?|containers?|packs?|packages?|pkgs?\.?)\b/i
    const packageMatch = ingredientString.match(packageRegex);
    if(packageMatch) {
        ingredientStringWithoutQuantityAndUnit = ingredientStringWithoutQuantityAndUnit.slice(0, packageMatch.index).trim() + ingredientStringWithoutQuantityAndUnit.slice(packageMatch.index + packageMatch[0].length).trim();
        unit = unitMap.get(packageMatch[0].replace(".", "").toLowerCase().trim());
    }

    let unitStringLength = 0; //Length of measurement unit portion of string
    let unitStringStart = 0; //Index of start of unit portion of string
    //If the unit is not 'bag', 'box', etc., assume the unit comes directly after the quantity(Ex: '4 oz. cheese').
    const unitRegex = /\b(cups?|c\.?|cloves?|centimeters?|cm\.?|crowns?|dashe?s?|drops?|ears?|fluid\s*ounces?|fl\.?\s*ounces?|fl\.?\s*oz\.?|foot|ft\.?|feet|heads?|gallons?|gals?\.?|inche?s?|in\.?|ounces?|oz\.?|pints?|pts?\.?|pounds?|lbs?\.?|quarts?|qts?\.?|tablespoons?|tbsp?n?s?\.?|teaspoons?|tspn?s?\.?|grams?|g\.?|kilograms?|kgs?\.?|liters?|lt?\.?|milligrams?|mgs?\.?|milliliters?|mls?\.?|pieces?|pcs?\.?|pinche?s?|slices?|sticks?|sprigs?|small|sm\.?|medium|med\.?|large|lg\.?)(?!\S)/i
    //One group is captured: the unit (without ending period, if any)
    const unitMatch = ingredientStringWithoutQuantityAndUnit.match(unitRegex);
    if(!packageMatch && unitMatch) {
        unitStringLength = unitMatch[0].length;
        unitStringStart = unitMatch.index;
        unit = unitMap.get(unitMatch[1].replaceAll(".", "").toLowerCase().trim());
        ingredientStringWithoutQuantityAndUnit = ingredientStringWithoutQuantityAndUnit.slice(0, unitStringStart).trim() + (unitStringStart > 0 ? " " : "") + ingredientStringWithoutQuantityAndUnit.substring(unitStringStart + unitStringLength).trim();
    }

    return { unit, ingredientStringWithoutQuantityAndUnit };
}

function extractAddedMeasurement(ingredientString) {
    const hasAddedMeasurementsRegex = /^(plus|\+|and|&)/;
    let hasAddedMeasurementsMatch = ingredientString.match(hasAddedMeasurementsRegex);
    let ingredientStringWithoutAddedMeasurement = ingredientString;
    let hasAddedMeasurements = false;
    let addedMeasurements = [];
    do{
        let quantity = null, unit = null, isRange = false;
        if(hasAddedMeasurementsMatch) {
            hasAddedMeasurements = true;
            ingredientStringWithoutAddedMeasurement = ingredientStringWithoutAddedMeasurement.slice(hasAddedMeasurementsMatch[0].length).trim();
            const { quantity: addedQuantity, isRange: addedIsRange, ingredientStringWithoutQuantity } = extractQuantity(ingredientStringWithoutAddedMeasurement);
            quantity = addedQuantity;
            isRange = addedIsRange;
            const { unit: addedUnit, ingredientStringWithoutQuantityAndUnit } = extractUnit(ingredientStringWithoutQuantity);
            ingredientStringWithoutAddedMeasurement = ingredientStringWithoutQuantityAndUnit;
            unit = addedUnit;
            addedMeasurements.push({ quantity, isRange, unit });
        }
        hasAddedMeasurementsMatch = ingredientStringWithoutAddedMeasurement.match(hasAddedMeasurementsRegex);
    } while(hasAddedMeasurementsMatch);
    return { addedMeasurements, hasAddedMeasurements: hasAddedMeasurements, ingredientStringWithoutAddedMeasurement }
}

function extractConversion(ingredientString) {
    const conversionRegex = /^(\(|\/)\s*(?:\s*about\s+)?(\d+\.?\d*)\s*(\-|to)*\s*(\d+\.?\d*)*\s*(cups?|c\.?|cloves?|centimeters?|cm\.?|crowns?|dashe?s?|drops?|ears?|fluid\s*ounces?|fl\.?\s*ounces?|fl\.?\s*oz\.?|foot|ft\.?|feet|heads?|gallons?|gals?\.?|inche?s?|in\.?|ounces?|oz\.?|pints?|pts?\.?|pounds?|lbs?\.?|quarts?|qts?\.?|tablespoons?|tbsp?n?s?\.?|teaspoons?|tspn?s?\.?|grams?|g\.?|kilograms?|kgs?\.?|liters?|lt?\.?|milligrams?|mgs?\.?|milliliters?|mls?\.?|pieces?|pcs?\.?|pinche?s?|slices?|sticks?|sprigs?)(\)?)/;
    let conversion = {
        quantity: null,
        isRange: false,
        unit: null
    }
    let conversionMatch, conversionStringLength = 0;
    let ingredientStringWithoutMeasurement = ingredientString;
    //Decide if there is a measurement conversion next. Ex: '28 grams /1oz sugar' or '28 g (1 oz.) sugar'
    conversionMatch = ingredientString.match(conversionRegex);

    if(conversionMatch) {
        const minQuantity = toNumberFromString(conversionMatch[2]);
        const hasRange = conversionMatch[3];
        const maxQuantity = conversionMatch[4] ? toNumberFromString(conversionMatch[4]) : minQuantity;
        //Length of converted measurement quantity portion of string
        conversionStringLength = conversionMatch[0].length;
        
        if(hasRange) {
            conversion.isRange = true;
            conversion.quantity = [minQuantity, maxQuantity];
        } else conversion.quantity = minQuantity;

        conversion.unit = unitMap.get(conversionMatch[5].replace(".", "").toLowerCase().trim());

        ingredientStringWithoutMeasurement = ingredientStringWithoutMeasurement.substring(conversionStringLength).trim();

        return { conversion, ingredientStringWithoutMeasurement }
    }

    return { conversion: null, ingredientStringWithoutMeasurement };

}

function extractMeasurement(ingredientString) {
    const measurements = [null, null];
    let measurement = {
        quantity: null,
        isRange: false,
        unit: null
    };

    ingredientString = preprocess(ingredientString);

    //Extract quantity
    let { quantity, isRange, ingredientStringWithoutQuantity } = extractQuantity(ingredientString);
    measurement.quantity = quantity;
    measurement.isRange = isRange;

    //Extract unit
    let { unit, ingredientStringWithoutQuantityAndUnit } = extractUnit(ingredientStringWithoutQuantity);
    measurement.unit = unit;

    if(!quantity) measurement = null;

    //Extract added measurements
    let { addedMeasurements, hasAddedMeasurements, ingredientStringWithoutAddedMeasurement } = extractAddedMeasurement(ingredientStringWithoutQuantityAndUnit)
    //Extract conversion
    let { conversion, ingredientStringWithoutMeasurement } = extractConversion(ingredientStringWithoutAddedMeasurement);

    measurements[0] = hasAddedMeasurements ? [measurement, ...addedMeasurements] : measurement;
    measurements[1] = conversion;

    return [measurements, hasAddedMeasurements, ingredientStringWithoutMeasurement]
}

//TODO: Account for additional info which is before the ingredient name and not in parenthesis(ex: '1 finely chopped onion')
//Assumes the input begins with the ingredient name (and any alternative ingredients).
//Additional text is assumed to start after the first comma following the ingredient name(or names) or within parenthesis.
function extractName(ingredientString) {
    ingredientString = ingredientString.replace(/^of\s/, "").trim();
    //To seperate (using String.prototype.split) on the first comma not part of the ingredients list
    const seperationRegex = /(?<=,?\s+or(?:\s+\w+)+),\s+|(?<!\s+or\s+),\s+(?!(?:\w+,?\s+)*or\s+)/;
    //Matches any words within parenthesis(unless special characters other than [-'"&*!,\\?.] are present)
    const parenRegex = /(?<=\()(?:\s*\w*[-'"&*!,\\?.]*)*(?=\))/;
    let additionalDetails = [];
    let parenMatch = ingredientString.match(parenRegex);
    while(parenMatch) {
        //If the section of the string within parenthesis starts with 'or', assume it to be an alternate ingredient(or list).
        if(parenMatch[0].match(/^or\s/)) {
            //If this is a list, remove the parenthesis and replace leading 'or' with a comma.
            if(parenMatch[0].match(/(?:,?\s+or\s+)|,\s+/)) {
                ingredientString = ingredientString.slice(0, parenMatch.index - 1) + "," + ingredientString.slice(parenMatch.index + 2, parenMatch.index + parenMatch[0].length) + ingredientString.slice(parenMatch.index + parenMatch[0].length + 1);
            } else {
                //If not a list, remove the parenthesis
                ingredientString = ingredientString.slice(0, parenMatch.index - 1) + ingredientString.slice(parenMatch.index, parenMatch.index + parenMatch[0].length) + ingredientString.slice(parenMatch.index + parenMatch[0].length + 1);
            }
        } else {
            //Remove the section of the string within parenthesis(including parenthesis)
            ingredientString = ingredientString.slice(0, parenMatch.index - 1) + ingredientString.slice(parenMatch.index + parenMatch[0].length + 1);
            //Add the section within parenthesis to additionalDetails array
            additionalDetails.push(parenMatch[0]);
        }
        //Find next match
        parenMatch = ingredientString.match(parenRegex);
    }

    const [ingredients, extra] = ingredientString.split(seperationRegex);
    const alternatives = ingredients.split(/(?:,?\s+or\s+)|,\s+/).map(alt => alt.trim());
    extra && additionalDetails.push(extra);

    const additionalString = additionalDetails.length > 0 ? additionalDetails.join(', ') : null;

    return [alternatives.length === 1 ? alternatives[0] : alternatives, alternatives.length > 1, additionalString]
}

function parse(ingredientString) {
    const result = {
        name: null,
        measurement: null,
        convertedMeasurement: null,
        hasAlternativeIngredients: false,
        hasAddedMeasurements: false,
        additional: null
    }

    const [[measurement, converted], hasAddedMeasurements, restOfIngredientString] = extractMeasurement(ingredientString);
    result.measurement = measurement;
    result.convertedMeasurement = converted;
    result.hasAddedMeasurements = hasAddedMeasurements;

    const [name, hasAlternativeIngredients, additionalDetails] = extractName(restOfIngredientString);
    result.name = name;
    result.hasAlternativeIngredients = hasAlternativeIngredients;
    result.additional = additionalDetails;

    return result;
}

console.log(parse('1 cup fruit (orange or apple)'));

exports.parse = parse;
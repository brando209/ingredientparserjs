const { unitMap } = require('./src/units');
const { toNumberFromString, convertUnicodeFractions } = require('./src/utils');
/*
    Extracts measurement information from an ingredient string.
    Assumes that the string has the forms:
        "[Quantity | QuantityRange] [Unit] [(<optional>)] [Ingredient] [(<optional>) | , <optional>]"
        "[Quantity | QuantityRange] [Unit] [/[Quantity | QuantityRange] [Unit]] [(<optional>)] [Ingredient] [(<optional>) | , <optional>]"
        "[Quantity | QuantityRange] [Unit] [([Quantity | QuantityRange] [Unit])] [(<optional>)] [Ingredient] [(<optional>) | , <optional>]"

    Returns a tuple. The first entry is a tuple containing objects of the form below where the first entry is the first measurement
    found and the second entry is a converted measurement, if found, or null.
        {
            quantity:   Number | [Number]
            unit:       String
            isRange:    Boolean
        }
    The second entry is the input ingredient string with the measurement information removed

    The algorithm is as follows:
        1.  Pre-process string
        2.  Extract Quantity portion of string, if present
        3.  Extract Unit portion of string, if present
            3.1.  If package-like unit is found(eg. package, bag, box, etc.):
                3.1.1.  Remove the unit.
            3.2.  If regular unit is found(eg. liter, ounce, cup, etc.):
                3.2.1.  If unit is found at the beginning of the string: remove the unit.
                3.2.2.  If unit is not at the beginning of the string: assume that in front of the unit is an adjective describing
                        the unit (ex. 'heaping tablespoons of coffee grinds' or 'level cup of flour') *Quantity is removed at this point*.
                        Remove the unit and the portion of the string that was in front of the unit.
        4.  Extract Converted Quantity/Unit of string, if present
            4.1. Follow steps '2.' and '3.2.'(assume no package-like unit)
        5.  Save the results from steps '2.', '3.' as result.measurement and the results of step '4.' as result.convertedMeasurement.
        6.  Seperate the ingredient name from the rest of the ingredient string. Assume the ingredient name will be at the beginning of the
            string and determine the separation point as the location where either the first comma or the first opening parenthesis is found.
            6.1 Examine the name section of the string(first section) for anything which is not part of the ingredient name.
                (ex. 'finely chopped cabbage, any variety' or 'very ripe bananas, mashed'). Move this part to the end of the second section.
            6.2. Save the first section as result.name and the second section as result.additional
*/
function extractMeasurement(ingredientString) {
    const measurements = [null, null];
    const measurement = {
        quantity: null,
        unit: null,
        isRange: false
    };
    const conversion = {
        quantity: null,
        unit: null,
        isRange: false
    }

    //================== PRE-PROCESS STRING ====================
    ingredientString = convertUnicodeFractions(ingredientString);
    //If there is a slash directly preceeded by a non-digit, assume it is a measurement conversion and add a
    //space before the slash. Ex: '28g/1oz flour' becomes '28g /1oz flour'. (Needed with current `conversionRegex`)
    ingredientString = ingredientString.replace(/(?<!\d)\//g, ' /');
    //If there is an opening parens immediately proceeded by a digit and immediately preceeded by a non-digit,
    //assume it is a measurement conversion and add space. Ex: '28g(1oz) flour' becomes '28g (1oz) flour'.
    ingredientString = ingredientString.replace(/(?<!\d|\s)\((?=\d)/g, ' (');
    //If 'and' or '&' is immediately preceeded by a whole number and immediately proceeded by a fraction, 
    //remove the 'and' or '&'. Ex: '1 & 1/2 cups' becomes '1 1/2 cups'
    ingredientString = ingredientString.replace(/(?<=\d+)(\s*(and|&)\s*)(?=\d+\/\d+)/g, " ");
    //If there is a slash contained between two digits, assume it is a fraction and convert to a decimal
    ingredientString = ingredientString.replace(/(\d*)\s*(\d+\/\d+)/g, (match, whole, frac) => (toNumberFromString(whole) + toNumberFromString(frac)));
    //If the string begins with the word 'A' or 'An', assume it to mean a single unit of ingredient and replace with the number '1'
    ingredientString = ingredientString.replace(/^an?\s+/i, "1 ");

    //Extract the measurement quantity. Assumes measurement is at start of string.
    //If quantity is a range, assumes it to be structured like: '1-2' or '1 to 2' (may include whitespace in between)
    const quantityRegex = /^(\d+\.?\d*)\s*(\-|to(?=\d+|\s+))*\s*(\d+\.?\d*)*\s*/;
    //Three groups are captured:
    //  1. First number/decimal
    //  2. Range identifier, '-' or 'to' (if exists)
    //  3. Second number/decimal (if exists)
    let quantityStringLength = 0; //Length of the quantity portion of the string
    const quantityMatch = ingredientString.match(quantityRegex);

    if(quantityMatch) {
        const minQuantity = toNumberFromString(quantityMatch[1]);
        const isRange = quantityMatch[2];
        const maxQuantity = quantityMatch[3] ? toNumberFromString(quantityMatch[3]) : minQuantity;
        //Length of measurement quantity portion of string
        quantityStringLength = quantityMatch[0].length;
        
        if(isRange) {
            measurement.isRange = true;
            measurement.quantity = [minQuantity, maxQuantity];
        } else measurement.quantity = minQuantity;
    }
    
    let ingredientStringWithoutQuantity = ingredientString.substring(quantityStringLength).trim();
    let ingredientStringWithoutQuantityAndUnit = ingredientStringWithoutQuantity;
    
    //Extract the measurement unit

    //First check if the unit is 'bag', 'box', 'can', or 'package'
    const packageRegex = /\b(bags?|boxe?s?|cans?|packages?|pkgs?\.?)\b/i
    const packageMatch = ingredientStringWithoutQuantity.match(packageRegex);
    if(packageMatch) {
        ingredientStringWithoutQuantityAndUnit = ingredientStringWithoutQuantityAndUnit.slice(0, packageMatch.index).trim() + ingredientStringWithoutQuantityAndUnit.slice(packageMatch.index + packageMatch[0].length).trim();
        measurement.unit = unitMap.get(packageMatch[0].replace(".", "").toLowerCase().trim());
    }

    let unitStringLength = 0; //Length of measurement unit portion of string
    let unitStringStart = 0; //Index of start of unit portion of string
    //If the unit is not 'bag', 'box', etc., assume the unit comes directly after the quantity(Ex: '4 oz. cheese').
    const unitRegex = /\b(cups?|c\.?|cloves?|gallons?|gals?\.?|ounces?|oz\.?|pints?|pts?\.?|pounds?|lbs?\.?|quarts?|qts?\.?|tablespoons?|tbsp?n?s?\.?|teaspoons?|tspn?s?\.?|grams?|g\.?|kilograms?|kgs?\.?|liters?|lt?\.?|milligrams?|mgs?\.?|milliliters?|mls?\.?|pieces?|pcs?\.?|pinche?s?|slices?|sticks?|small|sm\.?|medium|med\.?|large|lg\.?)(?!\S)/i
    //One group is captured: the unit (without ending period, if any)
    const unitMatch = ingredientStringWithoutQuantityAndUnit.match(unitRegex);
    if(!packageMatch && unitMatch) {
        unitStringLength = unitMatch[0].length;
        unitStringStart = unitMatch.index;
        
        measurement.unit = unitMap.get(unitMatch[1].replace(".", "").toLowerCase().trim());
        ingredientStringWithoutQuantityAndUnit = ingredientStringWithoutQuantityAndUnit.slice(0, unitStringStart).trim() + (unitStringStart > 0 ? " " : "") + ingredientStringWithoutQuantityAndUnit.substring(unitStringStart + unitStringLength).trim();
    }

    //If string begins with preposition 'of', remove it
    ingredientStringWithoutQuantityAndUnit = ingredientStringWithoutQuantityAndUnit.replace(/^of\s/, "");

    const conversionRegex = /^(\(|\/)\s*(\d+\.?\d*)\s*(\-|to)*\s*(\d+\.?\d*)*\s*(cups?|c\.?|gallons?|gals?\.?|ounces?|oz\.?|pints?|pts?\.?|pounds?|lbs?\.?|quarts?|qts?\.?|tablespoons?|tbsp?n?s?\.?|teaspoons?|tspn?s?\.?|grams?|g\.?|kilograms?|kgs?\.?|liters?|lt?\.?|milligrams?|mgs?\.?|milliliters?|mls?\.?|pieces?|pcs?\.?|pinche?s?|pieces?|pcs?\.?|slices?|sticks?)(\)?)/;
    let conversionMatch, conversionStringLength = 0;
    //Decide if there is a measurement conversion next. Ex: '28 grams /1oz sugar' or '28 g (1 oz.) sugar'
    conversionMatch = ingredientStringWithoutQuantityAndUnit.match(conversionRegex);

    if(conversionMatch) {
        const minQuantity = toNumberFromString(conversionMatch[2]);
        const isRange = conversionMatch[3];
        const maxQuantity = conversionMatch[4] ? toNumberFromString(conversionMatch[4]) : minQuantity;
        //Length of converted measurement quantity portion of string
        conversionStringLength = conversionMatch[0].length;
        
        if(isRange) {
            conversion.isRange = true;
            conversion.quantity = [minQuantity, maxQuantity];
        } else conversion.quantity = minQuantity;

        conversion.unit = unitMap.get(conversionMatch[5].replace(".", "").toLowerCase().trim());

        ingredientStringWithoutQuantityAndUnit = ingredientStringWithoutQuantityAndUnit.substring(conversionStringLength).trim();

        measurements[1] = conversion;
    }

    measurements[0] = measurement;

    return [measurements, ingredientStringWithoutQuantityAndUnit]
}

//TODO: Account for additional info which is before the ingredient name (ex: '1 finely chopped onion')
//Assumes the input begins with the ingredient name and any additional text will be after a ',' or within '(' and ')'.
function extractName(ingredientString) {
    ingredientString = ingredientString.replace(/^of\s/, "").trim();
    const additionalRegex = /s*(,|\()/;
    const additionalMatch = ingredientString.match(additionalRegex);
    if(additionalMatch) return [ingredientString.substring(0, additionalMatch.index).trim(), ingredientString.substring(additionalMatch.index + 1).replace(/\)$/, "").trim()];
    return [ingredientString, null];
}

function parse(ingredientString) {
    const result = {
        name: null,
        measurement: null,
        convertedMeasurement: null,
        additional: null
    }

    const [[measurement, converted], restOfIngredientString] = extractMeasurement(ingredientString);
    result.measurement = measurement;
    result.convertedMeasurement = converted;

    const [name, additionalDetails] = extractName(restOfIngredientString);
    result.name = name;
    result.additional = additionalDetails;

    return result;
}

exports.parse = parse;
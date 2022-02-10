//Accepts a string that contains only numbers and possibly a single slash('/') and returns the value as a number
//Ex: toNumberString('2') => 2
//Ex: toNumberString('1/2') => 0.5
function toNumberFromString(numberString) {
    if(!numberString) return 0;
    const [numer, denom] = numberString.split('/');
    const numerator = Number(numer);
    const denominator = Number(denom ? denom : 1);

    if(numerator === NaN || denominator === NaN) return NaN;

    return Number((numerator / denominator).toFixed(3)); 
}

function convertUnicodeFractions(string) {
    const unicodeFractionRegex = /[\u00BC-\u00BE\u2150-\u215E]/g;
    const unicodeFractions = string.matchAll(unicodeFractionRegex);
    let convertedString = string;
    
    if(unicodeFractions) {
        for(let fraction of unicodeFractions) {
            const unicode = fraction[0];
            const normalized = unicode.normalize('NFKC');
            convertedString = convertedString.replace(unicode, normalized);
        }
    }
    return cleanString(convertedString);
}

function cleanString(string) {
    const cleaned = string
        .replace(/&nbsp;/g, ' ') //TODO: Consider other HTML Entities
        .replace(/⁄/g, '/') //TODO: Account for all characters slash-like
        .replace(/ /g, " ") //TODO: Account for all characters space-like
        .replace(/–/g, '-') //TODO: Account for all characters dash-like

    return cleaned;
}

module.exports = { toNumberFromString, convertUnicodeFractions, cleanString };
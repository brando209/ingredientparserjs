const unicodeFractionRegex = /[\u00BC-\u00BE\u2150-\u215E]/g;
const unicodeSpaceRegex = /[\u00a0\u1680\u2002-\u200b\u202f\u205f\u3000\ufeff]/g;
const unicodeSlashRegex = /[\u0337\u0338\u2044\u2215\uff0f]/g;
const unicodeDashRegex = /[\u00ad\u058a\u2010\u2011\u2043\u207b\u208b\ufe63\uff0d\u2012-\u2015\u2e3a\u2e3b\ufe58\u02d7\u2212\u2796\ufe63\uff0d]/g;
const htmlEntitiesRegex = /&(nbsp|lt|gt|amp|quot|apos|copy|reg|frac(?:12|13|14|15|16|17|18|23|25|34|35|38|45|56|58|78));/g;

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
    const htmlEntityConverstion = {
        '&nbsp;': " ",
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&quot;': '"',
        '&apos;': "'",
        '&copy;': '©',
        '&reg;': '®',
        '&frac12;': '1/2',
        '&frac13;': '1/3',
        '&frac14;': '1/4',
        '&frac15;': '1/5',
        '&frac16;': '1/6',
        '&frac17;': '1/7',
        '&frac18;': '1/8',
        '&frac23;': '2/3',
        '&frac25;': '2/5',
        '&frac34;': '3/4',
        '&frac35;': '3/5',
        '&frac38;': '3/8',
        '&frac45;': '4/5',
        '&frac56;': '5/6',
        '&frac58;': '5/8',
        '&frac78;': '7/8',
    };
    return string
        .replace(unicodeSlashRegex, '/')
        .replace(unicodeSpaceRegex, " ")
        .replace(unicodeDashRegex, '-')
        .replace(htmlEntitiesRegex, match => htmlEntityConverstion[match]);
}

module.exports = { toNumberFromString, convertUnicodeFractions, cleanString };
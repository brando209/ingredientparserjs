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

module.exports = { toNumberFromString };
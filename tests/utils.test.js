const { toNumberFromString, convertUnicodeFractions, cleanString } = require('../src/utils');

describe('toNumberFromString(string)', () => {
    test('Returns correct number when input string contains whole number', () => {
        expect(toNumberFromString('0')).toEqual(0);
        expect(toNumberFromString('1')).toEqual(1);
        expect(toNumberFromString('32')).toEqual(32);
        expect(toNumberFromString('298')).toEqual(298);
    });
    test('Returns correct number when input string contains fraction', () => {
        expect(toNumberFromString('0/2')).toEqual(0);
        expect(toNumberFromString('1/2')).toEqual(0.5);
        expect(toNumberFromString('3/4')).toEqual(0.75);
        expect(toNumberFromString('1/10')).toEqual(0.1);
        expect(toNumberFromString('4/5')).toEqual(0.8);
        expect(toNumberFromString('5/4')).toEqual(1.25);
    });
    test('Returns correct number when input string contains decimal', () => {
        expect(toNumberFromString('0.0')).toEqual(0);
        expect(toNumberFromString('1.5')).toEqual(1.5);
        expect(toNumberFromString('2.25')).toEqual(2.25);
        expect(toNumberFromString('3.2')).toEqual(3.2);
    });
    test('Returns NaN when input string contains characters other than digits or "/"', () => {
        expect(toNumberFromString('3D')).toEqual(NaN);
        expect(toNumberFromString('3-4')).toEqual(NaN);
        expect(toNumberFromString('3rd')).toEqual(NaN);
        expect(toNumberFromString('1&1/2')).toEqual(NaN);
        expect(toNumberFromString('9(8)')).toEqual(NaN);
        expect(toNumberFromString('1,2')).toEqual(NaN);
        expect(toNumberFromString('1,2,3')).toEqual(NaN);
        expect(toNumberFromString('ABC')).toEqual(NaN);
        expect(toNumberFromString('1 1/2')).toEqual(NaN);
        expect(toNumberFromString('1 2 3')).toEqual(NaN);
        expect(toNumberFromString('1.5 2')).toEqual(NaN);
    });
});

describe('cleanString(string)', () => {
    test("Cleans common HTML Entities", () => {
        expect(cleanString('A&nbsp;Bug&nbsp;In&nbsp;The&nbsp;Water')).toMatch('A Bug In The Water');
        expect(cleanString('Someones&apos; house')).toMatch("Someones' house");
        expect(cleanString('This&nbsp;&gt;&nbsp;that')).toMatch("This > that");
        expect(cleanString('That&nbsp;&lt;&nbsp;this')).toMatch("That < this");
        expect(cleanString('A book titled &quot;Regular Expressions&quot;')).toMatch('A book titled "Regular Expressions"');
        expect(cleanString('Copyright&copy;')).toMatch('Copyright??');
        expect(cleanString('Registered Trademark&reg;')).toMatch('Registered Trademark??');
    });
    test('Cleans "space-like" characters', () => {
        expect(cleanString('Uncommon space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
        expect(cleanString('Uncommon???space')).toMatch('Uncommon space');
    });
    test('Cleans "slash-like" characters', () => {
        expect(cleanString('Uncommon??slash')).toMatch('Uncommon/slash')
        expect(cleanString('Uncommon??slash')).toMatch('Uncommon/slash')
        expect(cleanString('Uncommon???slash')).toMatch('Uncommon/slash')
        expect(cleanString('Uncommon???slash')).toMatch('Uncommon/slash')
        expect(cleanString('Uncommon???slash')).toMatch('Uncommon/slash')
    });
    test('Cleans "hyphen-like" characters', () => {        
        expect(cleanString('Uncommon??hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon??hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
        expect(cleanString('Uncommon???hyphen')).toMatch('Uncommon-hyphen');
    });
});

describe('convertUnicodeFractions(string)', () => {
    test('Single unicode fraction is correctly converted', () => {
        expect(convertUnicodeFractions('??')).toMatch('1/2');
        expect(convertUnicodeFractions('???')).toMatch('1/3');
        expect(convertUnicodeFractions('???')).toMatch('2/3');
        expect(convertUnicodeFractions('??')).toMatch('1/4');
        expect(convertUnicodeFractions('??')).toMatch('3/4');
        expect(convertUnicodeFractions('???')).toMatch('1/5');
        expect(convertUnicodeFractions('???')).toMatch('2/5');
        expect(convertUnicodeFractions('???')).toMatch('3/5');
        expect(convertUnicodeFractions('???')).toMatch('4/5');
        expect(convertUnicodeFractions('???')).toMatch('1/6');
        expect(convertUnicodeFractions('???')).toMatch('5/6');
        expect(convertUnicodeFractions('???')).toMatch('1/7');
        expect(convertUnicodeFractions('???')).toMatch('1/8');
        expect(convertUnicodeFractions('???')).toMatch('3/8');
        expect(convertUnicodeFractions('???')).toMatch('5/8');
        expect(convertUnicodeFractions('???')).toMatch('7/8');
        expect(convertUnicodeFractions('???')).toMatch('1/9');
        expect(convertUnicodeFractions('???')).toMatch('1/10');
    });
    test('Multiple unicode fractions are correctly converted', () => {
        expect(convertUnicodeFractions('??? - ??')).toMatch('1/3 - 1/2');
        expect(convertUnicodeFractions('???, ???, or ???')).toMatch('2/3, 3/5, or 5/8');
        expect(convertUnicodeFractions('?? to ??')).toMatch('1/4 to 1/2');
        expect(convertUnicodeFractions('?? plus ??, or just ??')).toMatch('1/4 plus 1/2, or just 1/2');
        expect(convertUnicodeFractions('?? with some text in between ???')).toMatch('3/4 with some text in between 7/8');
    });
});
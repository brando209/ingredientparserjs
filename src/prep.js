const preparedStates = [
    'chopped',
    'diced',
    'grated',
    'ground',
    'minced',
    'peeled',
    'sliced',
    'whole',
]

const preparedAdjectives = [
    'coarsly',
    'finely',
    'roughly',
    'thinly',
]

const preparedRegex = new RegExp(`^((?:${preparedAdjectives.join('|')})?\\s*(?:${preparedStates.join('|')})),?\\s+`, 'i');

module.exports = { preparedRegex }
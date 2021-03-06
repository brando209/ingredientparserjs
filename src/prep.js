const preparedStates = [
    'chopped',
    'diced',
    'grated',
    'ground',
    'julienned',
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
    'freshly'
]

const preparedRegex = new RegExp(`^((?:${preparedAdjectives.join('|')})?\\s*(?:${preparedStates.join('|')})),?\\s+`, 'i');

module.exports = { preparedRegex }
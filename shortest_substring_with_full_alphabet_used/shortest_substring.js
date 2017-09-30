#!/usr/bin/env node

let VERBOSE = 0;
let DEFAULT_FILE = 'random.txt'
let inputFile = process.argv[2]
if (!inputFile) {
    console.error('No input file, assuming ' + DEFAULT_FILE)
    inputFile = DEFAULT_FILE
}

let fs = require('fs')
let INPUT_STR = fs.readFileSync(inputFile, 'utf8').trim()
let INPUT_ARR = INPUT_STR.split('')
let ALPHABET_ARR = INPUT_ARR.slice().sort().filter((elem, idx, arr) => idx == 0 || arr[idx] != arr[idx - 1])

//console.log(ALPHABET_ARR)
//console.log(INPUT_ARR)

let INPUT_LEN = INPUT_ARR.length;
let ALPHABET_LEN = ALPHABET_ARR.length;

let START_TIME = Date.now()

function visualize(i, j) {
    var matchLen = (j - i + 1);
    var matchedSubstring = INPUT_ARR.slice(i, j + 1).join('')

    if (VERBOSE >= 2) {
        console.log(INPUT_STR);

        //var asterisks = ' '.repeat(i) + '*' + ' '.repeat(j - i - 1) + '*'
        var asterisks = ' '.repeat(i) + '*'.repeat(j - i + 1)

        console.log(asterisks + ' len = ' + matchLen)
    }

    console.log('len: ' + matchLen + ', startPos: ' + i + ', substring: "' + matchedSubstring + '"')
    console.log()
}

function main() {
    if (VERBOSE >= 1) {
        console.log(INPUT_STR)
    }
    console.log('Input length: ' + INPUT_LEN)
    console.log('Alphabet length: ' + ALPHABET_LEN)
    console.log()
    console.log("-------------------------------------")
    console.log()

    var [i, j] = findBestMatch();
    if (i == -1) {
        console.log('No match found!')
    } else {
        console.log('Finished, best match is:')
        visualize(i, j)

        let diffMs = Date.now() - START_TIME
        console.log('Took ' + diffMs + ' milliseconds')
    }
}

function findBestMatch() {
    var match = findLeftOptimizedFirstMatch()
    if (!match) {
        return [-1, -1]
    }

    return findBestMatchFromStartingMatch(match[0], match[1])
}

function findBestMatchFromStartingMatch(leftIdx, rightIdx) {
    if (lenOfArr(leftIdx, rightIdx) == ALPHABET_LEN) {
        console.log('Match length is equal to alphabet length, can not do any better!')
        return [leftIdx, rightIdx]
    }

    // [p----------q]
    var matchLen = lenOfArr(leftIdx, rightIdx)

    var leftMostChar = INPUT_ARR[leftIdx]
    var p2 = findFirstOccurrenceAfterIndex(leftMostChar, rightIdx)
    if (p2 == -1) {
        console.log('Impossible to find a better match anymore!')
        return [leftIdx, rightIdx]
    } else if (lenOfArr(rightIdx, p2) > matchLen) {
        // [q       M----------p2]
        // if there's a better match, of length < matchLen
        // it must contain a "P" from index p2        // or right from there
        var minimumLeftIdxIfBetterMatchPossible = p2 - matchLen
        return tryFindingBetterThan(matchLen, leftIdx, rightIdx, minimumLeftIdxIfBetterMatchPossible)
    } else {
        // [<---q  p2--->]
        // actuallt the same result
        var minimumLeftIdxIfBetterMatchPossible = p2 - matchLen
        return tryFindingBetterThan(matchLen, leftIdx, rightIdx, minimumLeftIdxIfBetterMatchPossible)
    }
}

function tryFindingBetterThan(matchLen, leftIdx, rightIdx, minimumLeftIdx) {
    // look only at windows of length matchLen - 1, starting from minimumLeftIdx or farther right
    // once it's established as a match, shrinkLeft()
    // then do again findBestMatchFromStartingMatch()
    var i = leftIdx + 2 // must be shorter than current best match
    var soughtLen = matchLen - 1;
    while (i + soughtLen < INPUT_LEN) {
        var j = i + soughtLen - 1;
        if (isMatchInclusive(i, j)) {
            if (VERBOSE >= 1) {
                console.log('Found better match!')
                visualize(i, j)
            }

            var betterIdxLeft = shrinkMatchLeftInclusive(i, j)
            if (VERBOSE >= 1) {
                console.log('Left-optimized it:')
                visualize(betterIdxLeft, j)
            }

            return findBestMatchFromStartingMatch(betterIdxLeft, j)
        } else {
            ++i
        }
    }

    return [leftIdx, rightIdx]
}

function lenOfArr(idxLeft, idxRight) {
    return idxRight - idxLeft + 1
}

/**
 * @return {Int} the idxRight (inclusive) of the matching slice's right side, or -1 if not found
 */
function findFirstMatch() {
    var idxRight = ALPHABET_LEN - 1;
    while (idxRight < INPUT_LEN) {
        if (isMatchInclusive(0, idxRight)) {
            return idxRight
        } else {
            ++idxRight
        }
    }

    return -1
}

function findLeftOptimizedFirstMatch() {
    var rightIdx = findFirstMatch()
    if (rightIdx == -1) {
        console.log('No match!')
        return false
    } else {
        if (VERBOSE >= 1) {
            console.log('First match found!')
            visualize(0, rightIdx)
        }

        var betterIdxLeft = shrinkMatchLeftInclusive(0, rightIdx)
        if (VERBOSE >= 1) {
            console.log('Optimized first match:')
            visualize(betterIdxLeft, rightIdx)
        }
        return [betterIdxLeft, rightIdx]
    }
}
/*
 * @param {Int} idxLeft Inclusive start of the matching sliding window
 * @param {Int} idxRight Inclusive end of the matching sliding window
 * @return {Int} new idxLeft
 */
function shrinkMatchLeftInclusive(idxLeft, idxRight) {
    var i = idxLeft

    var leftMostChar = INPUT_ARR[idxLeft]
    betterOccurrence = findFirstOccurrenceBetweenIndicesInclusive(leftMostChar, i + 1, idxRight)
    if (betterOccurrence == -1) {
        return i
    } else {
        return shrinkMatchLeftInclusive(idxLeft + 1, idxRight)
    }
}

function isMatchInclusive(idxLeft, idxRight) {
    let clone = INPUT_ARR.slice(idxLeft, idxRight + 1)
    clone = clone.sort().filter((elem, idx, arr) => idx == 0 || arr[idx] != arr[idx - 1])
    return clone.length == ALPHABET_LEN
}

function findFirstOccurrenceAfterIndex(letter, idx) {
    return findFirstOccurrenceBetweenIndicesInclusive(letter, idx + 1, INPUT_LEN - 1)
}

function findFirstOccurrenceBetweenIndicesInclusive(letter, idxLeft, idxRight) {
    for (var i = idxLeft; i <= idxRight; ++i) {
        if (INPUT_ARR[i] === letter) {
            return i
        }
    }
    return -1

}

main()
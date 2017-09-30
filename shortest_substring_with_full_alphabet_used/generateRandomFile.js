#!/usr/bin/env node

let fs = require('fs')
let FILE_NAME = 'random.txt'
let LENGTH = process.argv[2] || 160
let ALPHABET = process.argv[3] || 'abcdef'

var min = 0
var max = ALPHABET.length

var contents = new Array(LENGTH)
for (var i = 0; i < LENGTH; i++) {
    var rand = Math.floor(Math.random() * (max - min)) + min
    contents[i] = ALPHABET[rand]
}

fs.writeFileSync(FILE_NAME, contents.join(''))
/* jshint node: true, esversion: 6, unused: true, undef: true */

const fs = require('fs');
const version = require('../package.json').version;

const boilerplatePath = 'js/boilerplate.js';

let boilerplateSrc = fs.readFileSync( boilerplatePath, 'utf8' );

boilerplateSrc = boilerplateSrc.replace( /\n \* Zdog v\d+\.\d+\.\d+/,
    `\n * Zdog v${version}` );

fs.writeFileSync( boilerplatePath, boilerplateSrc, 'utf8' );

console.log(`updated ${boilerplatePath} to ${version}`);

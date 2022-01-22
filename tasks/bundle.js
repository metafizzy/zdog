const fs = require('fs');
const execSync = require('child_process').execSync;

// get file paths from index.js
const indexPath = 'js/index.js';
let indexSrc = fs.readFileSync( `./${indexPath}`, 'utf8' );
let cjsBlockRegex = /module\.exports = factory\([\w ,'.\-()/\n]+;/i;
let cjsBlockMatch = indexSrc.match( cjsBlockRegex );
let paths = cjsBlockMatch[0].match( /require\('([.\-/\w]+)'\)/gi );

paths = paths.map( function( path ) {
  return path.replace( "require('.", 'js' ).replace( "')", '.js' );
} );
paths.push( indexPath );

execSync(`cat ${paths.join(' ')} > dist/zdog.dist.js`);

console.log('bundled dist/zdog.dist.js');

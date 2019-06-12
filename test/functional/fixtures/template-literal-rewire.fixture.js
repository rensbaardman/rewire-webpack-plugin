const rewire = require('rewire');
const lib_name = 'empty'
const my_lib = rewire(`./${lib_name}.fixture.js`);

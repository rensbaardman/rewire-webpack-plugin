rewire-webpack-plugin
=====
**Use [rewire](https://github.com/jhnns/rewire) in webpack bundles**.

<!-- [![Dependency Status](http://david-dm.org/jhnns/rewire-webpack/status.svg)](http://david-dm.org/jhnns/rewire-webpack) -->

This is a plugin that enables [rewire](https://github.com/jhnns/rewire) for client-side bundles generated by [webpack](https://github.com/webpack/webpack).

<!-- [![npm status](https://nodei.co/npm/rewire-webpack.svg?downloads=true&stars=true)](https://npmjs.org/package/rewire-webpack) -->

Installation
------------

_**note:** not published to `npm` yet!_

Following will install from Github repo:

`npm install rensbaardman/rewire-webpack-plugin`

Configuration
------------

Add the RewireWebpackPlugin to the webpack config:

```javascript
// webpack.config.js

var RewireWebpackPlugin = require("rewire-webpack-plugin");
var webpackConfig = {
    plugins: [
        new RewireWebpackPlugin()
    ]
};
```

After that you can use `rewire()` in your client-side bundles as usual.

Limitations
-----------

- The variable in which you load rewire has to be named `rewire`:

	```javascript
	const rewire = require('rewire');
	```

	Anything else (e.g. `const my_favorite_rewire = require('rewire')`) will not work.

	It *is* possible to use either `var`, `let`, or `const`.

- The argument to `rewire()` has to be a string, not a variable:

	```javascript
	const rewire = require('rewire');
	const my_lib = rewire('./src/my_lib.js');
	```

	Using variables or string templates won't work:

	```javascript
	const rewire = require('rewire');

	// this won't work
	const path_to_lib = './src/my_lib.js;'
	const my_lib = rewire(path_to_lib);

	// this won't work either
	const lib_name = 'my_lib';
	const my_lib2 = rewire(`./src/${lib_name}.js`);
	```

	It will generate the error `__webpack_require__.m[module] is undefined`.

See also [rewire limitations](https://github.com/jhnns/rewire#limitations)

Contribution
------------

This is a fork of [jhnns/rewire-webpack](https://github.com/jhnns/rewire-webpack), which was based on contributions from [sokra](https://github.com/sokra).
This fork contains updates from [dribba/rewire-webpack](https://github.com/dribba/rewire-webpack).
Both have been published under the [Unlicense.](http://unlicense.org/)

License
-------

MIT

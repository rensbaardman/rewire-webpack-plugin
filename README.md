rewire-webpack-plugin
=====================
*Webpack plugin to enable [rewire](https://github.com/jhnns/rewire) in webpack bundles*

This is a fork of [rewire-webpack](https://github.com/jhnns/rewire-webpack) that adds support for webpack 4.

Installation
------------

```
npm install --save-dev rewire-webpack-plugin
```


Usage
-----

Add the plugin in the webpack config:

```javascript
// webpack.config.js

const RewireWebpackPlugin = require("rewire-webpack-plugin");
module.exports = {

	// ...

	plugins: [
		new RewireWebpackPlugin()
	]
};
```

After that you can use `rewire()` in your scripts as usual, and webpack will happily bundle them.


Limitations
-----------

- The variable in which you load rewire has to be named `rewire`:

    ```javascript
    const rewire = require('rewire');
    ```

    Anything else (e.g. `const my_favorite_rewire = require('rewire')`) will not work.

    It is possible to declare with either `var`, `let`, or `const`.

- The argument to `rewire()` has to be a string, not a variable:

    ```javascript
    const rewire = require('rewire');
    const my_lib = rewire('./src/my_lib.js');
    ```

    Using variables or string templates won't work:

    ```javascript
    const rewire = require('rewire');

    // this won't work
    const path_to_lib = './src/my_lib.js';
    const my_lib = rewire(path_to_lib);

    // this won't work either
    const lib_name = 'my_lib';
    const my_lib2 = rewire(`./src/${lib_name}.js`);
    ```

    In the last two cases, the emitted bundle will throw the error `__webpack_require__.m[module] is undefined`.

See also [rewire limitations](https://github.com/jhnns/rewire#limitations), and see the [wiki on troubleshooting](https://github.com/rensbaardman/rewire-webpack-plugin/wiki) for more potential errors and their solutions.


Developing
----------

#### Clone the repository

```
git clone https://github.com/rensbaardman/rewire-webpack-plugin.git
cd rewire-webpack-plugin
```

#### Install dependencies

```
npm install
```
Note that Chrome and Firefox are needed to run some of the tests in the browser. If they haven't been installed, running `npm install` should install them too.

#### Running tests

There are four types of tests:

- `npm run test:unit` - unit tests, runs in Node
- `npm run test:functional` - functional tests, runs in Node
- `npm run test:shared` - the shared rewire test case, which verifies that the version of rewire included in the webpack bundle is compatible with the default rewire implementation. This test runs in the browser with [Karma](https://karma-runner.github.io/) as test runner.
- `npm run test:installation` - installation tests, to make sure publishing the package would result in a working version of the plugin (e.g. to check that the correct files are included, and that installating doesn't generate any unexpected errors)

`npm test` will run all the four types of tests sequentially.

<!-- #### Releasing -->

<!-- todo -->
<!-- ```
npm run release
```

use [np](https://github.com/sindresorhus/np) -->

Credits
-------

This is a fork of [jhnns/rewire-webpack](https://github.com/jhnns/rewire-webpack), which was based on contributions from [sokra](https://github.com/sokra).
This fork contains updates from [dribba/rewire-webpack](https://github.com/dribba/rewire-webpack).
Both have been published under the [Unlicense.](http://unlicense.org/)

Substantial parts of the code base are based on [rewire](https://github.com/jhnns/rewire) itself, which is published under the MIT license.


License
-------

rewire-webpack-plugin is licensed under the [MIT License.](LICENSE)

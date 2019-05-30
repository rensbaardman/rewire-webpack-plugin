// Karma will load RewireWebpackPlugin.test.js, compile it with Webpack,
// then run it with Mocha in the browsers, and report back on the results
// of the tests.

const webpack_config = require('./rewire-shared-test-cases.webpack.config.js')

module.exports = function(config) {
	config.set({

		files: ['RewireWebpackPlugin.test.js'],

		frameworks: ['mocha'],
		reporters: ['mocha'],

		preprocessors: { 'RewireWebpackPlugin.test.js': ['webpack'] },
		webpack: webpack_config,

		browsers: ['Firefox', 'Chrome'],
		singleRun: true

	});
};

// These tests only check that the plugin can be used,
// true 'functional' correctness is checked in the shared
// rewire test cases.

const assert = require('chai').assert;
const webpack = require('webpack');
const MemoryFS = require('memory-fs');

const RewireWebpackPlugin = require('../../lib/RewireWebpackPlugin.js');


function generate_test_configuration(filename) {
	const configuration = {
		entry: `./test/functional/fixtures/${filename}.fixture.js`,
		mode: 'development',
		plugins: [new RewireWebpackPlugin()]
	};

	return configuration
}

function generate_webpack_compiler(fixture_name) {

	const configuration = generate_test_configuration(fixture_name);
	const compiler = webpack(configuration);

	// use an in-memory filesystem to prevent output
	// of bundle on disk
	const fs = new MemoryFS();
	compiler.outputFileSystem = fs;

	return compiler
}

function assert_no_webpack_errors(err, stats) {
	assert.equal(err, null);
	assert.equal(stats.hasErrors(), false);
	assert.equal(stats.hasWarnings(), false);
}


describe('RewireWebpackPlugin.js', function() {

	it('can be used as a webpack plugin', function(done) {

		const compiler = generate_webpack_compiler('empty')

		compiler.run((err, stats) => {
			assert_no_webpack_errors(err, stats)
			done();
		});

	})

	it("when used as a webpack plugin, it doesn't error on requiring 'rewire'", function(done) {

		const compiler = generate_webpack_compiler('require-rewire')

		compiler.run((err, stats) => {
			assert_no_webpack_errors(err, stats)
			done();
		});

	})

	it("when used as a Webpack plugin, webpack doesn't throw DeprecationWarnings", function() {
		assert.fail('complete this test')
	})

})

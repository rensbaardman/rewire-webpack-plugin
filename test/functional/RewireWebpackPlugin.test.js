// These tests only check that the plugin can be used,
// true 'functional' correctness is checked in the shared
// rewire test cases.

const assert = require('chai').assert;
const MemoryFS = require('memory-fs');
const vm = require('vm');

const webpack = require('webpack');
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
	assert.equal(stats.hasWarnings(), false);
	assert.equal(stats.hasErrors(), false);
}

function eval_asset(stats) {
	const emitted_src = stats.compilation.assets['main.js']._cachedSource
	// necessary to run the browser-versions (where window is the global object)
	const context = {
		window: global
	}
	return vm.runInNewContext(emitted_src, context)
}


describe('RewireWebpackPlugin.js', function() {

	it('can be used as a webpack plugin', function(done) {
		const compiler = generate_webpack_compiler('empty');
		compiler.run((err, stats) => {
			assert_no_webpack_errors(err, stats)
			done();
		});
	})

	it("does not error on requiring 'rewire'", function(done) {
		const compiler = generate_webpack_compiler('require-rewire');
		compiler.run((err, stats) => {
			assert_no_webpack_errors(err, stats)
			done();
		});
	})


	it('generates a bundle without errors when rewire() is called with a static absolute path argument', (done) => {
		compiler = generate_webpack_compiler('static-rewire-absolute-string');
		compiler.run((err, stats) => {
			assert_no_webpack_errors(err, stats)
			try {
				eval_asset(stats)
			}
			catch (err) {
				assert.fail(`should not error, but encountered: ${err.name} - ${err.message}`)
			}
			done()
		});
	})

	it('generates a bundle without errors when rewire() is called with a static module name argument', (done) => {
		compiler = generate_webpack_compiler('static-rewire-module-string');
		compiler.run((err, stats) => {
			assert_no_webpack_errors(err, stats)
			try {
				eval_asset(stats)
			}
			catch (err) {
				assert.fail(`should not error, but encountered: ${err.name} - ${err.message}`)
			}
			done()
		});
	})

	// next tests do not test 'desiredd' functionality, but assert that certain things
	// aren't (yet) possible. This is explained in the README.

	it('generates a bundle with a TypeError when rewire() is called with a dynamic absolute path argument', (done) => {
		const compiler = generate_webpack_compiler('dynamic-rewire-absolute-string');
		compiler.run((err, stats) => {
			// the compilation itself should be error-free
			assert_no_webpack_errors(err, stats)
			try {
				eval_asset(stats)
				assert.fail("Expected eval_asset(stats) to throw a TypeError, but it didn't")
			}
			catch (err) {
				assert.equal(err.name, 'TypeError')
				assert.equal(err.message, "Cannot read property 'call' of undefined")
				const last_call = err.stack.split('\n')[1].trim()
				assert.equal(last_call, "__webpack_require__.m[moduleId].call(")
				const location = err.stack.split('\n')[5].trim()
				assert.equal(location, "at rewire (webpack:///./lib/rewire.web.js?:16:34)")
			}
			done()
			});
	})

	it('generates a bundle with a TypeError when rewire() is called with a dynamic module name argument', (done) => {
		const compiler = generate_webpack_compiler('dynamic-rewire-module-string');
		compiler.run((err, stats) => {
			// the compilation itself should be error-free
			assert_no_webpack_errors(err, stats)
			try {
				eval_asset(stats)
				assert.fail("Expected eval_asset(stats) to throw a TypeError, but it didn't")
			}
			catch (err) {
				assert.equal(err.name, 'TypeError')
				assert.equal(err.message, "Cannot read property 'call' of undefined")
				const last_call = err.stack.split('\n')[1].trim()
				assert.equal(last_call, "__webpack_require__.m[moduleId].call(")
				const location = err.stack.split('\n')[5].trim()
				assert.equal(location, "at rewire (webpack:///./lib/rewire.web.js?:16:34)")
			}
			done()
			});
	})

	it('generates a bundle with a TypeError when rewire() is called with a template literal argument', (done) => {
		const compiler = generate_webpack_compiler('template-literal-rewire');
		compiler.run((err, stats) => {
			// the compilation itself should be error-free
			assert_no_webpack_errors(err, stats)
			try {
				eval_asset(stats)
				assert.fail("Expected eval_asset(stats) to throw a TypeError, but it didn't")
			}
			catch (err) {
				assert.equal(err.name, 'TypeError')
				assert.equal(err.message, "Cannot read property 'call' of undefined")
				const last_call = err.stack.split('\n')[1].trim()
				assert.equal(last_call, "__webpack_require__.m[moduleId].call(")
				const location = err.stack.split('\n')[5].trim()
				assert.equal(location, "at rewire (webpack:///./lib/rewire.web.js?:16:34)")
			}
			done()
			});
	})

})

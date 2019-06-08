// This is a sanity check to make sure all dependencies
// have been declared properly, we are packing all relevant files,
// and installation ('npm install rewire-webpack-plugin') goes smoothly.

const assert = require('chai').assert;
const package = require('../../package.json')

const { create_installation,
		install,
		delete_installation,
		run_shared_test_cases } = require('./install_utils.js');


describe('RewireWebpackPlugin', function () {

	// installing webpack can take up to ~20-40 s.
	this.timeout(60000);

	before(create_installation)
	after(delete_installation)

	it('when installed without webpack and rewire, it should error', async () => {
		let errors = await install('test-clean-install', [])
		let expected_errors = [
			`npm WARN rewire-webpack-plugin@${package.version} requires a peer of webpack@>=4.16.0 but none is installed. You must install peer dependencies yourself.`,
			`npm WARN rewire-webpack-plugin@${package.version} requires a peer of rewire@>=2.5.1 but none is installed. You must install peer dependencies yourself.`
		]
		assert.deepEqual(errors, expected_errors)
	})

	it('when installed with webpack and rewire, it shouldnt give any unexpected errors', async () => {
		let errors = await install('test-install-webpack-rewire', ['webpack', 'rewire'])
		assert.deepEqual(errors, [])
	})

	it('when installed with minimum requirements webpack and rewire, it shouldnt give any unexpected errors', async () => {
		let errors = await install('test-install-webpack-rewire-minimum', ['webpack@4.16', 'rewire@2.5.1'])
		assert.deepEqual(errors, [])
	})

	it('when installed with webpack and rewire, the shared test cases pass', async () => {
		await install('test-shared-cases', ['webpack', 'rewire', 'karma', 'karma-webpack@4.0.0-rc.6', 'karma-firefox-launcher', 'karma-chrome-launcher', 'mocha', 'mocha-loader', 'karma-mocha', 'karma-mocha-reporter'])
		await run_shared_test_cases('test-shared-cases')
	})

	it('when installed with minimum requirements webpack and rewire, the shared test cases pass', async () => {
		await install('test-shared-cases-minimum', ['webpack@4.16', 'rewire@2.5.1', 'karma', 'karma-webpack@4.0.0-rc.6', 'karma-firefox-launcher', 'karma-chrome-launcher', 'mocha', 'mocha-loader', 'karma-mocha', 'karma-mocha-reporter'])
		await run_shared_test_cases('test-shared-cases-minimum')
	})

})

// refactoring ideas:
// -- move error filtering to test file (more explicit in expected errors)
// -- maybe just checking for declared peerdependencies in package.json is more than enough for getting these peerdependency errors
// -- programmatically extract webpack@4.16 and rewire@2.5.1 -- maybe I will change requirements
// -- better error handling in run_shared_test_cases()

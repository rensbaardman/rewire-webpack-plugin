const RewireWebpackPlugin = require('../../lib/RewireWebpackPlugin.js')
const assert = require('chai').assert;

describe('class RewireWebpackPlugin', function() {

	it('is a function/class', function() {
		assert.equal(typeof(RewireWebpackPlugin), "function")
	})

	it("has a prototype method 'apply'", function() {
		assert.equal(typeof(RewireWebpackPlugin.prototype.apply), "function")
	})

	it("'apply' takes precisely one argument", function() {
		assert.equal(RewireWebpackPlugin.prototype.apply.length, 1)
		})


})

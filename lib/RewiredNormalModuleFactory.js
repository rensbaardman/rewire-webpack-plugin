"use strict";

const path = require("path");

class RewiredNormalModuleFactory {

	// This factory is the normalModuleFactory that gets
	// passed from the initialization in RewireWebpackPlugin.js.
	constructor(factory) {
		this.factory = factory;
	}

	create(data, callback) {

		function onModuleCreate(err, module) {

			if (err) {
				return callback(err);
			}

			// If '(rewired)' is already in userRequest,
			// it means the module has been rewired already.
			// We check this to prevent re-rewiring the module.
			if (module.userRequest.indexOf("(rewired)") === -1) {
				module.request += " (rewired)";
				module.userRequest += " (rewired)";
				// unshift: adds the loader to beginning of array 'module.loaders'
				module.loaders.unshift(path.join(__dirname, "rewire.loader.js"));
				return callback(null, module);
			} else {
				return callback(null, module);
			}

		}

		this.factory.create(data, onModuleCreate);

	}

}

module.exports = RewiredNormalModuleFactory;

// This is a partial reconstruction of '__webpack_require__',
// but then with rewire functionality.
// The AliasPlugin in RewireWebpackPlugin.js swaps out the
// usual rewire requirement for rewire.web.js.
// rewire.web.js then serves as the bundled version of rewire.

"use strict";

function rewire(moduleId) {
	let rewiredModule = {
		id: moduleId,
		loaded: false,
		exports: {}
	};

	__webpack_modules__[moduleId].call(
		rewiredModule.exports,
		rewiredModule,
		rewiredModule.exports,
		__webpack_require__
	);

	rewiredModule.loaded = true;

	return rewiredModule.exports;
}

module.exports = rewire;

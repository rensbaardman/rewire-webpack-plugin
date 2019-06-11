// This is a loader which we apply to all dependencies required with rewire().
// It replicates the working of rewire(), creating a web-compatible
// version that gets bundled instead of the default rewire module.
// RewiredNormalModuleFactory.js adds rewire.loader.js as a loader.

"use strict";

const detectStrictMode = require("rewire/lib/detectStrictMode.js");
const getDefinePropertySrc = require("rewire/lib/getDefinePropertySrc.js");
const path = require("path");
// Work-around to work with cross platform paths.
const pathToGetImportGlobalsSrc =
	require.resolve("rewire/lib/getImportGlobalsSrc.js")
		.split(path.sep)
		.join("/");

// Regex and ESLint-config copied from rewire/lib/moduleEnv.js -
// see caveats over there!
const matchConst = /(^|\s|\}|;)const(\/\*|\s|{)/gm
const eslint = require('eslint')
const linter = new eslint.Linter()
const eslintOptions = {
	env: {
		es6: true,
	},
	parserOptions: {
		ecmaVersion: 6,
		ecmaFeatures: {
			globalReturn: true,
			jsx: true,
			experimentalObjectRestSpread: true
		},
	},
	rules: {
		"no-const-assign": 2
	}
}

//
// replace_const_with_let,
// isNoConstAssignMessage,
// has_const_reassignment,
// & generate_const_reassignment_error
// directly based on rewire/lib/moduleEnv.js
//
function replace_const_with_let(src) {
	// This is a poor man's version of a parser:
	// we want to replace all `const` declarations
	// with `let`, in order to be able to __set__ them.
	// This method with a regex is not perfect, but works well enough,
	// although it doesn't cover one use case: the reassignment of a
	// variable that has been declared with `const`.
	return src.replace(matchConst, "$1let  $2") // replace const with let, while maintaining the column width
}

function isNoConstAssignMessage(message) {
	return message.ruleId === "no-const-assign";
}

function has_const_reassignment(src) {
	// use ESlint to catch const-reassignment errors
	let noConstAssignMessage = linter.verify(src, eslintOptions).find(isNoConstAssignMessage);

	if (noConstAssignMessage !== undefined) {
		return {
			line: noConstAssignMessage.line,
			column: noConstAssignMessage.column
		}
	}
	else {
		return undefined
	}
}

function generate_const_reassignment_error(src, request) {
	let error = has_const_reassignment(src);
	let filename = request.split('!')[1];
	if (error) {
		return `throw new TypeError('Assignment to constant variable at ${ filename }:${ error.line }:${ error.column }');`
	}
	else {
		return ''
	}
}


function rewireLoader(src) {

	const modified_src =
		'/* this line was injected by rewire-webpack-plugin */' +
		// We declare all global variables with a var statement,
		// so they can be changed via __set__()
		// without influencing global objects.
		// The browser uses 'window' as its global scope,
		// so we set that as our 'global' object.
		'var global = window; ' +
		`eval(require('${pathToGetImportGlobalsSrc}')()); ` +

		// The module src is wrapped inside a self-executing function.
		// This is necessary to separate the module src from
		// the preceding eval(importGlobalsSrc),
		// because the module src can be in strict mode.
		// In strict mode eval() can only declare vars in
		// the current scope. In this case our setters and getters
		// won't work.
		// @see https://developer.mozilla.org/en/JavaScript/Strict_mode#Making_eval_and_arguments_simpler
		"(function () { " +

		// If the module uses strict mode, we must ensure that
		// "use strict" stays at the beginning of the function.
		(detectStrictMode(src) ? ' "use strict"; ' : ' ') +

		// adds error if there is a `const`-reassignment
		generate_const_reassignment_error(src, this.request) +
		// adds the source, with all `const`s replaced by `let`s
		replace_const_with_let(src) +

		// Append at least a newline since
		// the source may end with a line comment.
		"\n" +

		// Add the __set__, __get__, and __with__ methods.
		getDefinePropertySrc() +

		" })();";

	return modified_src;
}

module.exports = rewireLoader;

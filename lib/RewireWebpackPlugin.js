"use strict";

const path = require("path");
const AliasPlugin = require("enhanced-resolve/lib/AliasPlugin.js");
const RewiredNormalModuleFactory = require("./RewiredNormalModuleFactory.js");
const RewiredDependency = require("./RewiredDependency.js");

class RewireWebpackPlugin {

	apply(compiler) {
		// Wire our RewiredDependency to our RewiredNormalModuleFactory
		// by decorating the original normalModuleFactory
		// with a custom callback on module creation.
		compiler.hooks.compilation.tap("RewireWebpackPlugin", (compilation, compilationParams) => {
			const normalModuleFactory = compilationParams.normalModuleFactory;
			const rewiredNormalModuleFactory = new RewiredNormalModuleFactory(normalModuleFactory);

			compilation.dependencyFactories.set(RewiredDependency, rewiredNormalModuleFactory);
			compilation.dependencyTemplates.set(RewiredDependency, new RewiredDependency.Template());
		});

		compiler.hooks.compilation.tap("RewireWebpackPlugin", (compilation, compilationParams) => {
			const normalModuleFactory = compilationParams.normalModuleFactory;
			normalModuleFactory.hooks.parser.for('javascript/auto').tap('RewireWebpackPlugin', (parser, options) => {

				// We need to register declarations of '[var/let/const] rewire = ...',
				// since the parser only allows to hook into free variables by default.
				parser.hooks.varDeclaration.for('rewire').tap('RewireWebpackPlugin', (declaration) => {
					return true;
				});

				// Find rewire(request: String) calls and bind our RewiredDependency.
				parser.hooks.call.for('rewire').tap('RewireWebpackPlugin', (expression) => {

					// Ensure only 1 argument is passed to rewire().
					if (expression.arguments.length !== 1) {
						return false;
					}

					// Ensure argument to rewire() is a string.
					const param = parser.evaluateExpression(expression.arguments[0]);
					if (!param.isString()) {
						return false;
					}

					// Add a new dependency to the the dependency graph,
					// with the same arguments as the rewire()-call.
					let dep = new RewiredDependency(param.string, param.range);
					dep.loc = expression.loc;
					parser.state.current.addDependency(dep);

					return true;
				});
			});
		});

		// Modify the resolver so it doesn't bundle the usual version of rewire,
		// but includes the web compatible 'rewire.web.js' instead.
		compiler.hooks.afterResolvers.tap("RewireWebpackPlugin", (compiler) => {

			compiler.resolverFactory.hooks.resolver.for('normal').tap("RewireWebpackPlugin", (resolver, resolveOptions) => {
				const aliasPlugin = new AliasPlugin(
					"described-resolve",
					{
						name: "rewire",
						alias: path.join(__dirname, "rewire.web.js")
					},
					"resolve"
				)
				aliasPlugin.apply(resolver)
			});

		});
	}
};

module.exports = RewireWebpackPlugin;

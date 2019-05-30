"use strict";

const path = require("path");
const AliasPlugin = require("enhanced-resolve/lib/AliasPlugin.js");
const RewiredNormalModuleFactory = require("./RewiredNormalModuleFactory.js");
const RewiredDependency = require("./RewiredDependency.js");

class RewireWebpackPlugin {

    apply(compiler) {
        // wire our RewiredDependency to our RewiredNormalModuleFactory
        // by decorating the original factory
        compiler.hooks.compilation.tap("RewireWebpackPlugin", (compilation, compilationParams) => {
            const normalModuleFactory = compilationParams.normalModuleFactory;
            const rewiredNormalModuleFactory = new RewiredNormalModuleFactory(normalModuleFactory);

            compilation.dependencyFactories.set(RewiredDependency, rewiredNormalModuleFactory);
            compilation.dependencyTemplates.set(RewiredDependency, new RewiredDependency.Template());
        });

        compiler.hooks.compilation.tap("RewireWebpackPlugin", (compilation, compilationParams) => {
            const normalModuleFactory = compilationParams.normalModuleFactory;
            normalModuleFactory.hooks.parser.for('javascript/auto').tap('RewireWebpackPlugin', (parser, options) => {

                // accept "var rewire", elsewise it would not be parsed (as overwritten)
                parser.hooks.varDeclaration.for('rewire').tap('RewireWebpackPlugin', (declaration) => {
                    return true;
                });

                // find rewire(request: String) calls and bind our RewiredDependency
                parser.hooks.call.for('rewire').tap('RewireWebpackPlugin', (expression) => {

                    if (expression.arguments.length !== 1) {
                        return false;
                    }

                    const param = parser.evaluateExpression(expression.arguments[0]);
                    if (!param.isString()) {
                        return false;
                    }

                    let dep = new RewiredDependency(param.string, param.range);
                    dep.loc = expression.loc;
                    parser.state.current.addDependency(dep);

                    return true;
                });
            });
        });

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

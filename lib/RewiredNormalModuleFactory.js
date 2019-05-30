"use strict";

const path = require("path");

class RewiredNormalModuleFactory {

    constructor(factory) {
        this.factory = factory;
    }

    create(data, callback) {

        function onModuleCreate(err, module) {

            if (err) {
                return callback(err);
            }

            // avoid re-rewiring the module
            if (module.userRequest.indexOf("(rewired)") === -1) {
                module.request += " rewired";
                module.userRequest += " (rewired)";
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

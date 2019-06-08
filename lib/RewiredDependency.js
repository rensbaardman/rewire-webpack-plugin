"use strict";

const Dependency = require("webpack/lib/Dependency.js");
const ModuleDependencyTemplateAsId = require("webpack/lib/dependencies/ModuleDependencyTemplateAsId.js")

class RewiredDependency extends Dependency {

	constructor(request, range) {
		super();
		this.request = request;
		this.userRequest = request;
		this.range = range;
	}

	getResourceIdentifier() {
		return `rewire${this.request}`
	}

}

RewiredDependency.Template = ModuleDependencyTemplateAsId;

module.exports = RewiredDependency;

"use strict";

const Dependency = require("webpack/lib/Dependency.js");

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

RewiredDependency.Template = require("webpack/lib/dependencies/ModuleDependencyTemplateAsId.js");

module.exports = RewiredDependency;

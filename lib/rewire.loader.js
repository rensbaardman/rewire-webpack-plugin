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

            src +

            // Append at least a newline since
            // the source may end with a line comment.
            "\n" +

            // Add the __set__, __get__, and __with__ methods.
            getDefinePropertySrc() +

            " })();";

      return modified_src;
}

module.exports = rewireLoader;

// This loads the shared test cases provided by Rewire,
// defined with Mocha.
// We check if the the Webpack bundle generated with
// the plugin conforms to the rewire specced behaviour.
// We run this file in the browser with Karma.

const rewireSharedTestCases = require('../../node_modules/rewire/testLib/sharedTestCases.js')

rewireSharedTestCases()

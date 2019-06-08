// This loads the shared test cases provided by Rewire,
// defined with Mocha.
// We check if the the Webpack bundle generated with
// the plugin conforms to the rewire specced behaviour.
// We run this file in the browser with Karma.

// cannot simply use "require('rewire/testLib/sharedTestCases.js')",
// since webpack cannot interpret that (somehow)
const rewireSharedTestCases = require('../../node_modules/rewire/testLib/sharedTestCases.js')

rewireSharedTestCases()

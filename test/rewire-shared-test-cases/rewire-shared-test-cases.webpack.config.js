const RewireWebpackPlugin = require('../../lib/RewireWebpackPlugin.js')

module.exports = {
	plugins: [new RewireWebpackPlugin()],
	mode: 'development'
}

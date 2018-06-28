const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'src') + '/app/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist') + '/app',
		publicPath: '/app/'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	}
}

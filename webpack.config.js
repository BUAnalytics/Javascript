const path = require('path')
const webpack = require('webpack')
const NodeExternals = require('webpack-node-externals')

module.exports = [{
	
	//Browser
	entry: './src/index.ts',
	target: 'web',
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		path: path.resolve('./dist'),
		filename: './browser.min.js',
		libraryTarget: 'var',
		library: 'BG'
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			comments: false
		})
    ],
	module: {
		rules: [{
			test: /\.ts$/,
			loader: 'ts-loader',
			exclude: /(node_modules|bower_components)/
		}]
	},
	node: {
		console: true,
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
}, {
	
	//Node
	entry: './src/index.ts',
	target: 'node',
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		path: path.resolve('./dist'),
		filename: './module.js',
		libraryTarget: "commonjs"
	},
	externals: [
		new NodeExternals()
	],
	module: {
		rules: [{
			test: /\.ts$/,
			loader: 'ts-loader',
			exclude: /(node_modules|bower_components)/
		}]
	}
}]
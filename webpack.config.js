const path = require("path");

module.exports = {
	mode: "development",
	entry: "./src/filter.js",
	output: {
		filename: "filter.js",
		path: path.resolve(__dirname, "extension")
	},
	resolve: {
		modules: ["node_modules"]
	},
	module: {
		rules: [
			{
				test: /\.(css)$/i,
				loader: "file-loader",
				options: {
					name: "[name].[ext]"
				}
			}
		]
	}
};

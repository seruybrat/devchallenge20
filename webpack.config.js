const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: __dirname + "/src/index.js", // webpack entry point. Module to start building dependency 
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    devServer: {  // configuration for webpack-dev-server
        contentBase: './public',  //source of static assets
        port: 3000, // port to run dev-server
    }
};

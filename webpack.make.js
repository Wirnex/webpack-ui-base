'use strict';

// Modules
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm

module.exports = function makeWebpackConfig (options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    var BUILD = !!options.BUILD;
    var TEST = !!options.TEST;

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    if (TEST) {
        config.entry = {}
    } else {
        config.entry = {
            app: './app/app.js'
        }
    }

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    if (TEST) {
        config.output = {}
    } else {
        config.output = {
            // Absolute output directory
            path: __dirname + '/dist',

            // Output path from the view of the page
            // Uses webpack-dev-server in development
            publicPath: BUILD ? '/' : 'http://localhost:8080/',

            // Filename for entry points
            // Only adds hash in build mode
            filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

            // Filename for non-entry points
            // Only adds hash in build mode
            chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
        }
    }

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (TEST) {
        config.devtool = 'inline-source-map';
    } else if (BUILD) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval';
    }

    const extractCSSPlugin = new ExtractTextPlugin({
        filename: "[name].[hash].css",
        disable: !BUILD
    });

    // Initialize module
    config.module = {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                        plugins: ['transform-runtime']
                    }
                }
            }, {
                test: /\.css$/,
                use: extractCSSPlugin.extract({
                    fallback: 'style-loader',
                    use: [{ loader: 'css-loader', options: { minimize: true } }],
                }),
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: extractCSSPlugin.extract({
                    use: [{
                        loader: "css-loader", options: { minimize: true }
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            }, {
                test: /\.(svg|jpe?g|png|ttf|woff2?|eot)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'assets/[name]-[hash:8].[ext]',
                    },
                },
            }, {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }]
            }
        ]
    };

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        new CleanWebpackPlugin(['dist']),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        extractCSSPlugin,
    ];

    // Skip rendering index.html in test mode
    if (!TEST) {
        // Reference: https://github.com/ampedandwired/html-webpack-plugin
        // Render index.html
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: './app/index.html',
                inject: 'head',
                minify: BUILD && {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                }
            })
        )
    }

    // Add build specific plugins
    if (BUILD) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoEmitOnErrorsPlugin()

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            // minify remove some of the dead code
            ,new UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                },
            })
        )
    }

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        contentBase: './dist',
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        }
    };

    return config;
};
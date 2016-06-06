/*eslint-disable quotes */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

// Load *package.json* so we can use `dependencies` from there
const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    style: path.join(__dirname, 'app/main.css'),
    test: path.join(__dirname, 'tests')
};

process.env.BABEL_ENV = TARGET;

const HtmlWebpackPlugin = require('html-webpack-plugin');

const CleanPlugin = require('clean-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const common = {
    // Entry accept a path or an object of entries.
    // We'll be using the latter form given it's convenient with
    // more complex configurations
    entry: {
        app: PATHS.app
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: PATHS.build
    },
    module: {
        preLoaders: [{
            test: /\.jsx?$/,
            loaders: ['eslint'],
            include: PATHS.app
        }],
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel?cacheDirectory'],
                include: PATHS.app
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'node_modules/html-webpack-template/index.ejs',
            title: 'Kanban app',
            appMountId: 'app',
            inject: false
        })
    ]
};

// Default configuration. We'll return this
// if Webpack is called outside of npm.
if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {

        entry: {
            style: PATHS.style
        },

        output: {
            // Output using entry name
            filename: '[name].[hash].js',
            chunkFilename: '[hash].js'
        },

        devtool: 'eval-source-map',
        devServer: {
            // Enable history API fallback so HTML5 History API based
            // routing works. This is good default that will come
            // in handy in more complicated setups.
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,

            // Display only errors to reduce the amount of output.
            stats: 'errors-only',
            // Parse host and port from env so this is easy to customize.
            host: process.env.HOST || "0.0.0.0",
            port: process.env.PORT
        },
        module: {
            loaders: [
                {
                    // Define development specific CSS setup
                    // test is commonly used to match file extension
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    // include is commonly used to match directory
                    include: PATHS.app
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new NpmInstallPlugin({
                save: true
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify("development")
            })
        ]
    });
}

if (TARGET === 'build' || TARGET === 'stats') {
    module.exports = merge(common, {
        // Define vendor entry point needed for splitting
        entry: {
            vendor: Object.keys(pkg.dependencies).filter(function (v) {
                // Exclude alt-utils as it won't work with this setup
                return v !== 'alt-utils';
            }),
            style: PATHS.style
        },
        output: {
            // Output using entry name
            filename: '[name].[chunkhash].js',
            chunkFilename: '[chunkhash].js'
        },
        module: {
            loaders: [
                {
                    // Extract css during build
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css'),
                    // include is commonly used to match directory
                    include: PATHS.app
                }
            ]
        },
        plugins: [
            new webpack.optimize.DedupePlugin(),
            new ExtractTextPlugin('[name].[chunkhash].css'),
            new CleanPlugin([PATHS.build]),
            // Extract vendor and manifest files
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest']
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify("production")
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    });
}

if (TARGET === 'test' || TARGET === 'tdd') {
    module.exports = merge(common, {
        output: {
            // Output using entry name
            filename: '[name].[chunkhash].js',
            chunkFilename: '[chunkhash].js'
        },
        devtool: 'inline-source-map',
        resolve: {
            alias: {
                'app': PATHS.app
            }
        },
        module: {
            preLoaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['isparta-instrumenter'],
                    include: PATHS.app
                }
            ],
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['babel?cacheDirectory'],
                    include: PATHS.test
                }
            ]
        }
    });
}
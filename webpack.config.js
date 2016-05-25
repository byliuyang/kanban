const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

const common = {
    // Entry accept a path or an object of entries.
    // We'll be using the latter form given it's convenient with
    // more complex configurations
    entry: {
        app: PATHS.app
    },
    resolve: {
        extensions: ['', 'js', 'jsx']
    },
    output: {
        path: PATHS.build,
        filename: "bundle.js"
    }
};

// Default configuration. We'll return this
// if Webpack is called outside of npm.
if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            contentBase: PATHS.build,
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
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new NpmInstallPlugin({
                save: true
            })
        ],
        module: {
            loaders: [
                {
                    // test is commonly used to match file extension
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    // include is commonly used to match directory
                    include: PATHS.app
                },
                {
                    test: /\.jsx?$/,
                    loaders: ['babel!cacheDirectory'],
                    include: PATHS.app
                }
            ]
        }
    });
}

if (TARGET === 'build') {
    module.exports = merge(common, {});
}
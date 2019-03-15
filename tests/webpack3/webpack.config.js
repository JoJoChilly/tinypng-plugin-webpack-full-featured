const path = require('path');
const TinypngPlugin = require('../../index');

module.exports = {
    entry: path.resolve(__dirname, './entry.js'),
    output: {
        filename: '[name].js',
        path: __dirname + '/dist',
    },
    resolve: {
        extensions: ['.js'],
    },
    plugins: [
        new TinypngPlugin({
            disable: false,
            from: path.resolve(__dirname, './assets'),
            projectRoot: __dirname,
            extentions: ['png', 'jpeg', 'jpg'],
            silent: true,
            cache: true,
            cacheLocation: path.resolve(__dirname, './assets/.dict'),
        }),
    ],
};

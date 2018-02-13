var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        library: 'zliq-native',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: [{
                loader: 'babel-loader',
                query: {
                    presets: ['babili']
                }
            }]
        }]
    }
}
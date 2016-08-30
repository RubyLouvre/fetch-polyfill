var webpack = require('webpack');

var path = require('path');


function heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
            replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
}

module.exports = {
    entry: {
        index: './src/fetch'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'fetch'
    }, //页面引用的文件
     resolve: {
        extensions: ['.js', ''],
         alias: {
        }
    }
}

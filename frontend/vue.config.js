// vue.config.js
module.exports = {
    publicPath: '/',
    outputDir: '../dist/',
    configureWebpack: {
        resolve: {
            fallback: {
                "crypto": require.resolve("crypto-browserify"),
                "stream": require.resolve("stream-browserify")
            }
        }
    }
};

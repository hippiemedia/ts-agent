module.exports = {
    entry: './src/main.ts',
    output: {
        filename: './dist/bundle.js',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ],
    },
};

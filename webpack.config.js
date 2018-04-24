const path = require('path');

module.exports = {
    entry: './src/main.ts',
    output: {
        filename: './dist/bundle.js',
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' }
        ],
    },
    devtool: 'source-map',
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*',
        },
        before(app){
            app.route('/api/*').all(function(req, res, next) {
                res.set('Content-Type', 'application/hal+json').status(201).end('{}');
            });
        },
        staticOptions: {
            setHeaders: (res, file, stat) => {
                if (path.basename(path.dirname(file)) == 'hal') {
                    res.set('Content-Type', 'application/hal+json');
                }
            }
        }
    },
};

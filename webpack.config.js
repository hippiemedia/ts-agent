const path = require('path');

module.exports = {
    entry: './src/factory.ts',
    output: {
        path: path.resolve(__dirname, './bundle'),
        filename: 'index.js',
        library: '@hippiemedia/agent',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
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
}

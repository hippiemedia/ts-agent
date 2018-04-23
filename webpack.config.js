const path = require('path');

const config = {
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
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
};

if (process.env.EXPORT_LIBRARY) {
    config.output = {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
        library: 'hippiemedia-agent',
        libraryTarget: 'umd',
        umdNamedDefine: true
    }
}

module.exports = config;
const path = require('path');

module.exports = {
    entry: './src/extension.ts',
    output: {
        filename: 'extension.js',
        path: path.resolve(__dirname, 'out'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devtool: 'source-map',
    externalsPresets : {node : true},
    externals: {
        vscode: 'commonjs vscode' // VSCode API를 외부 모듈로 처리
    },
};

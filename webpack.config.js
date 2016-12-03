const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const failPlugin = require("webpack-fail-plugin");
const uglifySaveLicense = require("uglify-save-license");

const isProduction = process.env.NODE_ENV === "production";

let common = {
    devtool: isProduction
        ? null
        : "#inline-eval-source-map",
    plugin: isProduction
        ? [failPlugin]
        : [],
    resolve: { extensions: ["", ".ts", ".tsx", ".js"] },
    ts: { compilerOptions: { "sourceMap": !isProduction } }
};

module.exports = [
    Object.assign({},
        common,
        {
            entry: {
                index: "./src/public/js/index.tsx"
            },
            externals: /^electron$/,
            module: {
                loaders: [
                    {
                        test: /\.tsx?$/,
                        loader: "ts-loader"
                    }
                ]
            },
            output: {
                filename: "lib/public/js/[name].js",
                libraryTarget: "commonjs2"
            },
            plugins: common.plugin.concat([
                new CopyWebpackPlugin(
                    [
                        { from: "src/public/", to: "lib/public/" },
                        { from: "src/res/", to: "lib/res/" }
                    ],
                    {
                        ignore: [
                            "test/",
                            "*.ts",
                            "*.tsx"
                        ]
                    }),
            ])
                .concat(isProduction
                    ? [
                        new webpack.optimize.UglifyJsPlugin({
                            output: { comments: uglifySaveLicense }
                        })
                    ]
                    : [])
        }
    ),
    Object.assign({},
        common,
        {
            entry: {
                index: "./src/index.ts",
                "test/test": "./src/test/test.ts"
            },
            externals: /^(?!\.)/,
            module: {
                loaders: [{
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                }]
            },
            node: {
                __dirname: false
            },
            output: {
                filename: "lib/[name].js",
                libraryTarget: "commonjs2"
            }
        }
    )
];

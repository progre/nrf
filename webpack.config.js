const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const failPlugin = require("webpack-fail-plugin");
const uglifySaveLicense = require("uglify-save-license");

const isProduction = process.env.NODE_ENV === "production";

let common = {
    devtool: isProduction
        ? null
        : "#inline-eval-source-map",
    plugins: isProduction
        ? [failPlugin]
        : [],
    resolve: { extensions: [".ts", ".tsx", ".js"] }
};

module.exports = [
    Object.assign({},
        common,
        {
            entry: {
                index: ["babel-polyfill", "./src/public/js/index.ts"]
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            { loader: "babel-loader?presets[]=es2015" }
                        ]
                    },
                    {
                        test: /\.tsx?$/,
                        use: [
                            { loader: "babel-loader?presets[]=es2015" },
                            {
                                loader: "ts-loader", options: {
                                    compilerOptions: { "sourceMap": !isProduction }
                                }
                            }
                        ]
                    }
                ]
            },
            output: {
                filename: "lib/public/js/[name].js",
                libraryTarget: "commonjs2"
            },
            plugins: common.plugins.concat([
                new CopyWebpackPlugin(
                    [{ from: "src/public/", to: "lib/public/" }],
                    {
                        ignore: [
                            "test/",
                            "*.ts",
                            "*.tsx"
                        ]
                    })
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
                index: ["babel-polyfill", "./src/index.ts"],
                "test/test": ["babel-polyfill", "./src/test/test.ts"]
            },
            externals: /^(?!\.)/,
            module: {
                loaders: [{
                    test: /\.tsx?$/,
                    loader: "babel-loader?presets[]=modern-node!ts-loader"
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

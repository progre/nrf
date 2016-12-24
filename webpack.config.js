const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const failPlugin = require("webpack-fail-plugin");
const uglifySaveLicense = require("uglify-save-license");
const electronVersion = require("./package.json").devDependencies.electron.slice(1);

const isProduction = process.env.NODE_ENV === "production";

let common = {
    devtool: isProduction
        ? false
        : "inline-source-map",
    plugins: isProduction
        ? [failPlugin]
        : [],
    resolve: { extensions: [".ts", ".tsx", ".js"] }
};

function tsModule(targets) {
    return {
        rules: [{
            test: /\.tsx?$/,
            use: [
                {
                    loader: "babel-loader",
                    options: { presets: [["env", { targets }]] }
                },
                {
                    loader: "ts-loader",
                    options: { compilerOptions: { sourceMap: !isProduction } }
                }
            ]
        }]
    };
}

module.exports = [
    Object.assign({},
        common,
        {
            entry: {
                index: "./src/public/js/index.tsx"
            },
            externals: /^electron$/,
            module: tsModule({ electron: electronVersion }),
            output: {
                filename: "lib/public/js/[name].js",
                libraryTarget: "commonjs2"
            },
            plugins: common.plugins.concat([
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
                    })
            ]),
            target: "electron-renderer"
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
            module: tsModule({ electron: electronVersion }),
            node: {
                __dirname: false
            },
            output: {
                filename: "lib/[name].js",
                libraryTarget: "commonjs2"
            },
            target: "electron-main"
        }
    )
];

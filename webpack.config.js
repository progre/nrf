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

let tsLoader = {
    loader: "ts-loader",
    options: {
        compilerOptions: { "sourceMap": !isProduction }
    }
};

function babelLoader(targets) {
    return {
        loader: "babel-loader",
        options: { presets: [["env", { targets }]] }
    };
}

module.exports = [
    Object.assign({},
        common,
        {
            entry: {
                index: ["babel-polyfill", "./src/public/js/index.ts"]
            },
            externals: /^electron$/,
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            babelLoader({ electron: electronVersion })
                        ]
                    },
                    {
                        test: /\.tsx?$/,
                        use: [
                            babelLoader({ electron: electronVersion }),
                            tsLoader
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
            ]),
            target: "electron-renderer"
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
                rules: [{
                    test: /\.tsx?$/,
                    use: [
                        babelLoader({ electron: electronVersion }),
                        tsLoader
                    ]
                }]
            },
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

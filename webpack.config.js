const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const failPlugin = require("webpack-fail-plugin");
const uglifySaveLicense = require("uglify-save-license");

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
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            babelLoader({ browsers: ["last 2 versions"] })
                        ]
                    },
                    {
                        test: /\.tsx?$/,
                        use: [
                            babelLoader({ browsers: ["last 2 versions"] }),
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
            ])
                .concat(isProduction
                    ? [
                        new webpack.optimize.UglifyJsPlugin({
                            output: { comments: uglifySaveLicense }
                        })
                    ]
                    : []),
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
                        babelLoader({ node: 6 }),
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

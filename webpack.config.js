let common = {
    devtool: process.env.NODE_ENV === "production"
        ? null
        : "#inline-eval-source-map",
    resolve: { extensions: ["", ".ts", ".tsx", ".js"] }
};

module.exports = [
    Object.assign(
        {
            entry: {
                index: ["babel-polyfill", "./src/public/js/index.ts"]
            },
            module: {
                loaders: [{
                    test: /\.tsx?$/,
                    loader: "babel-loader?presets[]=modern-browsers!ts-loader"
                }]
            },
            output: {
                filename: "lib/public/js/[name].js"
            }
        },
        common
    ),
    Object.assign(
        {
            entry: {
                app: ["babel-polyfill", "./src/index.ts"]
            },
            externals: /^(?!^\.)/,
            module: {
                loaders: [{
                    test: /\.tsx?$/,
                    loader: "babel-loader?presets[]=modern-node!ts-loader"
                }]
            },
            output: {
                filename: "lib/[name].js",
                libraryTarget: "commonjs2"
            }
        },
        common
    )
];

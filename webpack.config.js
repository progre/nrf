const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const failPlugin = require("webpack-fail-plugin");
const uglifySaveLicense = require("uglify-save-license");

const isProduction = process.env.NODE_ENV === "production";

let common = {
  devtool: isProduction
    ? false
    : "inline-source-map",
  node: {
    __filename: true,
    __dirname: true
  },
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
          options: {
            env: {
              delelopment: {
                plugins: [[
                  "babel-plugin-espower",
                  { "embedAst": true }
                ]]
              },
              production: {
                presets: ["babili"]
              }
            },
            presets: [["env", { targets }]]
          }
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
        index: ["babel-polyfill", "./src/public/js/index.ts"]
      },
      module: tsModule({ browsers: ["last 2 versions"] }),
      output: {
        filename: "lib/public/js/[name].js"
      },
      plugins: common.plugins
        .concat([
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
          : []
        ),
      target: "web"
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
      module: tsModule({ node: 6 }),
      output: {
        filename: "lib/[name].js",
        libraryTarget: "commonjs2"
      },
      target: "node"
    }
  )
];

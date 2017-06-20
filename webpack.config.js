const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const uglifySaveLicense = require('uglify-save-license');
const electronVersion = require('./package.json').devDependencies.electron.slice(1);

const isProduction = process.env.NODE_ENV === 'production';

const common = {
  devtool: isProduction ? false : 'inline-source-map',
  node: { __filename: true, __dirname: false },
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  watchOptions: { ignored: /node_modules|lib/ }
};

function tsModule(targets) {
  return {
    rules: [{
      test: /\.tsx?$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            env: {
              development: {
                plugins: [['babel-plugin-espower', { 'embedAst': true }]]
              },
              production: {
                presets: ['babili']
              }
            },
            presets: [['env', { targets }]]
          }
        },
        {
          loader: 'ts-loader',
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
        index: ['babel-polyfill', './src/public/js/index.tsx']
      },
      externals: /^electron$/,
      module: tsModule({ uglify: true }),
      output: {
        filename: 'lib/public/js/[name].js',
        libraryTarget: 'commonjs2'
      },
      plugins: [
        ...[
          new CopyWebpackPlugin(
            [
              { from: "src/public/", to: "lib/public/" },
              { from: "src/res/", to: "lib/res/" }
            ],
            {
              ignore: [
                'test/',
                '*.ts',
                '*.tsx'
              ]
            })
        ],
        ...(
          !isProduction ? [] : [
            new webpack.optimize.UglifyJsPlugin({
              output: { comments: uglifySaveLicense }
            })
          ]
        )
      ],
      target: 'electron-renderer'
    }
  ),
  Object.assign({},
    common,
    {
      entry: {
        index: ['babel-polyfill', './src/index.ts'],
        'test/test': ['babel-polyfill', './src/test/test.ts']
      },
      externals: /^(?!\.)/,
      module: tsModule({ electron: electronVersion }),
      output: {
        filename: 'lib/[name].js',
        libraryTarget: 'commonjs2'
      },
      target: 'electron-main'
    }
  )
];

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const conf = {
  entry: './src/shape.js',
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'main.js',
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
      ],
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader',
      ],
    }, {
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },{
          loader: 'css-loader',
        }, {
          loader: 'sass-loader',
        }],
    },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyWebpackPlugin([
      { from: 'index.html',
        to: 'index.html'},
    ]),
  ],
};

module.exports = conf;

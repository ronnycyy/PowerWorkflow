const { join } = require('path');

module.exports = {
  devServer: {
    contentBase: join(__dirname, '../dist'),
    hot: true,
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              }
            },
          },
        ],
      },
    ],
  },
}
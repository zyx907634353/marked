const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app/src/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
        { from: './app/src/index.html', to: "index.html" },
      {from: './app/src/list-item.html', to: "list-item.html" },
      {from: './app/src/launch.html',to:"launch.html"},
      {from: './app/src/data-list.html',to:"data-list.html"},
      {from: './app/src/payment.html',to:"payment.html"},
      {from: './app/src/report.html',to:"report.html"},
      {from: './app/src/refund.html',to:"refund.html"}
      ]
    ),
    new webpack.DefinePlugin({
      ETHEREUM_NODE_URL: JSON.stringify(process.env.ETHEREUM_NODE_URL),
      IPFS_API_HOST: JSON.stringify(process.env.IPFS_API_HOST),
      IPFS_API_PORT: JSON.stringify(process.env.IPFS_API_PORT),
      IPFS_GATEWAY_URL: JSON.stringify(process.env.IPFS_GATEWAY_URL)
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  devServer:{
    host: 'localhost',        //在所有ip上进行监听
    port: 3000,
    disableHostCheck:true,  //禁止主机检查
    //public:'0.0.0.0'        //公开访问地址
    proxy:{
      // http://localhost:5001/api/v0/add?stream-channels=true
      '/api':{
        target:"http://localhost:5001",
        // pathRewrite :{"^/api":""},
        changeOrigin:true,
      }
    },
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    //   "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    // }

}
}

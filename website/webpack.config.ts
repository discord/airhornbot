import 'dotenv/config';
import * as path from 'path';
import * as webpack from 'webpack';
import 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { SubresourceIntegrityPlugin } from 'webpack-subresource-integrity';
import { EnvironmentPlugin } from 'webpack';

const config: webpack.Configuration = {
  entry: './src/index.tsx',
  output: {
    filename: '[contenthash].js',
    path: path.resolve(__dirname, 'build', 'assets'),
    publicPath: `${process.env.WEBSITE_URL || ''}/assets/`,
    crossOriginLoading: 'anonymous',
  },
  plugins: [
    // Generate an HTML file with the <script> injected.
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      filename: '../index.html',
    }),
    
    // Add subresource integrity to generated script tags.
    new SubresourceIntegrityPlugin(),

    // Define global variables that can be accessed at runtime.
    new EnvironmentPlugin(['WEBSITE_URL', 'DISCORD_CLIENT_ID']),

    // Copy files from one location to another.
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/robots.txt',
          to: '../robots.txt',
        },
      ],
    }),
  ],
  devServer: {
    // Serve files from the build directory.
    static: {
      directory: path.join(__dirname, 'build'),
    },

    // Set the port number.
    port: 3000,
  },
  module: {
    rules: [
      // Handle HTML files.
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },

      // Handle JavaScript files.
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },

      // Handle TypeScript files.
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
      },

      // Handle Stylus files.
      {
        test: /\.(styl)$/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },

      // Handle asset files.
      {
        test: /\.(png|svg|ogv|mp4|webm|wav)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    // Automatically resolve certain extensions.
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
  },
};

export default config;

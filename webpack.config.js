const path = require('path');

// plugin to extract css and save in a file. 
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //extract css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // optimize it 
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // minify js

const devMode = process.env.Node_ENV !== 'production';

// plugin to crete a copy o html in de dist folder 
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/js/app.js',
    devtool: 'source-map',
    output: {
        filename: 'js/main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist'
    },
    optimization: {
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true // set to true if you want JS source maps
          }),
          new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
          })
        ]
    },
    module: {
        rules: [
            {   // js | this loader convert ES6 to normal JS  
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }
                ]
            },
            { // css | here we compale sass and use a plugin _
              // to extract from the header and create a separete file
                test: /\.s?[ac]ss$/,
                use: [
                    devMode ? MiniCssExtractPlugin.loader : 'style-loader',
                    { loader: 'css-loader', options: { minimize: true } },
                    {loader: 'postcss-loader', options: {sourceMap: 'inline'}},
                    { loader: 'sass-loader', options: { sourceMap: true} },
                ],
            },
            { // html | here we use html-loader to generate a
                // a template from the src/index.html also use a plugin. 
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            { // load-imgs | here we a setting the path for the imgs 
                test: /\.(png|jpg|gif|jpeg|svg)$/,
                use: [ 
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: '/img/'

                        }
                    }
                   
                ]
            }
        ]
    },
    plugins: [
        // This plugin extract the embaded css from de header and 
        // genarate an external css file. 
        new MiniCssExtractPlugin({
            filename: devMode ? 'css/main.css' : 'css/main.css.[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),

        // this plugin genarate a template to the dist file index.html
        new htmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true // set to true if you want JS source maps
          }),
          new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
          })
    ]


}
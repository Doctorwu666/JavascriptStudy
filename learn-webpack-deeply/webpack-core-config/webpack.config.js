const path = require("path");
const {
    CleanWebpackPlugin
} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./public"),
        filename: "[name]-[chunkhash:6].js"
    },
    mode: "development",
    module: {
        rules: [{
            test: /\.s[ac]ss$/i,
            use: [
                MiniCssExtractPlugin.loader, {
                    loader: "css-loader",
                    options: {
                        // 开启CSS modules
                        modules: true
                    }
                },
                {
                    // 要加在css-loader之前
                    loader: "postcss-loader"
                }, "sass-loader"
            ]
        }, {
            test: /\.(png|jpe?g|gif|ttf|svg|woff2?)$/i,
            use: {
                // url-loader 包含 file-loader
                loader: "url-loader",
                options: {
                    name: "[name]_[hash:6].[ext]",
                    outputPath: "images/",
                    // 未超过1024*10字节的图片会在打包时被转换成base64的格式
                    limit: 1024 * 10
                }
            }
        }]
    },
    // mode为development时默认source-map是打开的，可以将devtool设置为none关闭sourcemap，不过有什么必要呢
    // mode为production时默认source-map是关闭的，不建议在生产环境开启source-map
    devtool: "source-map",

    devServer: {
        // 静态资源目录
        contentBase: "./dist",
        // 是否在开启服务后自动打开默认浏览器窗口
        // open: true, 
        port: 8080
    },


    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name][chunkhash:8].css"
        }),
        new HtmlWebpackPlugin({
            template: "./index.html",
            title: "webpack",
            filename: "index.html"
        })
    ]
}
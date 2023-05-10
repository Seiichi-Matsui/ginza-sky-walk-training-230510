const os = require( 'os' );
const path = require( 'path' );
const webpack = require( 'webpack' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = ( _, argv ) => {

	const dir = argv.mode === 'development' ? './' : './';

	const config = {
		entry: {
			[ `${ dir }/assets/js/script` ]: path.resolve( __dirname, '../assets/js/src/index.js' ),
			[ `${ dir }/assets/css/style` ]: path.resolve( __dirname, '../assets/css/src/index.scss' ),
		},
		output: {
			path: path.resolve( __dirname, '../' ),
			filename: '[name].js',
		},
		// By default, `target` is 'browserslist'.
		// But to enable HMR, `target` must be 'web'.
		// However, 'web' ignore 'browserslist' which means break in IE11.
		// In order to support IE11, I ended up giving up using HMR...
		// see:
		// https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-715629138
		// https://webpack.js.org/migrate/5/#need-to-support-an-older-browser-like-ie-11
		// target: 'web',
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [
						path.resolve(__dirname, '../js/src' ),
						// Swiper is dependent on Dom7
						path.resolve(__dirname, '../node_modules/swiper' ),
						path.resolve(__dirname, '../node_modules/dom7' ),
						path.resolve(__dirname, '../node_modules/goober' ),
					],
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: [
									[
										"@babel/preset-env",
										{
											modules: false,
											useBuiltIns: "usage",
											corejs: { version: 3, proposals: true },
											debug: true,
										}
									]
								],
								// plugins: [
								// 	[ "@babel/plugin-transform-runtime", { corejs: 3 } ],
								// ],
							}
						}
					]
				},

				{
					test: /\.(css|scss)$/,
					// test: /\/src\/style\.scss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
						},
						{
							loader: 'css-loader',
							options: {
								url: false,
								// sourceMap: true,
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: require( './postcss.config' ),
							},
						},
						{
							loader: 'sass-loader',
							options: {
								implementation: require( 'sass' ),
							},
						},
					],
				},
			],
		},

		resolve: {
			modules: [ 'node_modules' ],
			extensions: [ '.js', '.jsx', 'scss' ],
		},

		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					extractComments: false,
				}),
			],
		},

		devServer: {
			host: os.platform() === 'win32' ? '127.0.0.1' : '0.0.0.0',
			port: 3000,
			static: {
				directory: path.resolve( __dirname, '../' ),
				watch: true,
			},
			open: [ dir ],
			hot: true,
		},

		plugins: [
			new webpack.DefinePlugin( {
				'process.env': {
					NODE_ENV: JSON.stringify( argv.mode ),
				}
			} ),
			new MiniCssExtractPlugin( { filename: '[name].css' } ),
			{
				// MiniCssExtractPlugin が吐き出す不要な js ファイルを取り除く
				// https://github.com/webpack-contrib/mini-css-extract-plugin/issues/279#issuecomment-720343094
				apply( compiler ) {

					compiler.hooks.shouldEmit.tap( 'Remove styles from output', ( compilation ) => {

						delete compilation.assets[ 'css/style.js' ];
						return true;

					} );

				}
			},
			...(
				argv.mode === 'development' ? [
					new webpack.HotModuleReplacementPlugin(),
				] : [
					new webpack.LoaderOptionsPlugin( {
						minimize: true
					} ),
				]
			),
		],
		devtool: argv.mode === 'development' ? 'inline-source-map' : false,

	};

	return config;

};

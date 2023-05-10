module.exports = {
	plugins: [
		// require( 'autoprefixer' )( { grid: 'autoplace' } ),
		require( 'css-mqpacker' )(),
		require( 'cssnano' )(),
	],
};

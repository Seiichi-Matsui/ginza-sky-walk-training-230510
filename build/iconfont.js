const path = require( 'path' );
const makeIconFont = require( 'make-iconfont' );

const options = {
	filePath: path.resolve( __dirname, '../assets/fonts/src/*.svg' ),
	fontFamilyName: 'icon',
	className: 'Icon',
	templatePath: path.resolve( __dirname, '../assets/fonts/src/_icon-vars.scss.njk' ),
	destPath: path.resolve( __dirname, '../assets/css/src/common/_generated-icon-vars.scss' ),
};

makeIconFont( options ).then( () => console.log( 'iconfont is generated' ) );

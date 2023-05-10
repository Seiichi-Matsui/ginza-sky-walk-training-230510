const ua = navigator.userAgent;
const IS_OS = /iPad|iPhone|iPod/i.test( ua );
const IS_ANDROID = /android/i.test( ua );
const IS_MOBILE = IS_OS || IS_ANDROID;
const isSvhSupported = CSS.supports( 'width', '1svh' );

const updateCSSSmallViewportHeight = () => {

	// orientationchange 直後は、ビューポートの大きさが変わっていない。
	// 再描画を待つ必要がある
	requestAnimationFrame( () => {

		document.documentElement.style.setProperty( '--svw', `${ document.documentElement.clientWidth * 0.01 }px` );
		document.documentElement.style.setProperty( '--svh', `${ document.documentElement.clientHeight * 0.01 }px` );

	} );

};

if ( isSvhSupported ) {

	document.documentElement.style.setProperty( '--svw', '1svw' );
	document.documentElement.style.setProperty( '--svh', '1svh' );

} else {

	document.documentElement.style.setProperty( '--svw', `${ document.documentElement.clientWidth * 0.01 }px` );
	document.documentElement.style.setProperty( '--svh', `${ document.documentElement.clientHeight * 0.01 }px` );
	window.addEventListener( 'orientationchange', updateCSSSmallViewportHeight );
	if ( ! IS_MOBILE ) window.addEventListener( 'resize', updateCSSSmallViewportHeight );

}

const scrollbarWidth = ( () => {

	const outer = document.createElement( 'div' );
	outer.style.visibility = 'hidden';
	outer.style.overflow = 'scroll'; // forcing scrollbar to appear
	document.body.appendChild( outer );

	const inner = document.createElement( 'div' );
	outer.appendChild( inner );

	const scrollbarWidth = ( outer.offsetWidth - inner.offsetWidth );

	outer.remove();

	return scrollbarWidth;

} )();

document.documentElement.style.setProperty( '--scrollbar-width', `${ scrollbarWidth }px` );

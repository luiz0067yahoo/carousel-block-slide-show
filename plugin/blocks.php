<?php
/**
 * Gutenberg Block Assets Registration
 *
 * @package WP_Bootstrap_Carousel
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function adm__register_slide_show_block() {
	// Register Bootstrap and FontAwesome styles
	wp_register_style( 'bootstrap', plugins_url( '/../assets/bootstrap/css/bootstrap.min.css', __FILE__ ), array(), '5.3.3' );
	wp_register_style( 'bootstrapAll', plugins_url( '/../assets/fontawesome/css/all.min.css', __FILE__ ), array(), '6.5.2' );
	wp_register_style( 'style', plugins_url( '/../style.css.php', __FILE__ ), array(), '1.0.0' );

	$slide_show_js = dirname( __FILE__ ) . '/../js/blocks/slide-show.js';
	if ( file_exists( $slide_show_js ) ) {
		wp_register_script(
			'block-editor-slide-show',
			plugins_url( '/../js/blocks/slide-show.js', __FILE__ ),
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'jquery' ),
			filemtime( $slide_show_js ),
			true
		);
	}

	register_block_type( 'cms-adm/slide-show', array(
		'editor_script' => 'block-editor-slide-show',
		'style'         => 'bootstrap',
		'editor_style'  => 'bootstrapAll',
	) );
}
add_action( 'init', 'adm__register_slide_show_block' );

function adm__block_admin() {
	// Fallback enqueue for block editor assets
	wp_enqueue_script( 'block-editor-slide-show' );
	wp_enqueue_style( 'bootstrap' );
	wp_enqueue_style( 'bootstrapAll' );
}
add_action( 'enqueue_block_editor_assets', 'adm__block_admin' );

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

function adm__block_admin() {
	// Enqueue slide show block script for editor if exists
	$slide_show_js = dirname( __FILE__ ) . '/../js/blocks/slide-show.js';
	if ( file_exists( $slide_show_js ) ) {
		wp_enqueue_script(
			'block-editor-slide-show',
			plugins_url( '/../js/blocks/slide-show.js', __FILE__ ),
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'jquery' ),
			'1.0.0',
			true
		);
	}
}
add_action( 'enqueue_block_editor_assets', 'adm__block_admin' );
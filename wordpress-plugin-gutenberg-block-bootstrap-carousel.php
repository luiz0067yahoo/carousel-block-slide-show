<?php
/**
 * Plugin Name:       WordPress Gutenberg Block Bootstrap Carousel
 * Plugin URI:        https://github.com/luiz0067yahoo/wordpress-plugin-gutenberg-block-bootstrap-carousel-
 * Description:       WordPress Gutenberg Block for responsive Bootstrap 5 Carousels, compatible with any theme.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Luiz Fernando Brogliatto Ferreira
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wordpress-plugin-gutenberg-block-bootstrap-carousel
 * Domain Path:       /languages
 *
 * @package           WP_Bootstrap_Carousel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Plugin constants
define( 'WP_BOOTSTRAP_CAROUSEL_VERSION', '1.0.0' );
define( 'WP_BOOTSTRAP_CAROUSEL_PATH', plugin_dir_path( __FILE__ ) );
define( 'WP_BOOTSTRAP_CAROUSEL_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers the Gutenberg block using the metadata loaded from `block.json`.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function wp_bootstrap_carousel_block_init() {
	// Register from build directory if it exists, otherwise fallback to src
	if ( file_exists( WP_BOOTSTRAP_CAROUSEL_PATH . 'build/block.json' ) ) {
		register_block_type( WP_BOOTSTRAP_CAROUSEL_PATH . 'build' );
	} elseif ( file_exists( WP_BOOTSTRAP_CAROUSEL_PATH . 'src/block.json' ) ) {
		register_block_type( WP_BOOTSTRAP_CAROUSEL_PATH . 'src' );
	}
}
add_action( 'init', 'wp_bootstrap_carousel_block_init' );

/**
 * Enqueue Bootstrap 5 CSS & JS assets on the frontend if the block is rendered.
 * Themes that already bundle Bootstrap 5 can disable this via filter:
 * add_filter( 'wp_bootstrap_carousel_enqueue_bootstrap', '__return_false' );
 */
function wp_bootstrap_carousel_enqueue_bootstrap_assets() {
	$enqueue_bootstrap = apply_filters( 'wp_bootstrap_carousel_enqueue_bootstrap', true );

	if ( ! $enqueue_bootstrap ) {
		return;
	}

	// Bootstrap 5 CSS
	if ( ! wp_style_is( 'bootstrap', 'enqueued' ) && ! wp_style_is( 'bootstrap-5', 'enqueued' ) ) {
		wp_enqueue_style(
			'bootstrap-5',
			'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
			array(),
			'5.3.3'
		);
	}

	// Bootstrap 5 JS Bundle (includes Popper)
	if ( ! wp_script_is( 'bootstrap', 'enqueued' ) && ! wp_script_is( 'bootstrap-5', 'enqueued' ) ) {
		wp_enqueue_script(
			'bootstrap-5',
			'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
			array(),
			'5.3.3',
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'wp_bootstrap_carousel_enqueue_bootstrap_assets' );

/**
 * Enqueue Bootstrap CSS in the Gutenberg editor screen for realistic preview.
 */
function wp_bootstrap_carousel_editor_assets() {
	wp_enqueue_style(
		'bootstrap-5-editor',
		'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
		array(),
		'5.3.3'
	);
}
add_action( 'enqueue_block_editor_assets', 'wp_bootstrap_carousel_editor_assets' );

/**
 * Load plugin textdomain for internationalization.
 */
function wp_bootstrap_carousel_load_textdomain() {
	load_plugin_textdomain(
		'wordpress-plugin-gutenberg-block-bootstrap-carousel',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}
add_action( 'plugins_loaded', 'wp_bootstrap_carousel_load_textdomain' );

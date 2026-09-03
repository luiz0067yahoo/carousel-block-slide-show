<?php
/**
 * Plugin Name:       Carousel Block for Bootstrap
 * Plugin URI:        https://github.com/luiz0067yahoo/wordpress-plugin-gutenberg-block-bootstrap-carousel-
 * Description:       WordPress Gutenberg Block for responsive Bootstrap 5 Carousels, compatible with any theme.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Luiz Fernando Brogliatto Ferreira
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       plugin-block-carousel
 * Domain Path:       /languages
 *
 * @package           WP_Bootstrap_Carousel
*/

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue styles and scripts for frontend and admin
 */
function wp_bootstrap_carousel_enqueue_assets() { 
	// Bootstrap 5 CSS via CDN
	wp_enqueue_style( 'bootstrap', plugin_dir_url( __FILE__ ) . 'assets/bootstrap/css/bootstrap.min.css', array(), '5.3.3' );
	
	// Font Awesome via CDN
	wp_enqueue_style( 'bootstrapAll', plugin_dir_url( __FILE__ ) . 'assets/fontawesome/css/all.min.css', array(), '6.5.2' );
	
	// Custom Plugin Styles
	wp_enqueue_style( 'style', plugin_dir_url( __FILE__ ) . 'style.css.php', array(), '1.0.0' );

	// Bootstrap 5 JS Bundle (includes Popper) via CDN
	wp_enqueue_script( 'bootstrap-bundle', plugin_dir_url( __FILE__ ) . 'assets/bootstrap/js/bootstrap.bundle.min.js', array( 'jquery' ), '5.3.3', true );
}

// Hook for both frontend and Gutenberg block editor canvas iframe
add_action( 'enqueue_block_assets', 'wp_bootstrap_carousel_enqueue_assets' );

// Hook for frontend (header / footer)
add_action( 'wp_enqueue_scripts', 'wp_bootstrap_carousel_enqueue_assets' );

// Hook for admin, login, and block editor UI
add_action( 'admin_enqueue_scripts', 'wp_bootstrap_carousel_enqueue_assets' );
add_action( 'login_enqueue_scripts', 'wp_bootstrap_carousel_enqueue_assets', 10 );
add_action( 'enqueue_block_editor_assets', 'wp_bootstrap_carousel_enqueue_assets' );
add_action( 'wp_before_admin_bar_render', 'wp_bootstrap_carousel_enqueue_assets' );

/**
 * Register editor styles support for block themes / iframed Gutenberg canvas
 */
function wp_bootstrap_carousel_add_editor_styles() {
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/bootstrap/css/bootstrap.min.css' );
	add_editor_style( 'assets/fontawesome/css/all.min.css' );
}
add_action( 'after_setup_theme', 'wp_bootstrap_carousel_add_editor_styles' );
add_action( 'admin_init', 'wp_bootstrap_carousel_add_editor_styles' );

require_once plugin_dir_path( __FILE__ ) . 'plugin/blocks.php';
?>
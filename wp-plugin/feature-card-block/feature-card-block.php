<?php
/**
 * Plugin Name:       Feature Card Block
 * Description:       A dynamic Gutenberg block (block.json, React editor, server-side render) that is also exposed to headless front ends as structured data through the REST API.
 * Version:           1.0.0
 * Requires at least: 6.5
 * Requires PHP:      8.0
 * Author:            Eduard Suciu
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       feature-card-block
 *
 * @package FeatureCardBlock
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the block from the compiled metadata in build/.
 *
 * WordPress reads block.json, registers the editor script and styles, and wires
 * render.php as the render callback.
 */
function feature_card_register_block() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'feature_card_register_block' );

/**
 * Translations for the editor script (strings passed through @wordpress/i18n).
 */
function feature_card_set_script_translations() {
	wp_set_script_translations( 'headless-sample-feature-card-editor-script', 'feature-card-block', __DIR__ . '/languages' );
}
add_action( 'init', 'feature_card_set_script_translations', 20 );

require_once __DIR__ . '/includes/rest-blocks.php';

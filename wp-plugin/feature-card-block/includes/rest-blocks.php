<?php
/**
 * Structured blocks in the REST API.
 *
 * `content.rendered` gives a headless front end one big HTML string. That's fine
 * for paragraphs and images, but custom blocks deserve to become real components.
 * This adds a read-only `structured_blocks` field to posts and pages: every block
 * with its name, its attributes (merged with the block.json defaults), its
 * server-rendered HTML as a fallback, and its inner blocks.
 *
 *   GET /wp-json/wp/v2/posts?_fields=id,slug,title,structured_blocks
 *
 * Why not simply call it `blocks`? The block editor keeps the parsed blocks of
 * the post being edited under `blocks` on the same REST record, so a field with
 * that name collides with it and crashes the editor.
 *
 * @package FeatureCardBlock
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the `structured_blocks` REST field.
 */
function feature_card_register_blocks_field() {
	register_rest_field(
		array( 'post', 'page' ),
		'structured_blocks',
		array(
			'get_callback' => 'feature_card_get_blocks_field',
			'schema'       => array(
				'description' => __( 'Parsed blocks: name, attributes, rendered HTML and inner blocks.', 'feature-card-block' ),
				'type'        => 'array',
				'context'     => array( 'view', 'edit' ),
				'readonly'    => true,
				'items'       => array(
					'type'       => 'object',
					'properties' => array(
						'name'        => array( 'type' => 'string' ),
						'attrs'       => array( 'type' => 'object' ),
						'html'        => array( 'type' => 'string' ),
						'innerBlocks' => array( 'type' => 'array' ),
					),
				),
			),
		)
	);
}
add_action( 'rest_api_init', 'feature_card_register_blocks_field' );

/**
 * REST callback for the `structured_blocks` field.
 *
 * @param array $post Prepared post data (array form, as passed by the REST controller).
 * @return array
 */
function feature_card_get_blocks_field( $post ) {
	$object = get_post( $post['id'] );
	if ( ! $object || post_password_required( $object ) ) {
		return array();
	}
	return feature_card_blocks_to_array( parse_blocks( $object->post_content ) );
}

/**
 * Turn parsed blocks into a clean, front-end friendly structure.
 *
 * @param array $blocks Blocks from parse_blocks().
 * @return array
 */
function feature_card_blocks_to_array( array $blocks ) {
	$registry = WP_Block_Type_Registry::get_instance();
	$out      = array();

	foreach ( $blocks as $block ) {
		// parse_blocks() returns whitespace between blocks as nameless "freeform" blocks.
		if ( empty( $block['blockName'] ) && '' === trim( $block['innerHTML'] ) ) {
			continue;
		}

		$name  = $block['blockName'] ? $block['blockName'] : 'core/freeform';
		$attrs = $block['attrs'];
		$type  = $registry->get_registered( $name );
		if ( $type ) {
			// Fill in defaults, so the front end never has to know them.
			$attrs = $type->prepare_attributes_for_render( $attrs );
		}

		$out[] = array(
			'name'        => $name,
			'attrs'       => (object) $attrs,
			'html'        => render_block( $block ),
			'innerBlocks' => feature_card_blocks_to_array( $block['innerBlocks'] ),
		);
	}

	return $out;
}

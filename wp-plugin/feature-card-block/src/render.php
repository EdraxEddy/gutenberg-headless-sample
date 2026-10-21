<?php
/**
 * Feature Card: server-side render.
 *
 * Available variables (provided by WordPress):
 *
 * @var array    $attributes Block attributes, already merged with the defaults from block.json.
 * @var string   $content    Inner content (unused: the block has no inner blocks).
 * @var WP_Block $block      Block instance.
 *
 * @package FeatureCardBlock
 */

defined( 'ABSPATH' ) || exit;

$feature_card_title = isset( $attributes['title'] ) ? trim( (string) $attributes['title'] ) : '';
$feature_card_text  = isset( $attributes['text'] ) ? trim( (string) $attributes['text'] ) : '';

// An empty card renders nothing on the front end, instead of an empty box.
if ( '' === $feature_card_title && '' === $feature_card_text ) {
	return;
}

$feature_card_accent = in_array( $attributes['accent'] ?? '', array( 'blue', 'violet', 'amber' ), true )
	? $attributes['accent']
	: 'blue';

$feature_card_url     = isset( $attributes['ctaUrl'] ) ? esc_url( $attributes['ctaUrl'] ) : '';
$feature_card_label   = isset( $attributes['ctaLabel'] ) ? (string) $attributes['ctaLabel'] : '';
$feature_card_new_tab = ! empty( $attributes['opensInNewTab'] );
$feature_card_wrapper = get_block_wrapper_attributes( array( 'class' => 'feature-card feature-card--' . $feature_card_accent ) );

// RichText fields may contain inline formatting only.
$feature_card_inline = array(
	'strong' => array(),
	'em'     => array(),
	'a'      => array(
		'href'   => true,
		'target' => true,
		'rel'    => true,
	),
);
?>
<div <?php echo $feature_card_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<?php if ( ! empty( $attributes['eyebrow'] ) ) : ?>
		<p class="feature-card__eyebrow"><?php echo esc_html( wp_strip_all_tags( $attributes['eyebrow'] ) ); ?></p>
	<?php endif; ?>

	<?php if ( '' !== $feature_card_title ) : ?>
		<h3 class="feature-card__title"><?php echo wp_kses( $feature_card_title, array( 'em' => array() ) ); ?></h3>
	<?php endif; ?>

	<?php if ( '' !== $feature_card_text ) : ?>
		<p class="feature-card__text"><?php echo wp_kses( $feature_card_text, $feature_card_inline ); ?></p>
	<?php endif; ?>

	<?php if ( $feature_card_url && '' !== $feature_card_label ) : ?>
		<a
			class="feature-card__cta"
			href="<?php echo $feature_card_url; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above with esc_url(). ?>"
			<?php if ( $feature_card_new_tab ) : ?>
				target="_blank" rel="noopener noreferrer"
			<?php endif; ?>
		>
			<?php echo esc_html( $feature_card_label ); ?>
			<span aria-hidden="true">→</span>
			<?php if ( $feature_card_new_tab ) : ?>
				<span class="screen-reader-text"><?php esc_html_e( '(opens in a new tab)', 'feature-card-block' ); ?></span>
			<?php endif; ?>
		</a>
	<?php endif; ?>
</div>

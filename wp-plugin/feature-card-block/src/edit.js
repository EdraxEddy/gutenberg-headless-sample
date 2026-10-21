/**
 * Feature Card block: editor UI.
 *
 * Text is edited in place with RichText; the link and the accent colour live in
 * the sidebar (InspectorControls), so the canvas stays close to the front end.
 * Only stable WordPress APIs are used (no __experimental imports).
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

const ACCENTS = [
	{ label: __( 'Blue', 'feature-card-block' ), value: 'blue' },
	{ label: __( 'Violet', 'feature-card-block' ), value: 'violet' },
	{ label: __( 'Amber', 'feature-card-block' ), value: 'amber' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, title, text, ctaLabel, ctaUrl, opensInNewTab, accent } =
		attributes;

	const blockProps = useBlockProps( {
		className: `feature-card feature-card--${ accent }`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Call to action', 'feature-card-block' ) }
				>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Button label', 'feature-card-block' ) }
						value={ ctaLabel }
						onChange={ ( value ) =>
							setAttributes( { ctaLabel: value } )
						}
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						type="url"
						label={ __( 'Button link', 'feature-card-block' ) }
						help={ __(
							'The button is shown only when both a label and a link are set.',
							'feature-card-block'
						) }
						value={ ctaUrl }
						onChange={ ( value ) =>
							setAttributes( { ctaUrl: value } )
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __(
							'Open in a new tab',
							'feature-card-block'
						) }
						checked={ opensInNewTab }
						onChange={ ( value ) =>
							setAttributes( { opensInNewTab: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Style', 'feature-card-block' ) }>
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Accent colour', 'feature-card-block' ) }
						value={ accent }
						options={ ACCENTS }
						onChange={ ( value ) =>
							setAttributes( { accent: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<RichText
					tagName="p"
					className="feature-card__eyebrow"
					value={ eyebrow }
					onChange={ ( value ) =>
						setAttributes( { eyebrow: value } )
					}
					placeholder={ __( 'Eyebrow', 'feature-card-block' ) }
					allowedFormats={ [] }
				/>
				<RichText
					tagName="h3"
					className="feature-card__title"
					value={ title }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					placeholder={ __( 'Card title', 'feature-card-block' ) }
					allowedFormats={ [ 'core/italic' ] }
				/>
				<RichText
					tagName="p"
					className="feature-card__text"
					value={ text }
					onChange={ ( value ) => setAttributes( { text: value } ) }
					placeholder={ __(
						'A short, helpful description…',
						'feature-card-block'
					) }
					allowedFormats={ [
						'core/bold',
						'core/italic',
						'core/link',
					] }
				/>
				{ ctaLabel && (
					<span className="feature-card__cta" aria-hidden="true">
						{ ctaLabel } →
					</span>
				) }
			</div>
		</>
	);
}

/**
 * Feature Card block: registration.
 *
 * The block is dynamic (render.php), so `save` returns null and the markup is
 * always produced by PHP. That keeps old posts in sync with markup changes and
 * avoids block validation errors when the template evolves.
 */
import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import Edit from './edit';
import './style.scss';
import './editor.scss';

registerBlockType( metadata.name, {
	edit: Edit,
	save: () => null,
} );

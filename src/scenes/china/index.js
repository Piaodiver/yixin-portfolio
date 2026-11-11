/**
 * China / Temple of Heaven — embed wrapper.
 *
 * `temple-of-heaven.js` and `temple-of-heaven.css` are verbatim copies from
 * kinetic-curtains/scenes/01-china (do not edit here; re-copy upstream).
 * This file only (a) pulls the scene CSS into the same lazy chunk so Vite
 * injects it before the module runs, (b) exposes a uniform { mount, assetBase }
 * shape for useScene, and (c) resolves the runtime assets (temple image,
 * tiantan.txt) under public/scenes/china/ via the site's base URL, since the
 * module loads them by URL at run time rather than importing them.
 */
import './temple-of-heaven.css';
import { mountTempleOfHeaven } from './temple-of-heaven.js';

export const assetBase = `${import.meta.env.BASE_URL}scenes/china/`;
export const mount = mountTempleOfHeaven;

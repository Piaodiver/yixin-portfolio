/**
 * Israel / Jaffa — embed wrapper.
 *
 * `jaffa.js` and `jaffa.css` are verbatim copies from
 * kinetic-curtains/scenes/03-israel (do not edit here; re-copy upstream).
 * This file only pulls the CSS into the lazy chunk, exposes the uniform
 * { mount, assetBase } shape for useScene, and points assetBase at
 * public/scenes/israel/ (the arch backdrop jaffa-arch.jpg is loaded by URL
 * at run time; the Hebrew/Arabic word pairs are inline in the module).
 */
import './jaffa.css';
import { mountJaffa } from './jaffa.js';

export const assetBase = `${import.meta.env.BASE_URL}scenes/israel/`;
export const mount = mountJaffa;

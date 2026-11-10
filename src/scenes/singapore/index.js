/**
 * Singapore / Merlion — embed wrapper.
 *
 * `merlion.js` and `merlion.css` are verbatim copies from
 * kinetic-curtains/scenes/04-singapore (do not edit here; re-copy upstream).
 * This file only pulls the CSS into the lazy chunk, exposes the uniform
 * { mount, assetBase } shape for useScene, and points assetBase at
 * public/scenes/singapore/ (merlion-scene.jpg and words.txt are fetched by
 * URL at run time).
 */
import './merlion.css';
import { mountMerlion } from './merlion.js';

export const assetBase = `${import.meta.env.BASE_URL}scenes/singapore/`;
export const mount = mountMerlion;

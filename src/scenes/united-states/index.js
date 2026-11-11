/**
 * United States / Golden Gate — embed wrapper.
 *
 * `golden-gate.js` and `golden-gate.css` are verbatim copies from
 * kinetic-curtains/scenes/02-united-states (do not edit here; re-copy
 * upstream). This file only pulls the CSS into the lazy chunk, exposes the
 * uniform { mount, assetBase } shape, and points assetBase at
 * public/scenes/united-states/ (keywords.txt is fetched by URL at run time).
 */
import './golden-gate.css';
import { mountGoldenGate } from './golden-gate.js';

export const assetBase = `${import.meta.env.BASE_URL}scenes/united-states/`;
export const mount = mountGoldenGate;

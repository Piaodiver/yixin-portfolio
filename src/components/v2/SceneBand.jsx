/**
 * SceneBand — placeholder for a Kinetic Curtains scene.
 *
 * Embedding contract (from kinetic-curtains/docs/EMBEDDING.md and
 * scenes/*\/embed-example.html). Nothing is mounted yet; this component only
 * reserves the slot with a shape the scenes can take over later.
 *
 *  - Each scene is an ES module exporting a mount function that takes a
 *    selector or element plus options, and returns a handle with destroy():
 *      01-china          mountTempleOfHeaven('#scene-china', opts)   (.toh-scene)
 *      02-united-states  mountGoldenGate('#scene-united-states', opts) (.gg-scene)
 *      03-israel         mountJaffa('#scene-israel', opts)           (.jaffa-scene)
 *      04-singapore      mountMerlion('#scene-singapore', opts)      (.merlion-scene)
 *    Options used in the embed examples: { chrome:false, title:false,
 *    hud:false, sound:'off' }; also persistTheme:false, pauseOffscreen:true,
 *    assetBase:'...'. destroy() must be called when React unmounts the host.
 *  - The host is ONE EMPTY DIV with a stable id; the scene generates its own
 *    DOM inside it (no iframe, no script tag in HTML). Height is set on the host
 *    via a CSS variable: --kc-height (China/Israel/Singapore) or --gg-height
 *    (United States). We set both so either works.
 *  - Each scene ships its own CSS file, scoped under its root class, and uses
 *    container queries (container-type:size, cqw/cqh), so the host div must be
 *    the sizing box: full width, explicit height.
 *  - Scenes write data-theme on their own root, not on <html>.
 *
 * So the inner <div id={`scene-${place}`}> below is exactly what a scene will
 * be mounted into. The label and caption live outside it so they can be dropped
 * when the real scene arrives.
 */

const LABELS = {
  china: 'China',
  'united-states': 'United States',
  israel: 'Israel',
  singapore: 'Singapore',
};

export default function SceneBand({ place }) {
  const id = `scene-${place}`;
  const label = LABELS[place] ?? place;
  return (
    <div className="scene-band">
      <span className="scene-band__label" aria-hidden="true">{label}</span>
      <span className="scene-band__caption" aria-hidden="true">scene loads here</span>
      {/* mount target — must stay an empty div with this id */}
      <div id={id} className="scene-band__host" data-place={place} />
      {/* No-op for now: the full-screen scene opens from here later. */}
      <button
        type="button"
        className="scene-band__expand"
        data-scene={place}
        aria-label={`Expand the ${label} scene`}
      >
        Expand <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}

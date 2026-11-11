import { useEnter } from '../ink/useReveal';

/**
 * Reveal — a block that eases in the first time it scrolls into view.
 *
 * Built on useEnter, so it can only add to a readable page: anything at or
 * above the fold at first paint, anything under reduced motion, and anything
 * the reader jumps past (hash, Find, restored scroll) renders plainly. Only a
 * block that provably starts below the fold arms itself, and then it eases in
 * once, when it reaches the viewport. The styles are .v2-reveal in v2.css.
 */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const { ref, armed, shown } = useEnter();
  return (
    <Tag
      ref={ref}
      className={`v2-reveal ${className}`.trim()}
      data-armed={armed ? 'true' : undefined}
      data-shown={shown ? 'true' : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

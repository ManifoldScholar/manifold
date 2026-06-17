import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * Closest-edge drop indicator line for a reorderable row. `edge` is the value
 * from `extractClosestEdge` (null when this row isn't the current drop target);
 * `baseClass` is the BEM element class whose `--top`/`--bottom` modifiers are
 * styled via the `dropIndicator()` theme mixin.
 */
export default function DropEdgeIndicator({ edge, baseClass }) {
  if (!edge) return null;

  return (
    <span
      aria-hidden
      className={classNames(baseClass, `${baseClass}--${edge}`)}
    />
  );
}

DropEdgeIndicator.propTypes = {
  edge: PropTypes.oneOf(["top", "bottom"]),
  baseClass: PropTypes.string.isRequired
};

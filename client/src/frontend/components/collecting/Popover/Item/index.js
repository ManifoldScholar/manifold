import { useState } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

/**
 * Star toggle button for a single collection. Controlled: `checked` is
 * exposed as `aria-pressed` and is owned by the parent popover (the store
 * value plus any optimistic override), so this component keeps no pressed
 * state of its own. The filled star shows when checked or hovered. While
 * `pending`, the row is dimmed and the popover ignores further presses for
 * that collection until the request settles. The button stays enabled so it
 * keeps keyboard focus.
 */
function CollectingPopoverItem({
  label,
  checked,
  pending = false,
  onToggle,
  showLock
}) {
  const [hovering, setHovering] = useState(false);
  const icon = checked || hovering ? "StarFillUnique" : "StarOutlineUnique";

  return (
    <Styled.Button
      type="button"
      aria-pressed={checked}
      aria-busy={pending || undefined}
      $pending={pending}
      onClick={onToggle}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Styled.Star icon={icon} size="default" />
      <Styled.Text>{label}</Styled.Text>
      {showLock && <Styled.PrivateIcon icon="lock16" size={20} />}
    </Styled.Button>
  );
}

CollectingPopoverItem.displayName = "Collecting.Popover.Item";

CollectingPopoverItem.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  pending: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  showLock: PropTypes.bool
};

export default CollectingPopoverItem;

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import {
  TransitionGroup as ReactTransitionGroup,
  CSSTransition
} from "react-transition-group";
import IconComposer from "global/components/utility/IconComposer";

const transitionProps = {
  mountOnEnter: true,
  classNames: "collecting-dialog-checkbox__icon",
  timeout: { enter: 0, exit: 0 }
};

function CollectingDialogCheckbox({
  label,
  value,
  checked,
  onChange,
  showLock
}) {
  const uid = useUID();
  const [hovering, setHovering] = useState(false);
  const icon = checked || hovering ? "StarFillUnique" : "StarOutlineUnique";

  return (
    <label
      htmlFor={uid}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="collecting-dialog-checkbox"
    >
      <input
        type="checkbox"
        id={uid}
        name="collecting-dialog"
        value={value}
        checked={checked}
        onChange={onChange}
        className="collecting-dialog-checkbox__input"
      />
      <span className="collecting-dialog-checkbox__label">
        <span className="collecting-dialog-checkbox__icon-block">
          <ReactTransitionGroup>
            <CSSTransition key={icon} {...transitionProps}>
              <IconComposer
                icon={icon}
                size="default"
                iconClass="collecting-dialog-checkbox__icon"
              />
            </CSSTransition>
          </ReactTransitionGroup>
        </span>
        <span className="collecting-dialog-checkbox__title">{label}</span>
        {showLock && (
          <IconComposer
            icon="lock16"
            size={18}
            iconClass="collecting-dialog-checkbox__lock-icon"
          />
        )}
      </span>
    </label>
  );
}

CollectingDialogCheckbox.displayName = "Collecting.Dialog.Checkbox";

CollectingDialogCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  showLock: PropTypes.bool
};

export default CollectingDialogCheckbox;

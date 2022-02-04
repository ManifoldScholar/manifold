import React from "react";
import PropTypes from "prop-types";
import { MenuItemRadio } from "reakit/Menu";
import IconComposer from "global/components/utility/IconComposer";

function RGMenuItem({
  as,
  menu,
  label,
  onClick,
  selected,
  value,
  privateGroup
}) {
  return (
    <MenuItemRadio
      {...menu}
      as={as}
      onChange={onClick}
      tabIndex={menu?.visible ? undefined : -1}
      value={value}
      checked={selected}
      name="readingGroupOption"
      className="annotation-popup-menu-item"
    >
      <div className="annotation-popup-menu-item__inner">
        {selected && (
          <IconComposer
            icon="checkmark16"
            size={22}
            className="annotation-popup-menu-item__selected-icon"
          />
        )}
        <span className="annotation-popup-menu-item__text">{label}</span>
        {privateGroup && (
          <IconComposer
            icon="lock16"
            size={18}
            className="annotation-popup-menu-item__private-icon"
          />
        )}
      </div>
    </MenuItemRadio>
  );
}

RGMenuItem.displayName = "Annotation.Popup.RGMenuItem";

RGMenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  menu: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  as: PropTypes.oneOf(["MenuItem", "button"]),
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  privateGroup: PropTypes.bool
};

export default RGMenuItem;

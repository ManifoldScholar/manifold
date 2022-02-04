import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { MenuItemRadio } from "reakit/Menu";
import IconComposer from "global/components/utility/IconComposer";

function RGMenuItem({ menu, label, onClick, selected, value, privateGroup }) {
  const Tag = !isEmpty(menu) ? MenuItemRadio : "button";
  const itemProps = !isEmpty(menu)
    ? {
        ...menu,
        tabIndex: menu.visible ? undefined : -1,
        onChange: onClick,
        value,
        checked: selected,
        name: "readingGroupOption"
      }
    : {
        onClick,
        type: "button"
      };

  return (
    <Tag {...itemProps} className="annotation-popup-menu-item">
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
    </Tag>
  );
}

RGMenuItem.displayName = "Annotation.Popup.RGMenuItem";

RGMenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string,
  menu: PropTypes.object,
  selected: PropTypes.bool,
  privateGroup: PropTypes.bool
};

export default RGMenuItem;

import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

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
    <Styled.Item
      {...menu}
      as={as}
      onChange={onClick}
      tabIndex={menu?.visible ? undefined : -1}
      value={value}
      checked={selected}
      name="readingGroupOption"
    >
      <Styled.Inner>
        {selected && <Styled.SelectedIcon icon="checkmark16" size={22} />}
        <Styled.Text>{label}</Styled.Text>
        {privateGroup && <Styled.PrivateIcon icon="lock16" size={18} />}
      </Styled.Inner>
    </Styled.Item>
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

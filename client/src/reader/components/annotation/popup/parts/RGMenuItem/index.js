import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { MenuItemRadio } from "reakit/Menu";
import * as Styled from "./styles";

function RGMenuItem({ menu, label, onClick, selected, value, privateGroup }) {
  const as = !isEmpty(menu) ? MenuItemRadio : "button";
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
    <Styled.RGMenuItem as={as} {...itemProps}>
      <Styled.Inner>
        {selected && <Styled.SelectedIcon icon="checkmark16" size={20} />}
        <Styled.Label>{label}</Styled.Label>
        {privateGroup && <Styled.PrivateIcon icon="lock16" size={20} />}
      </Styled.Inner>
    </Styled.RGMenuItem>
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

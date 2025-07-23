import PropTypes from "prop-types";
import Authorize from "hoc/Authorize";
import * as Styled from "./styles";

function MenuItem({
  menu,
  kind,
  entity,
  ability,
  onClick,
  icon,
  label,
  srLabel,
  children,
  ...menuProps
}) {
  return (
    <Authorize kind={kind} entity={entity} ability={ability}>
      {children && children}
      {!children && (
        <Styled.MenuItem
          {...menu}
          {...menuProps}
          onClick={onClick}
          onTouchEnd={onClick}
          tabIndex={menu.visible ? undefined : -1}
        >
          {icon && <Styled.Icon icon={icon} size={24} />}
          <Styled.Label aria-hidden={!!srLabel}>{label}</Styled.Label>
          {srLabel && <span className="screen-reader-text">{srLabel}</span>}
        </Styled.MenuItem>
      )}
    </Authorize>
  );
}

MenuItem.displayName = "Annotation.Popup.MenuItem";

MenuItem.propTypes = {
  menu: PropTypes.object.isRequired,
  kind: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  entity: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.array
  ]),
  ability: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onClick: PropTypes.func,
  label: PropTypes.string,
  srLabel: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default MenuItem;

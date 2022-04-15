import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { MenuItem as ReakitMenuItem } from "reakit/Menu";
import IconComposer from "global/components/utility/IconComposer";
import Authorize from "hoc/Authorize";

function MenuItem({
  menu,
  kind,
  entity,
  ability,
  onClick,
  icon,
  label,
  srLabel,
  className,
  children,
  ...menuProps
}) {
  return (
    <Authorize kind={kind} entity={entity} ability={ability}>
      {children && children}
      {!children && (
        <ReakitMenuItem
          {...menu}
          {...menuProps}
          onClick={onClick}
          onTouchEnd={onClick}
          tabIndex={menu.visible ? undefined : -1}
          className={classNames("annotation-popup__button", className)}
        >
          {icon && (
            <IconComposer
              icon={icon}
              size={24}
              className="annotation-popup__button-icon"
            />
          )}
          <span
            className="annotation-popup__button-text"
            aria-hidden={!!srLabel}
          >
            {label}
          </span>
          {srLabel && <span className="screen-reader-text">{srLabel}</span>}
        </ReakitMenuItem>
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

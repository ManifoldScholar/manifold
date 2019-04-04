import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import Button from "./DrawerHeader/Button";

export default class DrawerEntityHeader extends PureComponent {
  static displayName = "Drawer.EntityHeader";

  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.any,
    buttons: PropTypes.array,
    icon: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    buttons: []
  };

  render() {
    return (
      <header className="drawer-header">
        {this.props.title && (
          <h2 className="drawer-header__title">
            {this.props.icon && (
              <Utility.IconComposer
                icon={this.props.icon}
                size={44}
                iconClass="drawer-header__title-icon"
              />
            )}
            <span className="drawer-header__title-text">
              {this.props.title}
            </span>
          </h2>
        )}
        {this.props.children}
        {this.props.buttons.length > 0 && (
          <div className="drawer-header__utility utility-button-group utility-button-group--stack">
            {this.props.buttons &&
              this.props.buttons.map(button => (
                <Button key={button.label} {...button} />
              ))}
          </div>
        )}
      </header>
    );
  }
}

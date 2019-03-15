import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import Authorize from "hoc/authorize";

export default class DrawerEntityHeader extends PureComponent {
  static displayName = "Drawer.EntityHeader";

  static propTypes = {
    title: PropTypes.string,
    manicon: PropTypes.string,
    children: PropTypes.any,
    buttons: PropTypes.array,
    icon: PropTypes.string
  };

  static defaultProps = {
    buttons: []
  };

  iconClassFor(icon) {
    if (["trash", "delete32", "notifications24"].includes(icon))
      return "notice";
  }

  buttonIcon(icon) {
    if (!icon) return null;
    return (
      <Utility.IconComposer
        icon={icon}
        size={24}
        iconClass={this.iconClassFor(icon)}
      />
    );
  }

  render() {
    return (
      <header className="drawer-header">
        {this.props.title && (
          <h2 className="heading-quaternary">
            {this.props.manicon && (
              <i
                className={`manicon manicon-${this.props.manicon}`}
                aria-hidden="true"
              />
            )}
            {this.props.icon && (
              <Utility.IconComposer icon={this.props.icon} size={44} />
            )}
            {this.props.title}
          </h2>
        )}
        {this.props.children}
        {this.props.buttons.length > 0 && (
          <div className="buttons-bare-vertical">
            {this.props.buttons &&
              this.props.buttons.map(b => {
                const button = (
                  <button
                    key={b.label}
                    className="button-bare-primary"
                    onClick={b.onClick}
                    type="button"
                  >
                    {this.buttonIcon(b.icon)}
                    {b.label}
                  </button>
                );
                if (b.ability)
                  return (
                    <Authorize
                      key={b.label}
                      entity={b.entity}
                      ability={b.ability}
                    >
                      {button}
                    </Authorize>
                  );
                return button;
              })}
          </div>
        )}
      </header>
    );
  }
}

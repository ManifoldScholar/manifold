import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import Authorize from "hoc/authorize";

export default class DrawerEntityHeaderButton extends PureComponent {
  static defaultProps = {
    iconClass: ""
  };

  static displayName = "Drawer.EntityHeader.Button";

  static propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    iconClass: PropTypes.string,
    ability: PropTypes.string,
    entity: PropTypes.object
  };

  get Button() {
    return (
      <button
        className="button-bare-primary"
        onClick={this.props.onClick}
        type="button"
      >
        <Utility.IconComposer
          icon={this.props.icon}
          size={24}
          iconClass={this.props.iconClass}
        />
        {this.props.label}
      </button>
    );
  }

  render() {
    if (this.props.ability)
      return (
        <Authorize
          key={this.props.label}
          entity={this.props.entity}
          ability={this.props.ability}
        >
          {this.Button}
        </Authorize>
      );

    return this.Button;
  }
}

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";
import Authorize from "hoc/Authorize";

export default class DrawerEntityHeaderButton extends PureComponent {
  static displayName = "Drawer.EntityHeader.Button";

  static propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    ability: PropTypes.string,
    entity: PropTypes.object,
    ariaProps: PropTypes.object
  };

  static defaultProps = {
    className: ""
  };

  get buttonClasses() {
    return classNames(this.props.className, "utility-button__icon");
  }

  get Button() {
    return (
      <button
        className="utility-button"
        onClick={this.props.onClick}
        type="button"
        {...this.props.ariaProps}
      >
        <Utility.IconComposer
          icon={this.props.icon}
          size={24}
          className={this.buttonClasses}
        />
        <span className="utility-button__text">{this.props.label}</span>
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

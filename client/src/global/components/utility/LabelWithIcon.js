import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconComposer from "./IconComposer";

export default class LabelWithIcon extends React.PureComponent {
  static propTypes = {};

  get icon() {
    return this.props.icon;
  }

  get name() {
    return this.props.label;
  }

  get textStyle() {
    return this.props.textStyle;
  }

  get labelclassName() {
    return "label-with-icon__icon";
  }

  get containerClassNames() {
    return classNames({
      "label-with-icon": true,
      "label-with-icon__text-large": this.textStyle === "large"
    });
  }

  render() {
    return (
      <span className={this.containerClassNames}>
        {this.icon && (
          <IconComposer
            icon={this.icon}
            size={24}
            className={this.labelclassName}
          />
        )}
        {this.name && this.name + ":"}
      </span>
    );
  }
}

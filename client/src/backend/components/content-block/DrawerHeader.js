import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Navigation from "backend/components/navigation";
import resolver from "./helpers/resolver";

export default class ContentBlockDrawerHeader extends PureComponent {
  static displayName = "ContentBlock.DrawerHeader";

  static propTypes = {
    contentBlock: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onVisibilityToggle: PropTypes.func,
    icon: PropTypes.string
  };

  get contentBlock() {
    return this.props.contentBlock;
  }

  get title() {
    const BlockComponent = resolver.typeToBlockComponent(
      this.contentBlock.attributes.type
    );
    if (
      BlockComponent &&
      BlockComponent.defaultProps &&
      BlockComponent.defaultProps.title
    )
      return BlockComponent.defaultProps.title;
    return "Content Block";
  }

  get icon() {
    const BlockComponent = resolver.typeToBlockComponent(
      this.contentBlock.attributes.type
    );
    if (
      BlockComponent &&
      BlockComponent.defaultProps &&
      BlockComponent.defaultProps.icon
    )
      return BlockComponent.defaultProps.icon;
    return null;
  }

  get onDelete() {
    return this.props.onDelete;
  }

  get onVisibilityToggle() {
    return this.props.onVisibilityToggle;
  }

  get hidden() {
    return this.contentBlock && !this.contentBlock.attributes.visible;
  }

  get buttons() {
    const buttons = [];
    if (this.onDelete)
      buttons.push({
        onClick: this.onDelete,
        label: "delete",
        icon: "delete32"
      });
    if (this.onVisibilityToggle)
      buttons.push({
        onClick: this.onVisibilityToggle,
        label: this.hidden ? "show" : "hide",
        icon: this.hidden ? "eyeClosed32" : "eyeOpen32"
      });
    return buttons;
  }

  render() {
    return (
      <Navigation.DrawerHeader
        icon={this.icon}
        title={this.title}
        buttons={this.buttons}
      />
    );
  }
}

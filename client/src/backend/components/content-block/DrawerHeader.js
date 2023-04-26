import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Layout from "backend/components/layout";
import resolver from "./helpers/resolver";
import { withTranslation } from "react-i18next";

class ContentBlockDrawerHeader extends PureComponent {
  static displayName = "ContentBlock.DrawerHeader";

  static propTypes = {
    contentBlock: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onVisibilityToggle: PropTypes.func,
    icon: PropTypes.string,
    t: PropTypes.func
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
    return this.props.t("glossary.content_block_title_case_one");
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
    if (this.onVisibilityToggle)
      buttons.push({
        onClick: this.onVisibilityToggle,
        label: this.hidden
          ? this.props.t("actions.show")
          : this.props.t("actions.hide"),
        icon: this.hidden ? "eyeOpen32" : "eyeClosed32",
        className: "utility-button__icon--highlight"
      });
    if (this.onDelete)
      buttons.push({
        onClick: this.onDelete,
        label: this.props.t("actions.delete"),
        icon: "delete32",
        className: "utility-button__icon--notice"
      });
    return buttons;
  }

  render() {
    return (
      <Layout.DrawerHeader
        icon={this.icon}
        title={this.props.t(this.title)}
        buttons={this.buttons}
      />
    );
  }
}

export default withTranslation()(ContentBlockDrawerHeader);

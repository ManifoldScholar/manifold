import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import classnames from "classnames";
import { withTranslation } from "react-i18next";

class ProjectContentBlockIdentity extends PureComponent {
  static displayName = "Project.Content.Block.Parts.Identity";

  static propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    requiresAttention: PropTypes.bool,
    size: PropTypes.oneOf(["small", "large"]),
    entity: PropTypes.object,
    t: PropTypes.func
  };

  static defaultProps = {
    size: "small",
    renderable: true
  };

  get requiresAttention() {
    return this.props.requiresAttention;
  }

  get icon() {
    return this.requiresAttention ? "warningSign64" : this.props.icon;
  }

  get showVisibility() {
    return !!this.props.entity;
  }

  get access() {
    if (!this.props.entity) return;
    switch (this.props.entity.attributes.access) {
      case "unauthorized":
        return this.props.t("layout.unauthorized");
      case "authorized":
        return this.props.t("layout.authorized");
      default:
        return null;
    }
  }

  get visible() {
    if (!this.props.entity) return;
    return this.props.entity.attributes.visible;
  }

  render() {
    const size = this.props.size;
    const iconSize = size === "large" ? 46 : 36;
    const baseClass = "backend-content-block";
    const titleClasses = `${baseClass}__title ${baseClass}__title--${size}`;
    const classNamees = classnames(
      `${baseClass}__icon ${baseClass}__icon--dark ${baseClass}__icon--${size}`,
      { [`${baseClass}__icon--incomplete`]: this.requiresAttention }
    );
    const translatedTitle = this.props.t(this.props.title);

    return (
      <header className="backend-content-block__heading">
        <Utility.IconComposer
          icon={this.icon}
          className={classNamees}
          size={iconSize}
        />
        <span className={titleClasses}>
          {translatedTitle}
          {this.showVisibility && !this.visible && (
            <span className="backend-content-block__label">
              {this.props.t("common.hidden")}
            </span>
          )}
          {this.access && (
            <span className="backend-content-block__label">{this.access}</span>
          )}
        </span>
      </header>
    );
  }
}

export default withTranslation()(ProjectContentBlockIdentity);

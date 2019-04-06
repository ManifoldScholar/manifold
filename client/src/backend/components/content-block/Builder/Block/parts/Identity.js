import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import classnames from "classnames";

export default class ProjectContentBlockIdentity extends PureComponent {
  static displayName = "Project.Content.Block.Parts.Identity";

  static propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    requiresAttention: PropTypes.bool,
    size: PropTypes.oneOf(["small", "large"]),
    entity: PropTypes.object
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

  get visible() {
    if (!this.props.entity) return;
    return this.props.entity.attributes.visible;
  }

  render() {
    const size = this.props.size;
    const iconSize = size === "large" ? 46 : 36;
    const baseClass = "content-block";
    const titleClasses = `${baseClass}__title ${baseClass}__title--${size}`;
    const iconClasses = classnames(
      `${baseClass}__icon ${baseClass}__icon--dark ${baseClass}__icon--${size}`,
      { [`${baseClass}__icon--incomplete`]: this.requiresAttention }
    );

    return (
      <header className="content-block__heading">
        <Utility.IconComposer
          icon={this.icon}
          iconClass={iconClasses}
          size={iconSize}
        />
        <span className={titleClasses}>
          {this.props.title}
          {this.showVisibility && !this.visible && (
            <span className="content-block__label">Hidden</span>
          )}
        </span>
      </header>
    );
  }
}

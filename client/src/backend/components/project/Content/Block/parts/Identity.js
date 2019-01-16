import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ProjectContentBlockIdentity extends PureComponent {
  static displayName = "Project.Content.Block.Parts.Identity";

  static propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    size: PropTypes.oneOf(["small", "large"])
  };

  static defaultProps = {
    size: "small"
  };

  render() {
    const size = this.props.size;
    const iconSize = size === "large" ? 46 : 36;
    const baseClass = "content-block";
    const titleClasses = `${baseClass}__title ${baseClass}__title--${size}`;
    const iconClasses = `${baseClass}__icon ${baseClass}__icon--dark ${baseClass}__icon--${size}`;

    return (
      <header className="content-block__heading">
        <Utility.IconComposer
          icon={this.props.icon}
          iconClass={iconClasses}
          size={iconSize}
        />
        <span className={titleClasses}>{this.props.title}</span>
      </header>
    );
  }
}

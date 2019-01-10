import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ProjectContentBlockInListPartsDelete extends PureComponent {
  static displayName = "Project.Content.Block.InList.Parts.Delete";

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    baseClass: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired
  };

  render() {
    if (!this.props.visible) return null;
    const iconClass = `${this.props.baseClass}__icon ${this.props.baseClass}__icon--light`;

    return (
      <button
        className={`${this.props.baseClass}__button ${this.props.baseClass}__button--delete`}
        onClick={this.props.clickHandler}
      >
        <Utility.IconComposer
          icon="trash"
          size={26}
          iconClass={iconClass}
        />
      </button>
    );
  }
}

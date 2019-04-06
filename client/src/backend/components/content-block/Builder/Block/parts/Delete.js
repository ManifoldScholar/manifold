import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ProjectContentBlockInListPartsDelete extends PureComponent {
  static displayName = "Project.Content.Block.InList.Parts.Delete";

  static propTypes = {
    baseClass: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired
  };

  render() {
    const iconClass = `${this.props.baseClass}__icon ${
      this.props.baseClass
    }__icon--light`;

    return (
      <button
        className={`${this.props.baseClass}__button ${
          this.props.baseClass
        }__button--delete`}
        onClick={this.props.clickHandler}
        title="Delete content block"
      >
        <Utility.IconComposer icon="delete32" size={26} iconClass={iconClass} />
      </button>
    );
  }
}

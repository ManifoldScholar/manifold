import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { withTranslation } from "react-i18next";

class ProjectContentBlockInListPartsDelete extends PureComponent {
  static displayName = "Project.Content.Block.InList.Parts.Delete";

  static propTypes = {
    baseClass: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired,
    blockTitle: PropTypes.string,
    t: PropTypes.func
  };

  render() {
    const className = `${this.props.baseClass}__icon ${this.props.baseClass}__icon--light`;
    const translatedTitle = this.props.t(this.props.blockTitle);

    return (
      <button
        className={`${this.props.baseClass}__button ${this.props.baseClass}__button--delete`}
        onClick={this.props.clickHandler}
        aria-label={this.props.t("layout.delete_block", {
          blockTitle: translatedTitle
        })}
      >
        <Utility.IconComposer icon="delete32" size={26} className={className} />
      </button>
    );
  }
}

export default withTranslation()(ProjectContentBlockInListPartsDelete);

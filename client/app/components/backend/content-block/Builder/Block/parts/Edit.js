import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { withTranslation } from "react-i18next";

class ProjectContentBlockInListPartsEdit extends PureComponent {
  static displayName = "Project.Content.Block.InList.Parts.Edit";

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    baseClass: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired,
    blockTitle: PropTypes.string,
    t: PropTypes.func
  };

  render() {
    if (!this.props.visible) return null;
    const className = `${this.props.baseClass}__icon ${this.props.baseClass}__icon--light`;
    const translatedTitle = this.props.t(this.props.blockTitle);

    return (
      <button
        className={`${this.props.baseClass}__button`}
        onClick={this.props.clickHandler}
        aria-label={this.props.t("layout.edit_block", {
          blockTitle: translatedTitle
        })}
      >
        <Utility.IconComposer
          icon="annotate32"
          size={26}
          className={className}
        />
      </button>
    );
  }
}

export default withTranslation()(ProjectContentBlockInListPartsEdit);

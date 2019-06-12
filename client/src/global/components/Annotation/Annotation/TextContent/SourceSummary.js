import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class SourceSummary extends React.PureComponent {
  static propTypes = {
    projectTitle: PropTypes.string,
    sectionTitle: PropTypes.string
  };

  render() {
    const { projectTitle, sectionTitle } = this.props;

    return (
      <div className="annotation-selection__source-summary">
        <span className="annotation-selection__source-summary-text">
          {`from "${sectionTitle}" in `}
          <i>{projectTitle}</i>
        </span>
        <Utility.IconComposer
          icon="arrowLongRight16"
          size={24}
          iconClass="annotation-selection__hover-arrow"
        />
      </div>
    )
  }
}

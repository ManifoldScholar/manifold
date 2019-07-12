import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import FormattedDate from "global/components/FormattedDate";

export default class SourceSummary extends React.PureComponent {
  static propTypes = {
    projectTitle: PropTypes.string,
    sectionTitle: PropTypes.string
  };

  renderUser(user) {
    return (
      <React.Fragment>
        <i>{user}</i>
        {" highlighted "}
      </React.Fragment>
    );
  }

  renderDate(highlightDate) {
    return (
      <React.Fragment>
        {" on "}
        <FormattedDate date={highlightDate} />
      </React.Fragment>
    );
  }

  render() {
    const { projectTitle, sectionTitle, user, highlightDate } = this.props;

    return (
      <div className="annotation-selection__source-summary">
        <span className="annotation-selection__source-summary-text">
          {user ? this.renderUser(user) : "from "}
          {`"${sectionTitle}" in `}
          <i>{projectTitle}</i>
          {highlightDate && this.renderDate(highlightDate)}
        </span>
        <Utility.IconComposer
          icon="arrowLongRight16"
          size={24}
          iconClass="annotation-selection__hover-arrow"
        />
      </div>
    );
  }
}

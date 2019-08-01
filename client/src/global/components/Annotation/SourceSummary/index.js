import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import FormattedDate from "global/components/FormattedDate";

export default class SourceSummary extends React.PureComponent {
  static propTypes = {
    user: PropTypes.string,
    projectTitle: PropTypes.string,
    sectionTitle: PropTypes.string,
    highlightDate: PropTypes.string,
    viewable: PropTypes.bool
  };

  renderUser() {
    if (!this.props.user) return null;
    return (
      <React.Fragment>
        <i>{this.props.user}</i>
        {" highlighted "}
      </React.Fragment>
    );
  }

  renderSectionAndTitle() {
    const { user, projectTitle, sectionTitle } = this.props;
    if (!projectTitle && !sectionTitle) return null;

    return (
      <React.Fragment>
        {!user && "from "}
        {sectionTitle && `“${sectionTitle}”`}
        {(sectionTitle && projectTitle) && " in "}
        {projectTitle && <i>{projectTitle}</i>}
      </React.Fragment>
    );
  }

  renderDate() {
    if (!this.props.highlightDate) return null;
    return (
      <React.Fragment>
        {" on "}
        <FormattedDate date={this.props.highlightDate} />
      </React.Fragment>
    );
  }

  render() {
    const {
      user,
      projectTitle,
      sectionTitle,
      highlightDate,
      viewable
    } = this.props;

    if (!user && !projectTitle && !sectionTitle && !highlightDate) return null;

    return (
      <div className="annotation-selection__source-summary">
        <span className="annotation-selection__source-summary-text">
          {this.renderUser()}
          {this.renderSectionAndTitle()}
          {this.renderDate()}
        </span>
        {viewable && (
          <Utility.IconComposer
            icon="arrowLongRight16"
            size={24}
            iconClass="annotation-selection__hover-arrow"
          />
        )}
      </div>
    );
  }
}

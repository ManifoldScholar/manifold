import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import GlobalProject from "global/components/project";
import FormattedDate from "global/components/FormattedDate";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import Collecting from "frontend/components/collecting";

export default class IssueGridItem extends Component {
  static displayName = "Issue.GridItem";

  static propTypes = {
    issue: PropTypes.object,
    hideMeta: PropTypes.bool,
    hideDate: PropTypes.bool,
    hideDesc: PropTypes.bool,
    hideCollectingToggle: PropTypes.bool
  };

  get hideCollectingToggle() {
    return this.props.hideCollectingToggle;
  }

  shouldShowUpdated(issue) {
    const { updated, finished } = issue.attributes;
    return !finished && Boolean(updated);
  }

  renderPublishedDate(issue) {
    const attr = issue.attributes;
    if (attr.publicationDate && !this.props.hideDate) {
      return (
        <div className="date" aria-hidden>
          <FormattedDate
            prefix="Published"
            format="MMMM, yyyy"
            date={attr.publicationDate}
          />
        </div>
      );
    }
    return null;
  }

  renderIssueDesc(issue) {
    if (this.props.hideDesc || !issue.attributes.subtitle) return null;
    return (
      <p className="description" aria-hidden>
        {issue.attributes.subtitle}
      </p>
    );
  }

  renderIssueStatusMarker(issue) {
    // Currently, this can only return a 'draft' marker
    let marker = null;

    if (issue.attributes.draft) {
      marker = (
        <div className="block-label" aria-hidden>
          {"Draft"}
        </div>
      );
    }

    return marker;
  }

  renderVolumeIssue(issue) {
    return (
      <div className="relations-list" aria-hidden>
        <span>
          Volume {issue.volume}, Issue {issue.issue}
        </span>
      </div>
    );
  }

  renderUpdatedDate(issue) {
    if (issue.attributes.draft) return null;
    const classes = classNames({
      date: true,
      alert: issue.attributes.recentlyUpdated
    });
    return (
      <div className={classes} aria-hidden>
        <FormattedDate
          prefix="Updated"
          format="MMMM, yyyy"
          date={issue.attributes.updatedAt}
        />
      </div>
    );
  }

  render() {
    const issue = this.props.issue;
    let issueMeta = null;
    if (!this.props.hideMeta) {
      issueMeta = (
        <div className="meta">
          <h3 className="name">
            <span
              className="title-text"
              dangerouslySetInnerHTML={{
                __html: issue.attributes.titleFormatted
              }}
            />
            {this.renderIssueStatusMarker(issue)}
          </h3>
          {this.renderVolumeIssue(issue)}
          {this.shouldShowUpdated(issue)
            ? this.renderUpdatedDate(issue)
            : this.renderPublishedDate(issue)}
          {this.renderIssueDesc(issue)}
        </div>
      );
    }

    const figureClass = classNames("cover", {
      "cover-placeholder": issue.attributes.avatarStyles.small,
      dim: issue.attributes.draft
    });

    return (
      <>
        <Link to={lh.link("frontendIssueDetail", issue.attributes.slug)}>
          <figure className={figureClass}>
            <GlobalProject.Avatar project={issue} />
          </figure>
          {issueMeta}
        </Link>
        {!this.hideCollectingToggle && (
          <Collecting.Toggle
            collectable={issue}
            inline={false}
            outlined={false}
          />
        )}
      </>
    );
  }
}

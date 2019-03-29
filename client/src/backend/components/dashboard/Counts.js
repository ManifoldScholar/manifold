import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Activity extends Component {
  static displayName = "Dashboard.Counts";

  static propTypes = {
    statistics: PropTypes.shape({
      attributes: PropTypes.shape({
        newTextsCount: PropTypes.number,
        readersThisWeek: PropTypes.oneOfType([
          PropTypes.bool,
          PropTypes.number
        ]),
        readerIncrease: PropTypes.number,
        newHighlightsCount: PropTypes.number,
        newAnnotationsCount: PropTypes.number
      })
    })
  };

  render() {
    if (!this.props.statistics) return null;
    const stats = this.props.statistics.attributes;

    return (
      <div className="backend-activity-stats">
        <ul className="backend-activity-stats__list">
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">Projects</span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalProjectCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">Texts</span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalTextCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              Annotations
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalAnnotationCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">Comments</span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalCommentCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">Resources</span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalResourceCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">Users</span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalUserCount}
            </span>
          </li>
        </ul>
      </div>
    );
  }
}

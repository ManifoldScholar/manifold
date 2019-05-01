import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Activity extends Component {
  static displayName = "Dashboard.Activity";

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

  formatReaderIncrease(stats) {
    const { readerIncrease: increase } = stats;

    if (increase === null) return "";
    if (increase > 0) return "+" + increase.toString() + "%";
    if (increase < 0) return "-" + Math.abs(increase).toString() + "%";
    return "0%";
  }

  render() {
    if (!this.props.statistics) return null;
    const stats = this.props.statistics.attributes;

    return (
      <div className="backend-activity-stats">
        <ul className="backend-activity-stats__list">
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              Texts added this week
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.newTextsCount}
            </span>
          </li>
          {stats.readersThisWeek !== null ? (
            <li className="backend-activity-stats__list-item">
              <span className="backend-activity-stats__list-text">
                Readers this week
              </span>
              <span className="backend-activity-stats__list-text--highlighted">
                {stats.readersThisWeek}
              </span>
            </li>
          ) : null}
          {stats.readerIncrease != null ? (
            <li className="backend-activity-stats__list-item">
              <span className="backend-activity-stats__list-text">
                Change from last week
              </span>
              <span className="backend-activity-stats__list-text--highlighted">
                {this.formatReaderIncrease(stats)}
              </span>
            </li>
          ) : null}
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              Highlights in the past week
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.newHighlightsCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              Annotations in the past week
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.newAnnotationsCount}
            </span>
          </li>
        </ul>
      </div>
    );
  }
}

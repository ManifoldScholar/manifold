import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

class Activity extends Component {
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
    }),
    t: PropTypes.func
  };

  formatReaderIncrease(stats) {
    const increase = stats.readerIncrease;

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
              {this.props.t("dashboard.text_stats")}
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.newTextsCount}
            </span>
          </li>
          {stats.readersThisWeek !== null ? (
            <li className="backend-activity-stats__list-item">
              <span className="backend-activity-stats__list-text">
                {this.props.t("dashboard.reader_stats")}
              </span>
              <span className="backend-activity-stats__list-text--highlighted">
                {stats.readersThisWeek}
              </span>
            </li>
          ) : null}
          {stats.readerIncrease != null ? (
            <li className="backend-activity-stats__list-item">
              <span className="backend-activity-stats__list-text">
                {this.props.t("dashboard.stats_change")}
              </span>
              <span className="backend-activity-stats__list-text--highlighted">
                {this.formatReaderIncrease(stats)}
              </span>
            </li>
          ) : null}
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              {this.props.t("dashboard.highlight_stats")}
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.newHighlightsCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              {this.props.t("dashboard.annotation_stats")}
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

export default withTranslation()(Activity);

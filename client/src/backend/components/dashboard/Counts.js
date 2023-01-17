import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

class Activity extends Component {
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
    }),
    t: PropTypes.func
  };

  render() {
    if (!this.props.statistics) return null;
    const stats = this.props.statistics.attributes;
    const t = this.props.t;

    return (
      <div className="backend-activity-stats">
        <ul className="backend-activity-stats__list">
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              {t("glossary.project_title_case_other")}
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalProjectCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              {t("glossary.text_title_case_other")}
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalTextCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              {t("glossary.annotation_title_case_other")}
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalAnnotationCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              {t("glossary.comment_title_case_other")}
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalCommentCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              {t("glossary.resource_title_case_other")}
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalResourceCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              {t("glossary.user_title_case_other")}
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalUserCount}
            </span>
          </li>
          <li className="backend-activity-stats__list-item">
            <span className="backend-activity-stats__list-text">
              {t("glossary.reading_group_title_case_other")}
            </span>
            <span className="backend-activity-stats__list-text--highlighted">
              {stats.totalReadingGroupCount}
            </span>
          </li>
        </ul>
      </div>
    );
  }
}

export default withTranslation()(Activity);

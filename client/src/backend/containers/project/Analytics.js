import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";

import withAnalyticsReport from "hoc/analytics/withAnalyticsReport";
import Authorize from "hoc/Authorize";

export class AnalyticsContainer extends PureComponent {
  static displayName = "Project.Analytics";

  static propTypes = {
    project: PropTypes.object.isRequired,
    analytics: PropTypes.object,
    fetchStats: PropTypes.func.isRequired,
    fetchAnalytics: PropTypes.func.isRequired,
    updateAnalyticsRange: PropTypes.func.isRequired,
    analyticsStartDate: PropTypes.instanceOf(Date),
    analyticsEndDate: PropTypes.instanceOf(Date)
  };

  componentDidMount() {
    const { project } = this.props;
    this.props.fetchAnalytics("project", {
      record_type: "Project",
      record_id: project.id
    });
  }

  componentDidUpdate() {
    const {
      params: { id: nextId }
    } = this.props.match ?? {};
    const prevId = this.props.project?.id;
    if (nextId && prevId && nextId !== prevId)
      this.props.fetchAnalytics("project", {
        record_type: "Project",
        record_id: nextId
      });
  }

  render() {
    const {
      project,
      analytics,
      updateAnalyticsRange,
      analyticsStartDate,
      analyticsEndDate,
      analyticsRangeInWords
    } = this.props;

    return (
      <Authorize
        entity={project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <Grid columns={3}>
          {analytics && (
            <>
              <RangePicker
                onNewRangeSelected={updateAnalyticsRange}
                initialStart={analyticsStartDate}
                initialEnd={analyticsEndDate}
                className="analytics-grid__item--100"
              />
              <AnalyticsFactory
                view="Visitors"
                report="daily_visitors"
                additionalReport="unique_visitors"
                data={analytics}
                rangeInWords={analyticsRangeInWords}
              />
              <AnalyticsFactory
                view="Annotations"
                report="annotations"
                data={analytics}
                rangeInWords={analyticsRangeInWords}
              />
              <AnalyticsFactory
                view="Highlights"
                report="annotations"
                data={analytics}
                rangeInWords={analyticsRangeInWords}
              />
              <AnalyticsFactory
                view="NewCollectors"
                report="favorites_this_period"
                data={analytics}
                rangeInWords={analyticsRangeInWords}
              />
              <AnalyticsFactory
                view="AllCollectors"
                report="total_favorites"
                data={analytics}
              />
            </>
          )}
        </Grid>
      </Authorize>
    );
  }
}

export default withAnalyticsReport(AnalyticsContainer);

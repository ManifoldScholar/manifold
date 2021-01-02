import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import {
  ComposedAnalytics,
  Grid,
  RangePicker
} from "backend/components/analytics";

import withAnalyticsReport from "hoc/analytics/with-analytics-report";
import Authorize from "hoc/authorize";

export class AnalyticsContainer extends PureComponent {
  static displayName = "Project.Analytics";

  static propTypes = {
    project: PropTypes.object.isRequired,
    statistics: PropTypes.object,
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

  get reports() {
    if (!this.props.analytics) return [];
    const {
      attributes: { reports }
    } = this.props.analytics;
    return reports;
  }

  find(name) {
    return this.reports.find(element => element.name === name);
  }

  render() {
    const { project, analytics } = this.props;

    return (
      <Authorize
        entity={project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section className="backend-dashboard">
          <Grid columns={3}>
            {analytics && (
              <>
                <RangePicker
                  onNewRangeSelected={this.props.updateAnalyticsRange}
                  defaultStart={this.props.analyticsStartDate}
                  defaultEnd={this.props.analyticsEndDate}
                  className="analytics-grid__item--100"
                />
                <ComposedAnalytics.Visitors
                  data={this.find("daily_visitors")}
                />
                <ComposedAnalytics.Annotations />
                <ComposedAnalytics.Highlights data={this.find("annotations")} />
                <ComposedAnalytics.NewFollowers
                  data={this.find("favorites_this_period")}
                />
                <ComposedAnalytics.AllFollowers
                  data={this.find("total_favorites")}
                />
              </>
            )}
          </Grid>
        </section>
      </Authorize>
    );
  }
}

export default withAnalyticsReport(AnalyticsContainer);

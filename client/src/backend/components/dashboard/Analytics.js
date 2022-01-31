import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";
import withAnalyticsReport from "hoc/analytics/withAnalyticsReport";

class DashboardAnalytics extends Component {
  static displayName = "Dashboard.Analytics";

  static propTypes = {
    statistics: PropTypes.object,
    analytics: PropTypes.object,
    fetchStats: PropTypes.func.isRequired,
    fetchAnalytics: PropTypes.func.isRequired,
    updateAnalyticsRange: PropTypes.func.isRequired,
    analyticsStartDate: PropTypes.instanceOf(Date),
    analyticsEndDate: PropTypes.instanceOf(Date)
  };

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

  componentDidMount() {
    this.props.fetchStats();
    this.props.fetchAnalytics("global");
  }

  render() {
    const { analytics, statistics, analyticsRangeInWords } = this.props;
    return (
      <Grid columns={2}>
        {analytics && (
          <>
            <RangePicker
              onNewRangeSelected={this.props.updateAnalyticsRange}
              initialStart={this.props.analyticsStartDate}
              initialEnd={this.props.analyticsEndDate}
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
              view="ReturnVisits"
              report="returning_visitors"
              data={analytics}
            />
            <AnalyticsFactory
              view="AverageVisit"
              report="average_visit_duration"
              data={analytics}
            />
            <AnalyticsFactory
              view="Engagement"
              report="active_visitors"
              data={analytics}
            />
            <AnalyticsFactory
              view="Collected"
              report="favorited_projects"
              data={analytics}
            />
          </>
        )}
        {statistics && (
          <AnalyticsFactory view="SiteStatistics" data={statistics} />
        )}
      </Grid>
    );
  }
}

export default withAnalyticsReport(DashboardAnalytics);

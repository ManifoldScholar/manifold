import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ComposedAnalytics,
  Grid,
  RangePicker
} from "backend/components/analytics";

export default class DashboardAnalytics extends Component {
  static displayName = "Dashboard.Analytics";

  static propTypes = {};

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
    const { analytics, statistics } = this.props;

    return (
      <Grid columns={2}>
        {analytics && (
          <>
            <RangePicker
              onNewRangeSelected={this.props.onNewRangeSelected}
              defaultStart={this.props.defaultStart}
              defaultEnd={this.props.defaultEnd}
              className="analytics-grid__item--100"
            />
            <ComposedAnalytics.Visitors data={this.find("daily_visitors")} />
            <ComposedAnalytics.ReturnVisits
              data={this.find("returning_visitors")}
            />
            <ComposedAnalytics.AverageVisit
              data={this.find("average_visit_duration")}
            />
            <ComposedAnalytics.Interactions
              data={this.find("active_visitors")}
            />
            <ComposedAnalytics.Followed
              data={this.find("favorited_projects")}
            />
          </>
        )}
        {statistics && (
          <ComposedAnalytics.SiteStatistics statistics={statistics} />
        )}
      </Grid>
    );
  }
}

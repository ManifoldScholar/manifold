import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  ComposedAnalytics,
  Grid,
  RangePicker
} from "backend/components/analytics";
import Layout from "backend/components/layout";
import withAnalyticsReport from "hoc/analytics/with-analytics-report";

export class AnalyticsWrapperContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object,
    statistics: PropTypes.object,
    analytics: PropTypes.object,
    fetchStats: PropTypes.func.isRequired,
    fetchAnalytics: PropTypes.func.isRequired,
    updateAnalyticsRange: PropTypes.func.isRequired,
    analyticsStartDate: PropTypes.instanceOf(Date),
    analyticsEndDate: PropTypes.instanceOf(Date)
  };

  componentDidMount() {
    this.props.fetchStats();
    this.props.fetchAnalytics("global");
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
    const { analytics, statistics } = this.props;

    return (
      <main id="skip-to-main">
        <h1 className="screen-reader-text">Dashboard</h1>
        <section>
          <div className="container">
            <Layout.ViewHeader spaceBottom icon="BEAnalytics64" iconAltAccented>
              Analytics
            </Layout.ViewHeader>
            <section className="backend-dashboard">
              <Grid columns={4}>
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
                    {statistics && (
                      <ComposedAnalytics.SiteStatistics
                        statistics={statistics}
                      />
                    )}
                    <ComposedAnalytics.TopProjects
                      data={this.find("top_projects")}
                    />
                    <ComposedAnalytics.TopSearches
                      data={this.find("top_search_terms")}
                    />
                  </>
                )}
              </Grid>
            </section>
          </div>
        </section>
      </main>
    );
  }
}

export default withAnalyticsReport(AnalyticsWrapperContainer);

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";
import PageHeader from "backend/components/layout/PageHeader";
import withAnalyticsReport from "hoc/analytics/withAnalyticsReport";

class AnalyticsGlobalContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object,
    statistics: PropTypes.object,
    analytics: PropTypes.object,
    fetchStats: PropTypes.func.isRequired,
    fetchAnalytics: PropTypes.func.isRequired,
    updateAnalyticsRange: PropTypes.func.isRequired,
    analyticsStartDate: PropTypes.instanceOf(Date),
    analyticsEndDate: PropTypes.instanceOf(Date),
    t: PropTypes.func
  };

  componentDidMount() {
    this.props.fetchStats();
    this.props.fetchAnalytics("global");
  }

  render() {
    const {
      analytics,
      statistics,
      updateAnalyticsRange,
      analyticsStartDate,
      analyticsEndDate
    } = this.props;

    return (
      <>
        <PageHeader
          type="analytics"
          title={this.props.t("analytics.global_header")}
        />
        <Grid columns={4}>
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
                data={analytics}
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
              <AnalyticsFactory view="SiteStatistics" data={statistics} />
              <AnalyticsFactory
                view="TopProjects"
                report="top_projects"
                data={analytics}
                withAllLink
              />
              <AnalyticsFactory
                view="TopSearches"
                report="top_search_terms"
                data={analytics}
                withAllLink
              />
            </>
          )}
        </Grid>
      </>
    );
  }
}

export default withTranslation()(withAnalyticsReport(AnalyticsGlobalContainer));

import { useEffect } from "react";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";
import useAnalyticsReport from "hooks/useAnalyticsReport";

export default function DashboardAnalytics() {
  const {
    statistics,
    analytics,
    fetchStats,
    fetchAnalytics,
    updateAnalyticsRange,
    analyticsStartDate,
    analyticsEndDate,
    analyticsRangeInWords
  } = useAnalyticsReport();

  useEffect(() => {
    fetchStats();
    fetchAnalytics("global");
  }, [fetchStats, fetchAnalytics]);

  return (
    <Grid columns={2}>
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

DashboardAnalytics.displayName = "Dashboard.Analytics";

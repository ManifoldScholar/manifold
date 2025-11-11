import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";
import PageHeader from "backend/components/layout/PageHeader";
import useAnalyticsReport from "hooks/useAnalyticsReport";

export default function AnalyticsGlobalContainer() {
  const { t } = useTranslation();
  const {
    analytics,
    statistics,
    fetchStats,
    fetchAnalytics,
    updateAnalyticsRange,
    analyticsStartDate,
    analyticsEndDate
  } = useAnalyticsReport();

  useEffect(() => {
    fetchStats();
    fetchAnalytics("global");
  }, [fetchStats, fetchAnalytics]);

  return (
    <>
      <PageHeader type="analytics" title={t("analytics.global_header")} />
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

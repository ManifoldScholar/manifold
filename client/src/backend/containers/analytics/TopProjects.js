import { useEffect } from "react";
import { Trans } from "react-i18next";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";
import PageHeader from "backend/components/layout/PageHeader";
import useAnalyticsReport from "hooks/useAnalyticsReport";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export default function AnalyticsProjectsContainer() {
  const {
    analytics,
    analyticsPagination,
    analyticsPaginationClickHandler,
    fetchAnalytics,
    updateAnalyticsRange,
    analyticsStartDate,
    analyticsEndDate
  } = useAnalyticsReport();

  useEffect(() => {
    fetchAnalytics("top_projects");
  }, [fetchAnalytics]);

  return (
    <>
      <PageHeader
        type="analytics"
        title={
          <Trans
            i18nKey="analytics.top_projects_header"
            components={[<Link to={lh.link("backendAnalyticsGlobal")} />]}
          />
        }
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
              view="TopProjects"
              report="project_views"
              data={analytics}
              pagination={analyticsPagination}
              paginationClickHandler={analyticsPaginationClickHandler}
              width={100}
            />
          </>
        )}
      </Grid>
    </>
  );
}

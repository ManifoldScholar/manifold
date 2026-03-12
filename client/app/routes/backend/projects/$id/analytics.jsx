import { useEffect } from "react";
import { useOutletContext } from "react-router";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";
import useAnalyticsReport from "hooks/useAnalyticsReport";

export default function ProjectAnalytics() {
  const {
    analytics,
    fetchAnalytics,
    updateAnalyticsRange,
    analyticsStartDate,
    analyticsEndDate,
    analyticsRangeInWords
  } = useAnalyticsReport();
  const project = useOutletContext();

  useEffect(() => {
    fetchAnalytics("project", {
      record_type: "Project",
      record_id: project.id
    });
  }, [project.id, fetchAnalytics]);

  return (
    <Grid columns={4}>
      {analytics && (
        <>
          <RangePicker
            onNewRangeSelected={updateAnalyticsRange}
            initialStart={analyticsStartDate}
            initialEnd={analyticsEndDate}
            className="analytics-grid__item--100 range-picker--stacked"
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
            view="Downloads"
            report="downloads"
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
  );
}

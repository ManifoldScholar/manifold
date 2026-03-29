import { useEffect } from "react";
import { useOutletContext } from "react-router";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";
import useAnalyticsReport from "hooks/useAnalyticsReport";

export default function TextAnalytics() {
  const text = useOutletContext();

  const {
    analytics,
    fetchAnalytics,
    updateAnalyticsRange,
    analyticsStartDate,
    analyticsEndDate
  } = useAnalyticsReport();

  useEffect(() => {
    fetchAnalytics("text", {
      record_type: "Text",
      record_id: text.id
    });
  }, [text.id, fetchAnalytics]);

  return (
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
            data={analytics}
          />
          <AnalyticsFactory
            view="Annotations"
            report="annotations"
            data={analytics}
          />
          <AnalyticsFactory
            view="Highlights"
            report="annotations"
            data={analytics}
          />
          <AnalyticsFactory
            view="ShareClicks"
            report="shares"
            data={analytics}
          />
          <AnalyticsFactory
            view="Citations"
            report="citations"
            data={analytics}
          />
          <AnalyticsFactory
            view="TextSectionViews"
            report="text_section_views"
            text={text}
            data={analytics}
          />
        </>
      )}
    </Grid>
  );
}

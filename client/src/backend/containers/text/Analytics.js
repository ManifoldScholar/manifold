import { useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import lh from "helpers/linkHandler";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";
import useAnalyticsReport from "hooks/useAnalyticsReport";
import Authorize from "hoc/Authorize";

export default function AnalyticsContainer() {
  const { text } = useOutletContext() || {};

  const {
    analytics,
    fetchAnalytics,
    updateAnalyticsRange,
    analyticsStartDate,
    analyticsEndDate
  } = useAnalyticsReport();

  const prevTextIdRef = useRef(text?.id);

  useEffect(() => {
    if (text?.id) {
      fetchAnalytics("text", {
        record_type: "Text",
        record_id: text.id
      });
    }
  }, [text?.id, fetchAnalytics]);

  useEffect(() => {
    const prevId = prevTextIdRef.current;
    if (text?.id && prevId && text.id !== prevId) {
      fetchAnalytics("text", {
        record_type: "Text",
        record_id: text.id
      });
      prevTextIdRef.current = text.id;
    }
  }, [text?.id, fetchAnalytics]);

  if (!text) return null;

  return (
    <Authorize
      entity={text}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendText", text.id)}
    >
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
    </Authorize>
  );
}

AnalyticsContainer.displayName = "Text.Analytics";

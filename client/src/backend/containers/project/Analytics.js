import { useEffect, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import lh from "helpers/linkHandler";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";
import useAnalyticsReport from "hooks/useAnalyticsReport";
import Authorize from "hoc/Authorize";

function AnalyticsContainer() {
  const {
    analytics,
    fetchAnalytics,
    updateAnalyticsRange,
    analyticsStartDate,
    analyticsEndDate,
    analyticsRangeInWords
  } = useAnalyticsReport();
  const { project } = useOutletContext() || {};
  const { id } = useParams();
  const prevProjectIdRef = useRef(project?.id);

  useEffect(() => {
    if (project?.id) {
      fetchAnalytics("project", {
        record_type: "Project",
        record_id: project.id
      });
    }
  }, [project?.id, fetchAnalytics]);

  useEffect(() => {
    const prevId = prevProjectIdRef.current;
    if (id && prevId && id !== prevId && project?.id) {
      fetchAnalytics("project", {
        record_type: "Project",
        record_id: project.id
      });
      prevProjectIdRef.current = project.id;
    }
  }, [id, project?.id, fetchAnalytics]);

  if (!project) return null;

  return (
    <Authorize
      entity={project}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendProjects")}
    >
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
    </Authorize>
  );
}

AnalyticsContainer.displayName = "Project.Analytics";

export default AnalyticsContainer;

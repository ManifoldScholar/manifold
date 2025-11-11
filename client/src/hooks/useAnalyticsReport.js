import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import { useFromStore } from "hooks";
import { statisticsAPI, analyticReportsAPI, requests } from "api";
import { subDays } from "date-fns/subDays";
import { intervalToDuration } from "date-fns/intervalToDuration";
import { formatDuration } from "date-fns/formatDuration";
import { startOfDay } from "date-fns/startOfDay";
import { endOfDay } from "date-fns/endOfDay";
import { sub } from "date-fns/sub";
import { v4 as uuidv4 } from "uuid";

const { request } = entityStoreActions;

const defaultAnalyticsEnd = () => new Date();
const defaultAnalyticsStart = () => subDays(defaultAnalyticsEnd(), 30);

const formatDateForFetch = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function useAnalyticsReport() {
  const dispatch = useDispatch();
  const requestName = useMemo(
    () => `${requests.beAnalyticsReport}-${uuidv4()}`,
    []
  );

  const [analyticsStartDate, setAnalyticsStartDate] = useState(
    defaultAnalyticsStart()
  );
  const [analyticsEndDate, setAnalyticsEndDate] = useState(
    defaultAnalyticsEnd()
  );
  const lastReportTypeRef = useRef(null);
  const lastReportParamsRef = useRef(null);

  const statistics = useFromStore({
    requestKey: requests.beStats,
    action: "select"
  });

  const analytics = useFromStore({
    requestKey: requestName,
    action: "select"
  });

  const analyticsMeta = useFromStore({
    requestKey: requestName,
    action: "meta"
  });

  const analyticsPagination = useMemo(() => {
    if (!analyticsMeta || !analyticsMeta.pagination) return null;
    return analyticsMeta.pagination;
  }, [analyticsMeta]);

  const analyticsDuration = useMemo(() => {
    const start = sub(startOfDay(analyticsStartDate), { seconds: 1 });
    const end = endOfDay(analyticsEndDate);
    if (!start || !end) return null;
    return formatDuration(
      intervalToDuration({
        start,
        end
      }),
      { format: ["years", "months", "weeks", "days"], delimiter: ", " }
    );
  }, [analyticsStartDate, analyticsEndDate]);

  const fetchStats = useCallback(() => {
    const statsRequest = request(statisticsAPI.show(), requests.beStats);
    dispatch(statsRequest);
  }, [dispatch]);

  const fetchAnalytics = useCallback(
    (report = "global", params = {}) => {
      lastReportTypeRef.current = report;
      lastReportParamsRef.current = params;
      const analyticsRequest = request(
        analyticReportsAPI.index({
          ...params,
          reportType: report,
          startDate: formatDateForFetch(analyticsStartDate),
          endDate: formatDateForFetch(analyticsEndDate)
        }),
        requestName
      );
      dispatch(analyticsRequest);
    },
    [dispatch, requestName, analyticsStartDate, analyticsEndDate]
  );

  const analyticsPaginationClickHandler = useCallback(
    page => {
      return () => {
        fetchAnalytics(lastReportTypeRef.current, {
          ...lastReportParamsRef.current,
          page: { number: page }
        });
      };
    },
    [fetchAnalytics]
  );

  const updateAnalyticsRange = useCallback((startDate, endDate) => {
    setAnalyticsStartDate(startDate);
    setAnalyticsEndDate(endDate);
  }, []);

  // Refetch analytics when date range changes
  useEffect(() => {
    if (lastReportTypeRef.current) {
      fetchAnalytics(
        lastReportTypeRef.current,
        lastReportParamsRef.current || {}
      );
    }
  }, [analyticsStartDate, analyticsEndDate, fetchAnalytics]);

  return {
    statistics,
    analytics,
    analyticsPagination,
    fetchStats,
    fetchAnalytics,
    updateAnalyticsRange,
    analyticsPaginationClickHandler,
    analyticsStartDate,
    analyticsEndDate,
    analyticsRangeInWords: analyticsDuration
  };
}

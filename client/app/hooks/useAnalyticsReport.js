import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useApiCallback } from "hooks";
import { statisticsAPI, analyticReportsAPI } from "api";
import { subDays } from "date-fns/subDays";
import { intervalToDuration } from "date-fns/intervalToDuration";
import { formatDuration } from "date-fns/formatDuration";
import { startOfDay } from "date-fns/startOfDay";
import { endOfDay } from "date-fns/endOfDay";
import { sub } from "date-fns/sub";

const defaultAnalyticsEnd = () => new Date();
const defaultAnalyticsStart = () => subDays(defaultAnalyticsEnd(), 30);

const formatDateForFetch = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function useAnalyticsReport() {
  const fetchStatsApi = useApiCallback(statisticsAPI.show);
  const fetchAnalyticsApi = useApiCallback(analyticReportsAPI.index);

  const [statistics, setStatistics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsPagination, setAnalyticsPagination] = useState(null);

  const [analyticsStartDate, setAnalyticsStartDate] = useState(
    defaultAnalyticsStart()
  );
  const [analyticsEndDate, setAnalyticsEndDate] = useState(
    defaultAnalyticsEnd()
  );
  const lastReportTypeRef = useRef(null);
  const lastReportParamsRef = useRef(null);

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

  const fetchStats = useCallback(async () => {
    const res = await fetchStatsApi();
    setStatistics(res?.data);
  }, [fetchStatsApi]);

  const fetchAnalytics = useCallback(
    async (report = "global", params = {}) => {
      lastReportTypeRef.current = report;
      lastReportParamsRef.current = params;
      const res = await fetchAnalyticsApi({
        ...params,
        reportType: report,
        startDate: formatDateForFetch(analyticsStartDate),
        endDate: formatDateForFetch(analyticsEndDate)
      });
      setAnalytics(res?.data);
      setAnalyticsPagination(res?.meta?.pagination ?? null);
    },
    [fetchAnalyticsApi, analyticsStartDate, analyticsEndDate]
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

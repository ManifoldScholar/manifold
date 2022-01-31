import React from "react";
import hoistStatics from "hoist-non-react-statics";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { statisticsAPI, analyticReportsAPI, requests } from "api";
import subDays from "date-fns/subDays";
import intervalToDuration from "date-fns/intervalToDuration";
import formatDuration from "date-fns/formatDuration";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import sub from "date-fns/sub";
import uuid from "uuid";

const { request } = entityStoreActions;

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withAnalyticsReport(WrappedComponent) {
  const displayName = `withAnalyticsReport('${getDisplayName(
    WrappedComponent
  )})`;

  const requestUUID = uuid();
  const requestName = `${requests.beAnalyticsReport}-${requestUUID}`;

  class WithAnalyticsReport extends React.PureComponent {
    static mapStateToProps = state => {
      return {
        statistics: select(requests.beStats, state.entityStore),
        analytics: select(requestName, state.entityStore),
        analyticsMeta: meta(requestName, state.entityStore)
      };
    };

    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    constructor(props) {
      super(props);
      this.state = {
        lastReportType: null,
        lastReportParams: null,
        analyticsStartDate: this.defaultAnalyticsStart,
        analyticsEndDate: this.defaultAnalyticsEnd
      };
    }

    componentDidUpdate(prevPropsIgnored, prevState) {
      if (
        prevState.analyticsStartDate !== this.state.analyticsStartDate ||
        prevState.analyticsEndDate !== this.state.analyticsEndDate
      ) {
        this.fetchAnalytics(
          this.state.lastReportType,
          this.state.lastReportParams
        );
      }
    }

    get defaultAnalyticsStart() {
      return subDays(this.defaultAnalyticsEnd, 30);
    }

    get defaultAnalyticsEnd() {
      return new Date();
    }

    get analyticsPagination() {
      const { analyticsMeta } = this.props;
      if (!analyticsMeta || !analyticsMeta.pagination) return null;
      return analyticsMeta.pagination;
    }

    get analyticsDuration() {
      const { analyticsStartDate, analyticsEndDate } = this.state;
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
    }

    fetchStats = () => {
      const { dispatch } = this.props;
      const statsRequest = request(statisticsAPI.show(), requests.beStats);
      dispatch(statsRequest);
    };

    fetchAnalytics = (report = "global", params = {}) => {
      this.setState({ lastReportType: report, lastReportParams: params });
      const { dispatch } = this.props;
      const analyticsRequest = request(
        analyticReportsAPI.index({
          ...params,
          reportType: report,
          startDate: this.formatDateForFetch(this.state.analyticsStartDate),
          endDate: this.formatDateForFetch(this.state.analyticsEndDate)
        }),
        requestName
      );
      dispatch(analyticsRequest);
    };

    formatDateForFetch = date => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    analyticsPaginationClickHandler = page => {
      return () => {
        this.fetchAnalytics(this.state.lastReportType, {
          ...this.state.lastReportParams,
          page: { number: page }
        });
      };
    };

    updateAnalyticsRange = (startDate, endDate) => {
      this.setState({
        analyticsStartDate: startDate,
        analyticsEndDate: endDate
      });
    };

    render() {
      const props = {
        ...this.props,
        analyticsPagination: this.analyticsPagination,
        fetchStats: this.fetchStats,
        fetchAnalytics: this.fetchAnalytics,
        updateAnalyticsRange: this.updateAnalyticsRange,
        analyticsPaginationClickHandler: this.analyticsPaginationClickHandler,
        analyticsStartDate: this.state.analyticsStartDate,
        analyticsEndDate: this.state.analyticsEndDate,
        analyticsRangeInWords: this.analyticsDuration
      };
      return React.createElement(WrappedComponent, props);
    }
  }

  const ConnectedWithAnalyticsReport = connect(
    WithAnalyticsReport.mapStateToProps
  )(WithAnalyticsReport);

  return hoistStatics(ConnectedWithAnalyticsReport, WrappedComponent);
}

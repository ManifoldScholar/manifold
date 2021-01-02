import React from "react";
import hoistStatics from "hoist-non-react-statics";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { statisticsAPI, analyticReportsAPI, requests } from "api";
import subDays from "date-fns/subDays";
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
        analytics: select(requestName, state.entityStore)
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
          startDate: this.state.analyticsStartDate.toISOString(),
          endDate: this.state.analyticsEndDate.toISOString()
        }),
        requestName
      );
      dispatch(analyticsRequest);
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
        fetchStats: this.fetchStats,
        fetchAnalytics: this.fetchAnalytics,
        updateAnalyticsRange: this.updateAnalyticsRange,
        analyticsStartDate: this.state.analyticsStartDate,
        analyticsEndDate: this.state.analyticsEndDate
      };
      return React.createElement(WrappedComponent, props);
    }
  }

  const ConnectedWithAnalyticsReport = connect(
    WithAnalyticsReport.mapStateToProps
  )(WithAnalyticsReport);

  return hoistStatics(ConnectedWithAnalyticsReport, WrappedComponent);
}

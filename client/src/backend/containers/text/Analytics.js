import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";

import withAnalyticsReport from "hoc/analytics/with-analytics-report";
import Authorize from "hoc/authorize";

export class AnalyticsContainer extends PureComponent {
  static displayName = "Text.Analytics";

  static propTypes = {
    text: PropTypes.object.isRequired,
    analytics: PropTypes.object,
    fetchStats: PropTypes.func.isRequired,
    fetchAnalytics: PropTypes.func.isRequired,
    updateAnalyticsRange: PropTypes.func.isRequired,
    analyticsStartDate: PropTypes.instanceOf(Date),
    analyticsEndDate: PropTypes.instanceOf(Date)
  };

  componentDidMount() {
    const { text } = this.props;
    this.props.fetchAnalytics("text", {
      record_type: "Text",
      record_id: text.id
    });
  }

  render() {
    const {
      text,
      analytics,
      updateAnalyticsRange,
      analyticsStartDate,
      analyticsEndDate
    } = this.props;

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
}

export default withAnalyticsReport(AnalyticsContainer);

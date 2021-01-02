import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import {
  ComposedAnalytics,
  Grid,
  RangePicker
} from "backend/components/analytics";

import withAnalyticsReport from "hoc/analytics/with-analytics-report";
import Authorize from "hoc/authorize";

export class AnalyticsContainer extends PureComponent {
  static displayName = "Text.Analytics";

  static propTypes = {
    text: PropTypes.object.isRequired,
    statistics: PropTypes.object,
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

  get data() {
    if (!this.props.analytics) return [];
    const {
      attributes: { reports }
    } = this.props.analytics;
    return reports;
  }

  find(name) {
    return this.data.find(element => element.name === name);
  }

  render() {
    const { text, analytics } = this.props;

    return (
      <Authorize
        entity={text}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendText", text.id)}
      >
        <RangePicker
          onNewRangeSelected={this.props.updateAnalyticsRange}
          defaultStart={this.props.analyticsStartDate}
          defaultEnd={this.props.analyticsEndDate}
        />
        <section className="backend-dashboard">
          <Grid columns={3}>
            {analytics && (
              <>
                <ComposedAnalytics.Visitors
                  data={this.find("daily_visitors")}
                />
                <ComposedAnalytics.Annotations />
                <ComposedAnalytics.Highlights data={this.find("annotations")} />
                <ComposedAnalytics.ShareClicks
                  data={this.find("share_clicks")}
                />
                <ComposedAnalytics.Citations data={this.find("share_clicks")} />
                <ComposedAnalytics.TextSectionViews
                  text={text}
                  data={this.find("text_section_views")}
                />
              </>
            )}
          </Grid>
        </section>
      </Authorize>
    );
  }
}

export default withAnalyticsReport(AnalyticsContainer);

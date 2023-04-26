import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";
import PageHeader from "backend/components/layout/PageHeader";
import withAnalyticsReport from "hoc/analytics/withAnalyticsReport";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

class AnalyticsSearchesContainer extends PureComponent {
  componentDidMount() {
    this.props.fetchAnalytics("top_searches");
  }

  render() {
    const {
      analytics,
      analyticsPagination,
      analyticsPaginationClickHandler
    } = this.props;

    return (
      <>
        <PageHeader
          type="analytics"
          title={
            <Trans
              i18nKey="analytics.top_searches_header"
              components={[<Link to={lh.link("backendAnalyticsGlobal")} />]}
            />
          }
        />
        <Grid columns={4}>
          {analytics && (
            <>
              <RangePicker
                onNewRangeSelected={this.props.updateAnalyticsRange}
                initialStart={this.props.analyticsStartDate}
                initialEnd={this.props.analyticsEndDate}
                className="analytics-grid__item--100"
              />
              <AnalyticsFactory
                view="TopSearches"
                report="searches"
                data={analytics}
                pagination={analyticsPagination}
                paginationClickHandler={analyticsPaginationClickHandler}
                width={100}
              />
            </>
          )}
        </Grid>
      </>
    );
  }
}

export default withAnalyticsReport(AnalyticsSearchesContainer);

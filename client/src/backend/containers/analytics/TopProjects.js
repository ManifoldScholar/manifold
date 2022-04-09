import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";
import {
  AnalyticsFactory,
  Grid,
  RangePicker
} from "backend/components/analytics";
import Layout from "backend/components/layout";
import withAnalyticsReport from "hoc/analytics/withAnalyticsReport";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

class AnalyticsProjectsContainer extends PureComponent {
  componentDidMount() {
    this.props.fetchAnalytics("top_projects");
  }

  render() {
    const {
      analytics,
      analyticsPagination,
      analyticsPaginationClickHandler
    } = this.props;

    return (
      <>
        <Layout.ViewHeader spaceBottom icon="BEAnalytics64" iconAltAccented>
          <h1 className="backend-header__title">
            <Trans
              i18nKey="backend.analytics.top_projects_header"
              components={[<Link to={lh.link("backendAnalyticsGlobal")} />]}
            />
          </h1>
        </Layout.ViewHeader>
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
                view="TopProjects"
                report="project_views"
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

export default withAnalyticsReport(AnalyticsProjectsContainer);

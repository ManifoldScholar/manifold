import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Utility from "global/components/utility";
import Footers from "global/components/Footers";
import Layout from "backend/components/layout";
import { commonActions } from "actions/helpers";
import { pagesAPI, requests } from "api";
import { uiStateSnapshotActions, entityStoreActions } from "actions";
import entityUtils from "utils/entityUtils";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";
import BodyClass from "hoc/BodyClass";
import Authorize from "hoc/Authorize";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

const { request } = entityStoreActions;

export class BackendContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      authentication: state.authentication,
      visibility: state.ui.transitory.visibility,
      loading: state.ui.transitory.loading.active,
      notifications: state.notifications,
      routing: state.routing,
      pages: entityUtils.select(requests.gPages, state.entityStore),
      settings: entityUtils.select(requests.settings, state.entityStore)
    };
  };

  static fetchData = (getState, dispatch) => {
    if (!entityUtils.isLoaded(requests.gPages, getState())) {
      const pages = request(pagesAPI.index(), requests.gPages, {
        oneTime: true
      });
      const { promise: one } = dispatch(pages);
      return Promise.all([one]);
    }
  };

  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    notifications: PropTypes.object,
    visibility: PropTypes.object,
    pages: PropTypes.array,
    settings: PropTypes.object,
    route: PropTypes.object,
    match: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.commonActions = commonActions(props.dispatch);
  }

  componentWillUnmount() {
    this.props.dispatch(uiStateSnapshotActions.resetSnapshots());
  }

  childProps() {
    return {
      dispatch: this.props.dispatch
    };
  }

  render() {
    return (
      <Authorize
        kind={[
          "admin",
          "editor",
          "marketeer",
          "project_creator",
          "project_editor",
          "project_resource_editor"
        ]}
        failureRedirect={lh.link("frontendLogin")}
        failureNotification
      >
        <BodyClass className={"backend bg-neutral90"}>
          <>
            <RedirectToFirstMatch
              route={"backend"}
              candidates={[
                {
                  label: "Dashboard",
                  route: "backendDashboard"
                }
              ]}
            />
            <Utility.ScrollToTop />
            <Layout.GlobalHeader
              visibility={this.props.visibility}
              match={this.props.match}
              location={this.props.location}
              authentication={this.props.authentication}
              commonActions={this.commonActions}
            />
            <BreadcrumbsProvider>
              <div className="main-content">
                {childRoutes(this.props.route, {
                  childProps: this.childProps()
                })}
              </div>
            </BreadcrumbsProvider>
            <Footers.FrontendFooter
              pages={this.props.pages}
              authentication={this.props.authentication}
              commonActions={this.commonActions}
              settings={this.props.settings}
              withVersion
            />
          </>
        </BodyClass>
      </Authorize>
    );
  }
}

export default connectAndFetch(BackendContainer);

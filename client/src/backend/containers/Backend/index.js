import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Utility from "global/components/utility";
import LayoutFrontend from "frontend/components/layout";
import LayoutBackend from "backend/components/layout";
import { commonActions } from "actions/helpers";
import { pagesAPI, requests } from "api";
import { uiStateSnapshotActions, entityStoreActions } from "actions";
import entityUtils from "utils/entityUtils";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";

import ScrollAware from "hoc/scroll-aware";
import BodyClass from "hoc/body-class";

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

  componentDidMount() {
    this.setMinHeight();
  }

  componentWillUnmount() {
    this.props.dispatch(uiStateSnapshotActions.resetSnapshots());
  }

  setMinHeight() {
    if (!this.mainContainer) return;
    const mainHeight = this.mainContainer.offsetHeight;
    const offsetHeight =
      this.mainContainer.parentNode.offsetHeight - mainHeight;
    this.mainContainer.style.minHeight = `calc(100vh - ${offsetHeight}px)`;
  }

  childProps() {
    return {
      dispatch: this.props.dispatch
    };
  }

  render() {
    return (
      <BodyClass className={"backend bg-neutral90"}>
        <div>
          <RedirectToFirstMatch
            from={lh.link("backend")}
            candidates={[
              {
                label: "Dashboard",
                route: "backendDashboard"
              }
            ]}
          />

          <Utility.SkipLink />
          <Utility.ScrollToTop />
          <ScrollAware>
            <LayoutBackend.Header
              visibility={this.props.visibility}
              match={this.props.match}
              location={this.props.location}
              authentication={this.props.authentication}
              commonActions={this.commonActions}
            />
          </ScrollAware>
          <main
            ref={mainContainer => {
              this.mainContainer = mainContainer;
            }}
            id="skip-to-main"
          >
            {childRoutes(this.props.route, { childProps: this.childProps() })}
          </main>
          <LayoutFrontend.Footer
            pages={this.props.pages}
            authentication={this.props.authentication}
            commonActions={this.commonActions}
            settings={this.props.settings}
          />
        </div>
      </BodyClass>
    );
  }
}

export default connectAndFetch(BackendContainer);

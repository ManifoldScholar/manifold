import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { HigherOrder, FatalError, Utility } from "components/global";
import { Layout as LayoutFrontend } from "components/frontend";
import { Layout as LayoutBackend } from "components/backend";
import { commonActions } from "actions/helpers";
import { pagesAPI, requests } from "api";
import { uiStateSnapshotActions, entityStoreActions } from "actions";
import entityUtils from "utils/entityUtils";
import { childRoutes } from "helpers/router";
import startsWith from "lodash/startsWith";

const { request } = entityStoreActions;
const { resetDashboardProjectsListSnapshot } = uiStateSnapshotActions;

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
    super();
    this.commonActions = commonActions(props.dispatch);
  }

  componentDidMount() {
    this.setMinHeight();
  }

  componentWillUnmount() {
    this.props.dispatch(resetDashboardProjectsListSnapshot());
  }

  setMinHeight() {
    if (!this.mainContainer) return;
    const mainHeight = this.mainContainer.offsetHeight;
    const offsetHeight =
      this.mainContainer.parentNode.offsetHeight - mainHeight;
    this.mainContainer.style.minHeight = `calc(100vh - ${offsetHeight}px)`;
  }

  isProjects = (match, location) => {
    if (!match) {
      return false;
    }
    const { pathname } = location;
    if (pathname === "/backend") return true;
    if (startsWith(pathname, "/backend/project")) return true;
    if (startsWith(pathname, "/backend/resource")) return true;
    return startsWith(pathname, "/backend/text");
  };

  hasFatalError() {
    return !!this.props.notifications.fatalError;
  }

  hasAuthenticationError() {
    return !this.props.authentication.authenticated;
  }

  childProps() {
    return {
      dispatch: this.props.dispatch
    };
  }

  renderError(error) {
    return (
      <div className="global-container">
        <FatalError error={error} />
      </div>
    );
  }

  renderFatalError() {
    return this.renderError(this.props.notifications.fatalError);
  }

  renderAuthenticationError() {
    return this.renderError({
      status: null,
      detail: "Please login to access the backend.",
      title: "Login Required"
    });
  }

  render() {
    if (this.hasFatalError()) return this.renderFatalError();
    if (this.hasAuthenticationError()) return this.renderAuthenticationError();
    const skipId = "skip-to-main";

    return (
      <HigherOrder.BodyClass className={"backend bg-neutral90"}>
        <div>
          <Utility.SkipLink skipId={skipId} />
          <Utility.ScrollToTop />
          <HigherOrder.ScrollAware>
            <LayoutBackend.Header
              visibility={this.props.visibility}
              location={this.props.location}
              authentication={this.props.authentication}
              commonActions={this.commonActions}
              settings={this.props.settings}
              isProjects={this.isProjects}
            />
          </HigherOrder.ScrollAware>
          <main
            ref={mainContainer => {
              this.mainContainer = mainContainer;
            }}
            id={skipId}
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
      </HigherOrder.BodyClass>
    );
  }
}

export default connectAndFetch(BackendContainer);

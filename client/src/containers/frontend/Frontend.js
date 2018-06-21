import React, { Component } from "react";
import PropTypes from "prop-types";
import { HigherOrder, FatalError, Utility } from "components/global";
import HigherOrderContainer from "containers/global/HigherOrder";
import { Layout } from "components/frontend";
import { commonActions } from "actions/helpers";
import { pagesAPI, subjectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, isLoaded } from "utils/entityUtils";
import connectAndFetch from "utils/connectAndFetch";
import { renderRoutes } from "react-router-config";

const { request } = entityStoreActions;

export class FrontendContainer extends Component {
  static fetchData = (getState, dispatch) => {
    if (!isLoaded(requests.gPages, getState())) {
      const pages = request(pagesAPI.index(), requests.gPages, {
        oneTime: true
      });
      const subjects = request(
        subjectsAPI.index({ used: true }, {}, true),
        requests.feSubjects,
        { oneTime: true }
      );
      const promises = [];
      const pagesRes = dispatch(pages);
      const subjectsRes = dispatch(subjects);
      if (pagesRes) promises.push(pagesRes.promise);
      if (subjectsRes) promises.push(pagesRes.promise);
      return Promise.all(promises);
    }
  };

  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    fetchData: PropTypes.func,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    notifications: PropTypes.object,
    pages: PropTypes.array,
    settings: PropTypes.object,
    route: PropTypes.object
  };

  static mapStateToProps = state => {
    return {
      authentication: state.authentication,
      visibility: state.ui.transitory.visibility,
      loading: state.ui.transitory.loading.active,
      notifications: state.notifications,
      pages: select(requests.gPages, state.entityStore),
      settings: select(requests.settings, state.entityStore)
    };
  };

  constructor(props) {
    super(props);
    this.commonActions = commonActions(props.dispatch);
  }

  componentDidUpdate(prevProps) {
    // The store will be cleared if the user has changed. If this happens, reload content.
    if (
      this.props.authentication.currentUser !==
      prevProps.authentication.currentUser
    ) {
      this.props.fetchData(this.props);
    }
  }

  render() {
    const fatalError = this.props.notifications.fatalError;
    const skipId = "skip-to-main";

    return (
      <HigherOrder.BodyClass className={"browse"}>
        <div>
          <Utility.SkipLink skipId={skipId} />
          <Utility.ScrollToTop />
          <HigherOrder.ScrollAware>
            <Layout.Header
              pages={this.props.pages}
              visibility={this.props.visibility}
              location={this.props.location}
              authentication={this.props.authentication}
              notifications={this.props.notifications}
              commonActions={this.commonActions}
              settings={this.props.settings}
            />
          </HigherOrder.ScrollAware>
          <HigherOrderContainer.Authorize kind="any">
            <Layout.MobileNav location={this.props.location} />
          </HigherOrderContainer.Authorize>
          <main
            ref={mainContainer => {
              this.mainContainer = mainContainer;
            }}
            id={skipId}
          >
            {fatalError ? (
              <div className="global-container">
                <FatalError error={fatalError} />
              </div>
            ) : (
              <div>{renderRoutes(this.props.route.routes)}</div>
            )}
          </main>
          <Layout.Footer
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

export default connectAndFetch(FrontendContainer);

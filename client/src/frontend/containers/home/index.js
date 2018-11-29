import React, { Component } from "react";
import PropTypes from "prop-types";
import Layout from "frontend/components/layout";
import connectAndFetch from "utils/connectAndFetch";
import { commonActions } from "actions/helpers";
import get from "lodash/get";
import { select } from "utils/entityUtils";
import { requests } from "api";

import Collections from "./Collections";
import Projects from "./Projects";
import Feature from "./Feature";

import withSettings from "hoc/with-settings";

export class HomeContainer extends Component {
  static showProjects(getState) {
    const settings = select(requests.settings, getState().entityStore);
    return get(settings, "attributes.calculated.homePageShowProjects");
  }

  static fetchData(getState, dispatch) {
    const promises = [];
    promises.push(Feature.fetchFeatures(getState, dispatch));
    if (this.showProjects(getState)) {
      promises.push(Projects.fetchProjects(getState, dispatch));
    } else {
      promises.push(Collections.fetchCollections(getState, dispatch));
    }
    return Promise.all(promises);
  }

  static mapStateToProps = state => {
    return {
      authentication: state.authentication
    };
  };

  static propTypes = {
    fetchData: PropTypes.func,
    authentication: PropTypes.object,
    settings: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func
  };

  static defaultProps = {
    location: {}
  };

  constructor(props) {
    super(props);
    this.commonActions = commonActions(props.dispatch);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.authentication.currentUser !==
      prevProps.authentication.currentUser
    ) {
      this.props.fetchData(this.props);
    }
  }

  get showProjects() {
    return get(
      this.props.settings,
      "attributes.calculated.homePageShowProjects"
    );
  }

  showFollowing() {
    return true;
  }

  render() {
    return (
      <div
        style={{
          overflowX: "hidden"
        }}
      >
        <Feature
          authentication={this.props.authentication}
          commonActions={this.commonActions}
        />
        {this.showProjects ? (
          <Projects
            location={this.props.location}
            authentication={this.props.authentication}
          />
        ) : (
          <Collections authentication={this.props.authentication} />
        )}

        <Layout.ButtonNavigation
          grayBg={false}
          showFollowing={this.showFollowing()}
          authenticated={this.props.authentication.authenticated}
        />
      </div>
    );
  }
}

export default connectAndFetch(withSettings(HomeContainer));

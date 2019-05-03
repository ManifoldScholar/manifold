import React, { Component } from "react";
import PropTypes from "prop-types";
import Layout from "frontend/components/layout";
import connectAndFetch from "utils/connectAndFetch";
import { commonActions } from "actions/helpers";
import get from "lodash/get";
import { select } from "utils/entityUtils";
import { requests } from "api";

import withSettings from "hoc/with-settings";
import Collections from "./Collections";
import Projects from "./Projects";
import Feature from "./Feature";

export class HomeContainer extends Component {
  static defaultProps = {
    location: {}
  };

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

  static showProjects(getState) {
    const settings = select(requests.settings, getState().entityStore);
    return get(settings, "attributes.calculated.homePageShowProjects");
  }

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

  showFollowing() {
    return true;
  }

  get showProjects() {
    return get(
      this.props.settings,
      "attributes.calculated.homePageShowProjects"
    );
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
        />
      </div>
    );
  }
}

export default connectAndFetch(withSettings(HomeContainer));

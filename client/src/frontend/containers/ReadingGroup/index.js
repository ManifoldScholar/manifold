import React, { Component } from "react";
import { childRoutes } from "helpers/router";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { grab } from "utils/entityUtils";
import { meAPI, requests } from "api";
import get from "lodash/get";

const { request } = entityStoreActions;

class ReadingGroup extends Component {
  static fetchData = (getState, dispatch) => {
    const readingGroupsFetch = meAPI.readingGroups();
    const readingGroupsAction = request(
      readingGroupsFetch,
      requests.feMyReadingGroups
    );
    const { promise: one } = dispatch(readingGroupsAction);
    const promises = [one];
    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      readingGroup: grab(
        "readingGroups",
        ownProps.match.params.id,
        state.entityStore
      ),
      readingGroupResponse: get(
        state.entityStore.responses,
        requests.feReadingGroup
      )
    };
  };

  renderRoutes() {
    const {
      readingGroup,
      readingGroupMembers,
      route,
      settings,
      dispatch,
      fetchData
    } = this.props;

    return childRoutes(route, {
      childProps: {
        settings,
        dispatch,
        fetchData,
        readingGroup,
        readingGroupMembers
      }
    });
  }

  render() {
    if (!this.props.readingGroup) return null;

    return (
      <section>
        <div className="container">{this.renderRoutes()}</div>
      </section>
    );
  }
}

export default connectAndFetch(ReadingGroup);

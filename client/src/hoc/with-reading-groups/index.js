import React from "react";
import PropTypes from "prop-types";
import { meAPI, requests } from "api";
import { select, loaded } from "utils/entityUtils";
import hoistStatics from "hoist-non-react-statics";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions, uiReadingGroupActions } from "actions";

const { request } = entityStoreActions;

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withReadingGroups(WrappedComponent) {
  const displayName = `HigherOrder.WithReadingGroups(${getDisplayName(
    WrappedComponent
  )})`;

  class WithReadingGroups extends React.PureComponent {
    static fetchData = (getState, dispatch) => {
      const promises = [];
      const state = getState();
      if (!loaded(requests.feMyReadingGroups, state.entityStore)) {
        const readingGroupsFetch = meAPI.readingGroups();
        const readingGroupsAction = request(
          readingGroupsFetch,
          requests.feMyReadingGroups
        );
        const { promise } = dispatch(readingGroupsAction);
        promises.push(promise);
      }
      return Promise.all(promises);
    };

    static mapStateToProps = state => {
      return {
        readingGroups: select(requests.feMyReadingGroups, state.entityStore),
        readingGroupsLoaded: loaded(
          requests.feMyReadingGroups,
          state.entityStore
        ),
        currentReadingGroup:
          state.ui.persistent.reader.readingGroups.currentReadingGroup
      };
    };

    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    static propTypes = {
      readingGroups: PropTypes.array,
      currentReadingGroup: PropTypes.string
    };

    componentDidUpdate(prevProps) {
      // When the groups are loaded, we need to validate that the selected group is still
      // available to the user.
      if (
        !prevProps.readingGroupsLoaded &&
        this.props.readingGroupsLoaded &&
        this.props.currentReadingGroup
      ) {
        const currentGroup = this.props.readingGroups.find(
          group => group.id === this.props.currentReadingGroup
        );
        if (!currentGroup)
          this.props.dispatch(uiReadingGroupActions.setReadingGroup("public"));
      }
    }

    get childProps() {
      return {
        setReadingGroup: this.setReadingGroup
      };
    }

    setReadingGroup = id => {
      this.props.dispatch(uiReadingGroupActions.setReadingGroup(id));
    };

    render() {
      if (!this.props.readingGroups) return null;
      const props = { ...this.props, ...this.childProps };
      return React.createElement(WrappedComponent, props);
    }
  }

  const ConnectedWithReadingGroups = connectAndFetch(WithReadingGroups);

  return hoistStatics(ConnectedWithReadingGroups, WrappedComponent);
}

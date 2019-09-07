import React from "react";
import PropTypes from "prop-types";
import { meAPI, requests } from "api";
import { select } from "utils/entityUtils";
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
      const readingGroupsFetch = meAPI.readingGroups();
      const readingGroupsAction = request(
        readingGroupsFetch,
        requests.feMyReadingGroups
      );
      const { promise: one } = dispatch(readingGroupsAction);
      const promises = [one];
      return Promise.all(promises);
    };

    static mapStateToProps = state => {
      return {
        readingGroups: select(requests.feMyReadingGroups, state.entityStore),
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

    get childProps() {
      return {
        setReadingGroup: this.setReadingGroup
      };
    }

    setReadingGroup = id => {
      this.props.dispatch(uiReadingGroupActions.setReadingGroup(id));
    };

    render() {
      const props = Object.assign({}, this.props, this.childProps);
      return React.createElement(WrappedComponent, props);
    }
  }

  const ConnectedWithReadingGroups = connectAndFetch(WithReadingGroups);

  return hoistStatics(ConnectedWithReadingGroups, WrappedComponent);
}

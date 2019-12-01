import React from "react";
import PropTypes from "prop-types";
import { meAPI, requests } from "api";
import { select, loaded } from "utils/entityUtils";
import hoistStatics from "hoist-non-react-statics";
import { connect } from "react-redux";
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
    static mapStateToProps = state => {
      return {
        _authentication: state.authentication,
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

    componentDidMount() {
      if (!this.props.readingGroupsLoaded) {
        this.fetchReadingGroups();
      }
    }

    componentDidUpdate(prevProps) {
      // Refetch reading groups if the user logged in.
      if (
        prevProps._authentication.authenticated === false &&
        this.props._authentication.authenticated === true
      ) {
        this.fetchReadingGroups();
      }

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

    fetchReadingGroups() {
      const readingGroupsFetch = meAPI.readingGroups();
      const readingGroupsAction = request(
        readingGroupsFetch,
        requests.feMyReadingGroups
      );
      this.props.dispatch(readingGroupsAction);
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
      const { _authentication, ...otherProps } = this.props;
      const props = { ...otherProps, ...this.childProps };
      if (!props.readingGroups) props.readingGroups = [];
      return React.createElement(WrappedComponent, props);
    }
  }

  const ConnectedWithReadingGroups = connect(WithReadingGroups.mapStateToProps)(
    WithReadingGroups
  );

  return hoistStatics(ConnectedWithReadingGroups, WrappedComponent);
}

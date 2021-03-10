import React from "react";
import PropTypes from "prop-types";
import { requests } from "api";
import { select, loaded } from "utils/entityUtils";
import hoistStatics from "hoist-non-react-statics";
import { connect } from "react-redux";
import { uiReadingGroupActions } from "actions";
import { ReaderContext } from "helpers/contexts";
import get from "lodash/get";

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
        readingGroups: select(requests.feMyReadingGroups, state.entityStore),
        readingGroupsLoaded: loaded(
          requests.feMyReadingGroups,
          state.entityStore
        ),
        currentReadingGroup: get(
          state,
          "ui.persistent.reader.readingGroups.currentReadingGroup"
        )
      };
    };

    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    static propTypes = {
      readingGroups: PropTypes.array,
      readingGroupsLoaded: PropTypes.bool,
      currentReadingGroup: PropTypes.string
    };

    static contextType = ReaderContext;

    componentDidUpdate(prevProps) {
      const {
        readingGroupsLoaded,
        readingGroups,
        currentReadingGroup,
        dispatch
      } = this.props;
      const { readingGroups: previousReadingGroups } = prevProps;
      if (
        readingGroupsLoaded &&
        previousReadingGroups !== readingGroups &&
        currentReadingGroup
      ) {
        const currentGroup = this.adjustedReadingGroups.find(
          group => group.id === currentReadingGroup
        );
        if (!currentGroup)
          dispatch(
            uiReadingGroupActions.setReadingGroup(this.defaultReadingGroup)
          );
      }
    }

    get defaultReadingGroup() {
      return "private";
    }

    get childProps() {
      return {
        setReadingGroup: this.setReadingGroup
      };
    }

    get canEngagePublicly() {
      // When this HOC is used outside of the reader context, we won't have access
      // to project abilities. In that case, we'll assume that public engagement is
      // possible. For example, we list annotations and the annotation editor in
      // reading groups, and don't have easy access to the parent project. We mitigate
      // this problem by not rendering the reading group selector in the editor outside
      // of the reader. If the user wants to change an annotation reading group, they
      // need to do it in the reader, not from within the RG annotation list.
      if (!this.context) return true;
      return this.context.attributes.abilities.engagePublicly;
    }

    get adjustedReadingGroups() {
      if (!this.props.readingGroups) return [];
      if (this.canEngagePublicly) return this.props.readingGroups;
      return this.props.readingGroups.filter(
        rg => rg.attributes.privacy === "private"
      );
    }

    get validatedCurrentReadingGroup() {
      const { currentReadingGroup } = this.props;
      if (currentReadingGroup === "public" && this.canEngagePublicly)
        return currentReadingGroup;
      if (currentReadingGroup === "private") return currentReadingGroup;

      const validGroup = this.adjustedReadingGroups.find(
        group => group.id === currentReadingGroup
      );
      if (validGroup) return currentReadingGroup;
      return this.defaultReadingGroup;
    }

    setReadingGroup = id => {
      this.props.dispatch(uiReadingGroupActions.setReadingGroup(id));
    };

    render() {
      const { _authentication, ...otherProps } = this.props;
      const props = {
        ...otherProps,
        ...this.childProps,
        readingGroups: this.adjustedReadingGroups,
        currentReadingGroup: this.validatedCurrentReadingGroup
      };
      return React.createElement(WrappedComponent, props);
    }
  }

  const ConnectedWithReadingGroups = connect(WithReadingGroups.mapStateToProps)(
    WithReadingGroups
  );

  return hoistStatics(ConnectedWithReadingGroups, WrappedComponent);
}

import React from "react";
import PropTypes from "prop-types";
import { requests } from "api";
import { select, loaded } from "utils/entityUtils";
import hoistStatics from "hoist-non-react-statics";
import { connect } from "react-redux";
import { uiReadingGroupActions } from "actions";
import { ReaderContext } from "helpers/contexts";
import get from "lodash/get";
import isEqual from "lodash/isEqual";

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
        currentAnnotatingReadingGroup: get(
          state,
          "ui.persistent.reader.readingGroups.currentAnnotatingReadingGroup"
        ),
        currentAnnotationOverlayReadingGroup: get(
          state,
          "ui.persistent.reader.readingGroups.currentAnnotationOverlayReadingGroup"
        )
      };
    };

    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    static propTypes = {
      readingGroups: PropTypes.array,
      readingGroupsLoaded: PropTypes.bool,
      currentAnnotatingReadingGroup: PropTypes.string,
      currentAnnotationOverlayReadingGroup: PropTypes.string
    };

    static contextType = ReaderContext;

    componentDidUpdate(prevProps) {
      const {
        readingGroupsLoaded,
        readingGroups,
        currentAnnotatingReadingGroup,
        dispatch
      } = this.props;

      const { readingGroups: previousReadingGroups } = prevProps;

      if (!readingGroupsLoaded) return;
      if (readingGroups === previousReadingGroups) return;
      if (!currentAnnotatingReadingGroup) return;

      const readingGroupIds = (readingGroups || []).map(rg => rg.id);
      const previousReadingGroupIds = (previousReadingGroups || []).map(
        rg => rg.id
      );
      if (isEqual(readingGroupIds, previousReadingGroupIds)) return;

      const currentAnnotatingGroup = this.adjustedReadingGroups.find(
        group => group.id === currentAnnotatingReadingGroup
      );

      if (currentAnnotatingGroup) return;
      if (currentAnnotatingReadingGroup === this.defaultAnnotatingReadingGroup)
        return;

      // The selected reading group is no longer valid. Select the default group instead.
      dispatch(
        uiReadingGroupActions.setAnnotatingReadingGroup(
          this.defaultAnnotatingReadingGroup
        )
      );
    }

    get defaultAnnotatingReadingGroup() {
      return "private";
    }

    get childProps() {
      return {
        setAnnotatingReadingGroup: this.setAnnotatingReadingGroup,
        setAnnotationOverlayReadingGroup: this.setAnnotationOverlayReadingGroup
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
        rg =>
          rg.attributes.privacy === "private" ||
          rg.attributes.privacy === "anonymous"
      );
    }

    get validatedCurrentReadingGroup() {
      const { currentAnnotatingReadingGroup } = this.props;
      if (currentAnnotatingReadingGroup === "public" && this.canEngagePublicly)
        return currentAnnotatingReadingGroup;
      if (currentAnnotatingReadingGroup === "private")
        return currentAnnotatingReadingGroup;

      const validGroup = this.adjustedReadingGroups.find(
        group => group.id === currentAnnotatingReadingGroup
      );
      if (validGroup) return currentAnnotatingReadingGroup;
      return this.defaultAnnotatingReadingGroup;
    }

    get currentAnnotationOverlayReadingGroup() {
      return this.props.currentAnnotationOverlayReadingGroup;
    }

    setAnnotatingReadingGroup = id => {
      this.props.dispatch(uiReadingGroupActions.setAnnotatingReadingGroup(id));
    };

    setAnnotationOverlayReadingGroup = id => {
      this.props.dispatch(
        uiReadingGroupActions.setAnnotationOverlayReadingGroup(id)
      );
    };

    render() {
      const { _authentication, ...otherProps } = this.props;
      const props = {
        ...otherProps,
        ...this.childProps,
        readingGroups: this.adjustedReadingGroups,
        currentAnnotatingReadingGroup: this.validatedCurrentReadingGroup,
        currentAnnotationOverlayReadingGroup: this
          .currentAnnotationOverlayReadingGroup
      };
      return React.createElement(WrappedComponent, props);
    }
  }

  const ConnectedWithReadingGroups = connect(WithReadingGroups.mapStateToProps)(
    WithReadingGroups
  );

  return hoistStatics(ConnectedWithReadingGroups, WrappedComponent);
}

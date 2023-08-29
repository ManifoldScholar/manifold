import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { annotationsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import Annotation from "global/components/Annotation";

const { request } = entityStoreActions;

export class AnnotationList extends PureComponent {
  static mapStateToProps = (state, ownProps) => {
    const newState = {
      annotations: select(requests.rDrawerAnnotations, state.entityStore) || []
    };
    return { ...newState, ...ownProps };
  };

  static displayName = "Annotation.List";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loginHandler: PropTypes.func.isRequired,
    annotationIds: PropTypes.array.isRequired,
    createHandler: PropTypes.func.isRequired,
    annotations: PropTypes.array,
    closeDrawer: PropTypes.func,
    sectionId: PropTypes.string,
    textId: PropTypes.string
  };

  static defaultProps = {
    annotations: []
  };

  componentDidMount() {
    this.fetchAnnotations(this.props);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.annotations.length === 0 &&
      prevProps.annotations.length > 0
    ) {
      this.props.closeDrawer();
    }
  }

  fetchAnnotations(props) {
    const { sectionId, textId } = this.props ?? {};
    const annotationsCall = annotationsAPI.forSection(sectionId, textId, {
      ids: this.props.annotationIds
    });
    props.dispatch(request(annotationsCall, requests.rDrawerAnnotations));
  }

  saveAnnotation = (model, group) => {
    const attributes = { ...group.selection, ...model.attributes };
    const newModel = { ...model, attributes };
    return this.props.createHandler(newModel);
  };

  render() {
    const { annotations } = this.props;

    return (
      <Annotation.List.GroupedBySelection
        saveAnnotation={this.saveAnnotation}
        annotations={annotations}
        loginHandler={this.props.loginHandler}
        dispatch={this.props.dispatch}
      />
    );
  }
}

export default connect(AnnotationList.mapStateToProps)(AnnotationList);

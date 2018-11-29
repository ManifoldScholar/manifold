import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "components/reader/Annotation";
import { connect } from "react-redux";
import { annotationsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";

const { request } = entityStoreActions;

export class AnnotationList extends PureComponent {
  static mapStateToProps = (state, ownProps) => {
    const newState = {
      annotations: select(requests.rDrawerAnnotations, state.entityStore) || []
    };
    return Object.assign({}, newState, ownProps);
  };

  static displayName = "Annotation.List";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loginHandler: PropTypes.func.isRequired,
    annotationIds: PropTypes.array.isRequired,
    createHandler: PropTypes.func.isRequired,
    annotations: PropTypes.array,
    closeDrawer: PropTypes.func,
    sectionId: PropTypes.string
  };

  static defaultProps = {
    annotations: []
  };

  constructor(props) {
    super(props);
    this.state = {
      editorVisible: false
    };
  }

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
    const sId = this.props.sectionId;
    const annotationsCall = annotationsAPI.forSection(sId, {
      ids: this.props.annotationIds
    });
    props.dispatch(request(annotationsCall, requests.rDrawerAnnotations));
  }

  saveAnnotation = (model, group) => {
    const attributes = Object.assign({}, group.selection, model.attributes);
    const newModel = Object.assign({}, model, { attributes });
    return this.props.createHandler(newModel);
  };

  showEditor = () => {
    this.setState({ editorVisible: true });
  };

  hideEditor = () => {
    this.setState({ editorVisible: false });
  };

  render() {
    const { annotations } = this.props;

    return (
      <div className="annotation-selection">
        <ul className="selection-list">
          <Annotation.GroupedBySubject
            annotations={annotations}
            render={group => (
              <li key={group.selection.hash} className="annotation-detail">
                <Annotation.Selection.Wrapper
                  subject={group.selection.subject}
                  onAnnotate={this.showEditor}
                  onLogin={this.props.loginHandler}
                  truncate={250}
                />
                {this.state.editorVisible && (
                  <Annotation.Editor
                    annotation={{ attributes: {} }}
                    cancel={this.hideEditor}
                    saveAnnotation={attr => this.saveAnnotation(attr, group)}
                  />
                )}
                <div className="container">
                  <ul className="annotation-list">
                    {group.annotations.map(annotation => {
                      return (
                        <Annotation.Detail
                          dispatch={this.props.dispatch}
                          key={annotation.id}
                          creator={annotation.relationships.creator}
                          showLogin={this.props.loginHandler}
                          annotation={annotation}
                        />
                      );
                    })}
                  </ul>
                </div>
              </li>
            )}
          />
        </ul>
      </div>
    );
  }
}

export default connect(AnnotationList.mapStateToProps)(AnnotationList);

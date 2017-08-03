import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "components/reader/Annotation";
import { meAPI, annotationsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import HigherOrder from "containers/global/HigherOrder";
import connectAndFetch from "utils/connectAndFetch";

const { request } = entityStoreActions;

export class MineForText extends PureComponent {
  static displayName = "Annotation.MineForText";

  static propTypes = {
    annotations: PropTypes.array,
    text: PropTypes.object.isRequired,
    closeDrawer: PropTypes.func,
    sectionId: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  };

  static defaultProps = {
    annotations: []
  };

  static mapStateToProps = (state, ownProps) => {
    const newState = {
      annotations:
        select(requests.rMyAnnotationsForText, state.entityStore) || []
    };
    return Object.assign({}, newState, ownProps);
  };

  constructor(props) {
    super(props);
    this.updateAnnotation = this.updateAnnotation.bind(this);
    this.deleteAnnotation = this.deleteAnnotation.bind(this);
  }

  componentDidMount() {
    this.fetchAnnotations(this.props);
  }

  fetchAnnotations(props) {
    const tId = this.props.text.id;
    const annotationsCall = meAPI.annotations({
      text: tId
    });
    props.dispatch(request(annotationsCall, requests.rMyAnnotationsForText));
  }

  updateAnnotation(annotation) {
    const call = annotationsAPI.update(annotation.id, annotation);
    const res = this.props.dispatch(request(call, requests.rAnnotationUpdate));
    return res.promise;
  }

  deleteAnnotation(annotation) {
    const call = annotationsAPI.destroy(annotation.id);
    const options = { removes: { type: "annotations", id: annotation.id } };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationDestroy, options)
    );
    return res.promise;
  }

  renderHighlight(annotation) {
    return (
      <li key={annotation.id}>
        <Annotation.Highlight
          deleteHandler={this.deleteAnnotation}
          annotation={annotation}
        />
      </li>
    );
  }

  renderAnnotation(annotation) {
    return (
      <li key={annotation.id} className="annotation-detail">
        <Annotation.Selection.Wrapper
          {...annotation.attributes}
          truncate={250}
          includeEditor={false}
          closeOnSave={false}
        />
        <div className="container">
          <ul className="annotation-list">
            <Annotation.Annotation
              saveHandler={this.updateAnnotation}
              deleteHandler={this.deleteAnnotation}
              key={annotation.id}
              creator={annotation.relationships.creator}
              annotation={annotation}
              includeComments={false}
            />
          </ul>
        </div>
      </li>
    );
  }

  render() {
    return (
      <div>
        <ul className="selection-list separated">
          {/*
            Heading markup
            <li className="selection-group-heading">
              <h2>
                Section title for this Particular Text's Section
              </h2>
            </li>
          */}
          {this.props.annotations.map(annotation => {
            const format = annotation.attributes.format;
            if (format === "annotation") {
              return this.renderAnnotation(annotation);
            } else if (format === "highlight") {
              return this.renderHighlight(annotation);
            }
            return null;
          })}
        </ul>
      </div>
    );
  }
}
export { MineForText as MineForTextContainer }; // unconnected for testing
export default connectAndFetch(HigherOrder.withCurrentUser(MineForText));

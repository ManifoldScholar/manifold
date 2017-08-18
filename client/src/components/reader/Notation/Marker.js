import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import classnames from "classnames";
import { uiReaderActions } from "actions";
import lh from "helpers/linkHandler";

class NotationMarker extends Component {
  static mapStateToProps = (state, ownProps) => {
    const newState = {
      activeAnnotation: state.ui.reader.activeAnnotation
    };
    return Object.assign({}, newState, ownProps);
  };

  static propTypes = {
    annotations: PropTypes.array,
    dispatch: PropTypes.func,
    activeAnnotation: PropTypes.string,
    history: PropTypes.object
  };

  setActiveAnnotation(annotationId) {
    this.props.dispatch(uiReaderActions.setActiveAnnotation(annotationId));
  }

  handleClick(event, annotation) {
    event.preventDefault();
    const base = window.location.pathname;
    let rel = lh.link("frontendProjectResourceRelative", annotation.resourceId);
    if (annotation.type === "collection") {
      rel = lh.link(
        "frontendProjectCollectionRelative",
        annotation.collectionId
      );
    }
    const url = `${base}/${rel}`;
    this.props.history.push(url);
  }

  render() {
    return (
      <span>
        {this.props.annotations.map(annotation => {
          const id = annotation.id;
          const markerClassNames = classnames({
            "notation-marker": true,
            active: id === this.props.activeAnnotation
          });
          return (
            <span
              key={annotation.id}
              title={id}
              data-annotation-notation={id}
              className={markerClassNames}
              onClick={event => {
                this.handleClick(event, annotation);
              }}
              onMouseOver={() => {
                this.setActiveAnnotation(id);
              }}
              onMouseLeave={() => {
                this.setActiveAnnotation(null);
              }}
            >
              <i className="manicon notation-cube-fill">
                &nbsp;&nbsp;&nbsp;&nbsp;
              </i>
            </span>
          );
        })}
      </span>
    );
  }
}

export default connectAndFetch(NotationMarker);

import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import classnames from "classnames";
import { uiReaderActions } from "actions";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

class NotationMarker extends Component {
  static mapStateToProps = (state, ownProps) => {
    const newState = {
      activeAnnotation: state.ui.transitory.reader.activeAnnotation
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
    this.props.dispatch(
      uiReaderActions.setActiveAnnotation({ annotationId, passive: false })
    );
  }

  hasTouchSupport() {
    return (
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch) ||
      navigator.maxTouchPoints > 0 ||
      window.navigator.msMaxTouchPoints > 0
    );
  }

  handleClick(event, annotation) {
    event.preventDefault();
    if (!this.hasTouchSupport()) {
      const base = window.location.pathname;
      let rel = lh.link(
        "frontendProjectResourceRelative",
        annotation.resourceId
      );
      if (annotation.type === "resource_collection") {
        rel = lh.link(
          "frontendProjectResourceCollectionRelative",
          annotation.resourceCollectionId
        );
      }
      const url = `${base}/${rel}`;
      this.props.history.push(url, { noScroll: true });
    } else {
      this.setActiveAnnotation(annotation.id);
    }
  }

  render() {
    const touch = this.hasTouchSupport();

    return (
      <span>
        {this.props.annotations.map(annotation => {
          const id = annotation.id;
          const markerClassNames = classnames({
            "notation-marker": true,
            "notation-marker--active": id === this.props.activeAnnotation
          });
          return (
            <span
              key={annotation.id}
              title={id}
              data-annotation-notation={id}
              role="presentation"
              className={markerClassNames}
              onClick={event => {
                this.handleClick(event, annotation);
              }}
              onMouseOver={() => {
                if (!touch) this.setActiveAnnotation(id);
              }}
              onMouseLeave={() => {
                if (!touch) this.setActiveAnnotation(null);
              }}
            >
              <IconComposer
                icon="resourceFilled24"
                size={28}
                iconClass="notation-marker__icon"
              />
            </span>
          );
        })}
      </span>
    );
  }
}

export default connectAndFetch(NotationMarker);

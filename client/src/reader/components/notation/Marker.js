import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import classnames from "classnames";
import { uiReaderActions } from "actions";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

export class NotationMarker extends Component {
  static mapStateToProps = (state, ownProps) => {
    const newState = {
      activeAnnotation: state.ui.transitory.reader.activeAnnotation
    };
    return { ...newState, ...ownProps };
  };

  static propTypes = {
    annotations: PropTypes.array,
    dispatch: PropTypes.func,
    activeAnnotation: PropTypes.string,
    history: PropTypes.object
  };

  get hasTouchSupport() {
    return (
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch) ||
      navigator.maxTouchPoints > 0 ||
      window.navigator.msMaxTouchPoints > 0
    );
  }

  get thumbnailsAreVisible() {
    const breakpoint = 1235;
    return window.innerWidth >= breakpoint;
  }

  get disallowMarkerClickthru() {
    return this.hasTouchSupport && !this.thumbnailsAreVisible;
  }

  setActiveAnnotation(annotationId) {
    this.props.dispatch(
      uiReaderActions.setActiveAnnotation({ annotationId, passive: false })
    );
  }

  handleClick(event, annotation) {
    event.preventDefault();

    if (this.disallowMarkerClickthru) {
      return this.setActiveAnnotation(annotation.id);
    }

    const base = window.location.pathname;
    let rel = lh.link("frontendProjectResourceRelative", annotation.resourceId);
    if (annotation.type === "resource_collection") {
      rel = lh.link(
        "frontendProjectResourceCollectionRelative",
        annotation.resourceCollectionId
      );
    }
    const url = `${base}/${rel}`;
    this.props.history.push(url, { noScroll: true });
  }

  render() {
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
              onClick={event => this.handleClick(event, annotation)}
              onMouseOver={() => {
                if (this.disallowMarkerClickthru) return null;
                this.setActiveAnnotation(id);
              }}
              onMouseLeave={() => {
                if (this.disallowMarkerClickthru) return null;
                this.setActiveAnnotation(null);
              }}
            >
              <IconComposer
                icon="resourceFilled24"
                size={28}
                className="notation-marker__icon"
              />
            </span>
          );
        })}
      </span>
    );
  }
}

export default connectAndFetch(NotationMarker);

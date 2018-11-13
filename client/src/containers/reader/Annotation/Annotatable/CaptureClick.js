import React, { Component } from "react";
import PropTypes from "prop-types";
import selectionHelpers from "./selectionHelpers";
import isString from "lodash/isString";

export default class AnnotatableCaptureClick extends Component {
  static propTypes = {
    activeAnnotation: PropTypes.string,
    updateActiveAnnotation: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  doesElementContainAnnotationAndHighlight(el) {
    return (
      this.doesElementContainRemovableHighlight(el) &&
      this.doesElementContainAnnotation(el)
    );
  }

  doesElementContainAnnotation(el) {
    if (!el) return false;
    const { textAnnotationIds } = el.dataset;
    return isString(textAnnotationIds) && textAnnotationIds.length > 0;
  }

  doesElementContainRemovableHighlight(el) {
    if (!el) return false;
    const { removableHighlightId } = el.dataset;
    return isString(removableHighlightId) && removableHighlightId.length > 0;
  }

  handleMouseUp = event => {
    if (!event || !event.target) return;

    // If the mouseup happens over the currently active highlight, prevent text
    // deselection.
    const id = event.target.dataset.removableHighlightId;
    if (id === this.props.activeAnnotation) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  handleClick = event => {
    if (!event || !event.target) return;
    const el = event.target;
    if (this.doesElementContainAnnotationAndHighlight(el))
      this.handleDisambiguationClick(event, el);
    if (this.doesElementContainRemovableHighlight(el))
      return this.handleRemovableHighlightClick(event, el);
    if (this.doesElementContainAnnotation(el))
      return this.handleAnnotationClick(event, el);
  };

  handleDisambiguationClick(eventIgnored, el) {
    this.setState({
      showAnnotationsInDrawer: event => {
        this.clearNativeSelection();
        this.handleAnnotationClick(event, el);
      }
    });
  }

  handleRemovableHighlightClick(event, el) {
    event.preventDefault();
    event.stopPropagation();
    const id = el.dataset.removableHighlightId;
    this.props.updateActiveAnnotation(id, event);
  }

  handleAnnotationClick(event, el) {
    event.preventDefault();
    const link = selectionHelpers.closest(el, "a");
    const annotationIds = this.elementAnnotationIds(el);
    if (link) return this.showLinkMenu(event, el, annotationIds, link);
    this.props.actions.openViewAnnotationsDrawer(annotationIds);
  }

  showLinkMenu(event, el, annotationIds, link) {
    event.stopPropagation();
    const eventInfo = {
      annotationIds,
      link
    };
    this.props.updateActiveAnnotation(annotationIds, event, eventInfo);
  }

  elementAnnotationIds(el, type = "textAnnotationIds") {
    if (!el) return null;
    const ids = el.dataset[type];
    return ids.split(",");
  }

  render() {
    return (
      <div
        role="presentation"
        onClick={this.handleClick}
        onMouseUp={this.handleMouseUp}
      >
        {this.props.children}
      </div>
    );
  }
}

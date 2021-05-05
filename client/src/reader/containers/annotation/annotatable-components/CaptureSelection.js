import React, { Component } from "react";
import PropTypes from "prop-types";
import selectionHelpers from "./selectionHelpers";

export default class AnnotatableCaptureSelection extends Component {
  static propTypes = {
    activeAnnotation: PropTypes.string,
    activeEvent: PropTypes.object,
    annotatableRef: PropTypes.object,
    selectionState: PropTypes.shape({
      selection: PropTypes.object,
      selectionComplete: PropTypes.bool,
      selectionAnnotation: PropTypes.object,
      popupTriggerX: PropTypes.number,
      popupTriggerY: PropTypes.number
    }),
    updateSelection: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  };

  componentDidMount() {
    document.addEventListener("selectionchange", this.handleSelectionChange);
  }

  componentDidUpdate(prevProps) {
    const { activeAnnotation: annotationId } = this.props;
    const { activeAnnotation: prevAnnotationId } = prevProps;
    if (annotationId && annotationId !== prevAnnotationId) {
      this.selectActiveAnnotation(annotationId);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    document.removeEventListener("selectionchange", this.handleSelectionChange);
  }

  getEventXY(event) {
    if (!this.isLocatableEvent(event)) return { x: null, y: null };
    if (event.clientX && event.clientY)
      return { x: event.clientX, y: event.clientY };
    return { x: null, y: null };
  }

  get nativeSelection() {
    return this.validateNativeSelection(window.getSelection());
  }

  selectActiveAnnotation() {
    const { activeAnnotation, activeEvent } = this.props;
    const [first, last] = this.firstAndLastAnnotationNode(activeAnnotation);
    if (!first || !last) return;
    const sel = window.getSelection();
    const range = document.createRange();
    range.setStart(first, 0);
    range.setEnd(last, last.length);
    sel.removeAllRanges();
    sel.addRange(range);
    this.updateSelectionState(activeEvent, true);
  }

  firstAndLastAnnotationNode(id) {
    const nodes = document.querySelectorAll(`[data-annotation-ids*="${id}"]`);
    const finder = n => n.nodeType === Node.TEXT_NODE;
    const first = [...nodes[0].childNodes].find(finder);
    const last = [...nodes[nodes.length - 1].childNodes].find(finder);
    return [first, last];
  }

  emptySelection(merge = {}) {
    return {
      selection: null,
      selectionComplete: false,
      selectionAnnotation: null,
      popupTriggerX: null,
      popupTriggerY: null,
      ...merge
    };
  }

  validateNativeSelection(nativeSelection) {
    if (this.isNativeSelectionEmpty(nativeSelection)) return null;
    if (this.isNativeSelectionOutOfBounds(nativeSelection)) return null;
    return nativeSelection;
  }

  isNativeSelectionEmpty(nativeSelection) {
    if (nativeSelection.isCollapsed === true) return true;
    if (nativeSelection.anchorNode === null) return true;
    return false;
  }

  isNativeSelectionOutOfBounds(nativeSelection) {
    if (
      !selectionHelpers.parentContainsSelection(
        this.props.annotatableRef,
        nativeSelection
      )
    )
      return true;
    return false;
  }

  isLocatableEvent(event) {
    if (!event) return false;
    return event.type !== "selectionchange";
  }

  updateSelectionState(event = null, selectionComplete = false) {
    try {
      const { selectionState } = this.props;
      const selection = this.mapNativeSelection(this.nativeSelection);
      if (!selection) return this.props.updateSelection(this.emptySelection());
      let complete = selectionComplete;
      if (selectionState.selectionComplete) complete = true;
      const { x, y } = this.getEventXY(event);
      const newState = this.emptySelection({
        selection,
        selectionAnnotation: this.mapSelectionToAnnotation(
          selection,
          this.nativeSelection
        ),
        selectionComplete: complete,
        popupTriggerX: selection && x ? x : selectionState.popupTriggerX,
        popupTriggerY: selection && y ? y : selectionState.popupTriggerY
      });
      this.props.updateSelection(newState);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("There was an error in updateSelection: %o", error);
    }
  }

  // Maps selection to an annotation data structure
  mapSelectionToAnnotation(selection, nativeSelection) {
    if (!selection) return null;

    const range = selection.range;

    // 1. Find the closest element with a data-node-uuid attribute
    const startNode = selectionHelpers.findClosestTextNode(
      range.startContainer
    );

    // 2. Create a new range that ends with the start point of our existing range
    const startRange = document.createRange();
    startRange.setStart(startNode, 0);
    try {
      startRange.setEnd(range.startContainer, range.startOffset + 1);
    } catch (error) {
      startRange.setEnd(range.startContainer, range.startOffset);
    }

    // 3. Find the offset from the data-node-uuid start element
    const startChar = startRange.toString().length;

    // 4. Do the same for the end node
    let endNode = selectionHelpers.findClosestTextNode(range.endContainer);
    const endRange = document.createRange();

    // This bit of logic is to deal with shift-right selection that captures the beginning
    // of the next node. When the end of the range is the next node, it won't be a text
    // node or have a parent text node. Consequently, we'll need to descend into it to
    // capture its first text node and end the range there.
    if (endNode === null) {
      endNode = startNode;
      endRange.setStart(endNode, 0);
      const endContainer = [...endNode.childNodes].find(
        node => node.nodeType === Node.TEXT_NODE
      );
      endRange.setEnd(endContainer, endNode.textContent.length);
    } else {
      // In the case of a locked selection, this range is wrong because the locking of the
      // selection changed the dom and invalidate the selection range.
      endRange.setStart(endNode, 0);
      endRange.setEnd(range.endContainer, range.endOffset);
    }
    const endChar = endRange.toString().length;

    const annotation = {
      startNode: startNode.dataset.nodeUuid,
      startChar,
      endNode: endNode.dataset.nodeUuid,
      endChar,
      subject: this.extractText(nativeSelection)
    };
    return annotation;
  }

  extractText(nativeSelection) {
    try {
      const range = nativeSelection.getRangeAt(0);
      if (!range) return nativeSelection.toString();
      const fragment = range.cloneContents();
      const blockRegex = /^(address|fieldset|li|article|figcaption|main|aside|figure|nav|blockquote|footer|ol|details|form|p|dialog|h1|h2|h3|h4|h5|h6|pre|div|header|section|table|ul|hr)$/i;

      let text = "";
      fragment.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          text += node.innerText;
          if (blockRegex.test(node.nodeName)) {
            text += "\n";
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          text += " ";
          text += node.textContent;
        }
      });
      text = text.trim();
      return text;
    } catch (error) {
      return nativeSelection.toString();
    }
  }

  mapNativeSelection(nativeSelection) {
    if (!nativeSelection) return null;
    const range = nativeSelection.getRangeAt(0);
    const text = nativeSelection.toString();
    if (text.length === 0 || !text.trim()) return null;

    const mappedSelection = {
      range,
      text,
      anchorNode: nativeSelection.anchorNode,
      anchorOffset: nativeSelection.anchorOffset,
      focusNode: nativeSelection.focusNode,
      focusOffset: nativeSelection.focusOffset,
      startNode: selectionHelpers.findClosestTextNode(range.startContainer)
    };
    return mappedSelection;
  }

  handleTouchEnd = event => {
    this.updateSelectionState(event, true);
  };

  handleMouseUp = event => {
    this.updateSelectionState(event, true);
  };

  handleKeyDown = event => {
    this.updateSelectionState(event, true);
  };

  handleSelectionChange = event => {
    this.updateSelectionState(event);
  };

  render() {
    return (
      <div
        role="presentation"
        className="no-focus-outline"
        tabIndex="-1"
        onTouchEnd={this.handleTouchEnd}
        onMouseUp={this.handleMouseUp}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
      >
        {this.props.children}
      </div>
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import selectionHelpers from "./selectionHelpers";
import {
  isMathMLNode,
  isMathMLWrapper,
  findFirstMathUuidNode,
  findLastMathUuidNode
} from "./mathHelpers";

class AnnotatableCaptureSelection extends Component {
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
    children: PropTypes.node.isRequired,
    popupRef: PropTypes.object,
    setSelectableRef: PropTypes.func,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.lastSelection = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("keyup", this.handleKeyUp);
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
    window.removeEventListener("keyup", this.handleKeyUp);
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

    // If the node is our MathML styling wrapper, descend into it to retrieve text nodes.
    const firstNode = isMathMLWrapper(nodes[0])
      ? findFirstMathUuidNode(nodes[0])
      : nodes[0];
    const first = [...firstNode.childNodes].find(finder);

    const lastNode = isMathMLWrapper([...nodes].pop())
      ? findLastMathUuidNode([...nodes].pop())
      : [...nodes].pop();
    const last = [...lastNode.childNodes].find(finder);

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
      window.getSelection().empty();
      let complete = selectionComplete;
      if (selectionState.selectionComplete) complete = true;
      const { x, y } = this.getEventXY(event);
      const newState = this.emptySelection({
        selection,
        selectionAnnotation: this.mapSelectionToAnnotation(selection),
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

  findStartValues(range) {
    // If the annotation begins in a math tag, capture the expression from the beginning.
    if (isMathMLNode(range.startContainer?.parentNode)) {
      const startNode = findFirstMathUuidNode(range.startContainer);
      const startChar = 1;
      return { startNode, startChar, adjustStart: true };
    }

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
    return { startNode, startChar };
  }

  findEndValues(range, startNode) {
    // If the annotation ends in a math tag, capture the entire mathematical expression.
    if (isMathMLNode(range.endContainer?.parentNode)) {
      const endNode = findLastMathUuidNode(range.endContainer);
      const endChar = endNode.textContent.length;
      return { endNode, endChar, adjustEnd: true };
    }

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
    return { endNode, endChar };
  }

  // Maps selection to an annotation data structure
  mapSelectionToAnnotation(selection) {
    if (!selection) return null;

    const range = selection.range;
    const { startNode, startChar, adjustStart } = this.findStartValues(range);
    const { endNode, endChar, adjustEnd } = this.findEndValues(
      range,
      startNode
    );

    // Adjust the selection range if we added characters to capture an entire mathematical expression.
    if (adjustStart) range.setStart(startNode, 0);
    if (adjustEnd) range.setEnd(endNode, endNode.childNodes.length);

    const annotation = {
      startNode: startNode.dataset.nodeUuid,
      startChar,
      endNode: endNode.dataset.nodeUuid,
      endChar,
      subject: this.extractText(range)
    };
    return annotation;
  }

  extractText(range) {
    try {
      const fragment = range.cloneContents();
      const blockRegex = /^(address|fieldset|li|article|figcaption|main|aside|figure|nav|blockquote|footer|ol|details|form|p|dialog|h1|h2|h3|h4|h5|h6|pre|div|header|section|table|ul|hr|math)$/i;

      let text = "";
      fragment.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          text += node.innerText ?? node.textContent;
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
      return range.toString();
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

  handleKeyUp = event => {
    const { key, shiftKey } = event;
    if (key === "Shift" && shiftKey === false) {
      const selectionNode = window.getSelection().anchorNode;
      if (selectionNode && selectionNode.type === Node.TextNode)
        this.updateSelectionState(event, true, true);
    }
  };

  handleMouseDown = event => {
    if (!this.props.selectionState.selectionComplete) return;

    this.updateSelectionState(event);
  };

  render() {
    /* Element captures events that bubble from nested interactive elements */
    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
    return (
      <div
        id="text-section-interactive-region"
        ref={this.props.setSelectableRef}
        role="region"
        aria-label={this.props.t("reader.section_label")}
        tabIndex={0}
        onTouchEnd={this.handleTouchEnd}
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
        // onKeyUp={this.handleKeyUp}
        className="no-focus-outline"
      >
        {this.props.children}
      </div>
    );
  }
}

export default withTranslation()(AnnotatableCaptureSelection);

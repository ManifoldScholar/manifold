import React, { Children, Component, PropTypes } from 'react';
import has from 'lodash/has';
import AnnotationPopup from './AnnotationPopup';
import { Drawer, Dialog } from 'components/backend';
import { Resource } from 'containers/reader';

class Annotatable extends Component {

  static propTypes = {
    children: React.PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    createAnnotation: React.PropTypes.func,
    lockSelection: React.PropTypes.func,
    sectionId: React.PropTypes.string,
    projectId: React.PropTypes.string
  }

  constructor() {
    super();
    this.updateSelection = this.updateSelection.bind(this);
    this.startSelection = this.startSelection.bind(this);
    this.updateStateSelection = this.updateStateSelection.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.highlightSelection = this.highlightSelection.bind(this);
    this.annotateSelection = this.annotateSelection.bind(this);
    this.startResourceSelection = this.startResourceSelection.bind(this);
    this.endResourceSelection = this.endResourceSelection.bind(this);
    this.attachResourceToSelection = this.attachResourceToSelection.bind(this);
    this.shareSelection = this.shareSelection.bind(this);
    this.closestTextNode = this.closestTextNode.bind(this);

    this.state = this.defaultState();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.startSelection, false);
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.startSelection, false);
    document.removeEventListener('mouseup', this.updateSelection, false);
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  defaultState() {
    return {
      selection: null,
      pseudoSelection: null,
      resourceSelection: false,
      selectionLocked: false,
      selectionClickEvent: null
    };
  }

  // This method handles shift + arrow selection modification
  handleKeyDown(event) {
    const key = event.keyCode;
    const isShift = event.shiftKey;
    if (isShift && (key >= 37 && key <= 40)) {
      this.updateSelection(event);
    }
  }

  // The native selection is read only, so we'll map it to a similar selection object
  // that we have more control over.
  updateStateSelection(nativeSelection, selectionClickEvent = null) {
    // if there is no native selection and we're not in a locked start, clear it.
    if (!nativeSelection && !this.state.selectionLocked) return this.clearSelection();
    // if there's no native selection, return
    if (!nativeSelection) return;
    // does the native selection start and end in our document?
    if (!this.annotatable.contains(nativeSelection.anchorNode)) return;
    if (!this.annotatable.contains(nativeSelection.focusNode)) return;
    // normalize the native selection
    const selection = this.mapNativeSelectionToState(nativeSelection);
    // if it changed, return
    if (this.didSelectionChange(selection)) return;
    // update the state
    this.setState({ selection, selectionClickEvent });
  }

  didSelectionChange(selection) {
    return this.compareSelections(selection, this.state.selection) === true
  }

  clearSelection() {
    this.setState(this.defaultState());
  }

  // Maps the browser selection object to component state
  mapNativeSelectionToState(nativeSelection) {
    return {
      anchorNode: nativeSelection.anchorNode,
      anchorOffset: nativeSelection.anchorOffset,
      focusNode: nativeSelection.focusNode,
      focusOffset: nativeSelection.focusOffset,
      text: nativeSelection.toString(),
      range: this.mapNativeSelectionToRange(nativeSelection)
    };
  }

  // Maps the browser selection to a range object.
  mapNativeSelectionToRange(selection) {
    return selection.getRangeAt(0);
  }

  // Maps selection to an annotation data structure
  mapStateToAnnotation(selection, format) {

    const range = selection.range;

    // 1. Find the closest element with a data-node-uuid attribute
    const startNode = this.closestTextNode(range.startContainer);

    // 2. Create a new range that ends with the start point of our existing range
    const startRange = document.createRange();
    startRange.setStart(startNode, 0);
    startRange.setEnd(range.startContainer, range.startOffset + 1);

    // 3. Find the offset from the data-node-uuid start element
    const startChar = startRange.toString().length;

    // 4. Do the same for the end node
    let endNode = this.closestTextNode(range.endContainer);
    const endRange = document.createRange();

    // This bit of logic is to deal with shift-right selection that captures the beginning
    // of the next node. When the end of the range is the next node, it won't be a text
    // node or have a parent text node. Consequently, we'll need to descend into it to
    // capture its first text node and end the range there.
    if (endNode === null) {
      endNode = startNode;
      endRange.setStart(endNode, 0);
      const endContainer = [...endNode.childNodes].find((node) => node.nodeType === 3);
      endRange.setEnd(endContainer, endNode.textContent.length);
    } else {
      endRange.setStart(endNode, 0);
      console.log(range.endContainer, range.endOffset);
      endRange.setEnd(range.endContainer, range.endOffset);
    }
    const endChar = endRange.toString().length;

    const annotation = {
      startNode: startNode.dataset.nodeUuid,
      startChar,
      endNode: endNode.dataset.nodeUuid,
      endChar,
      subject: selection.text,
      format
    };
    return annotation;
  }

  // Find the closest element tagged as a text node.
  closestTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (has(parent.dataset, 'nodeUuid')) {
        return parent;
      }
      const ancestorNode = this.closest(parent, '[data-node-uuid]');
      return ancestorNode;
    }
    const ancestorNode = this.closest(node, '[data-node-uuid]');
    return ancestorNode;
  }

  // Utility method should probably be put elsewhere.
  closest(el, selector) {
    let element = el;
    const matchesSelector = element.matches || element.webkitMatchesSelector ||
      element.mozMatchesSelector || element.msMatchesSelector;
    while (element) {
      if (matchesSelector.call(element, selector)) {
        break;
      }
      element = element.parentElement;
    }
    return element;
  }

  // Returnst true if selection a and b should be considered the same selection.
  compareSelections(a, b) {
    if (a === null && b === null) return true;
    if (a === null && b !== null) return false;
    if (b === null && a !== null) return false;
    return a.text === b.text;
  }

  // A valid selection is any selection that's not empty.
  validateSelection(nativeSelection) {
    if (nativeSelection.isCollapsed === true) return null;
    if (nativeSelection.anchorNode === null) return null;
    return nativeSelection;
  }

  updateSelection(event) {
    // We can now remove the one-time event listener that was setup when selection
    // started.
    document.removeEventListener('mouseup', this.updateSelection, false);
    // Selection events still only have varied support, so we need to depend on mouse
    // events. In the case of deselection, the mouseUp event is fired before the previous
    // selection has been cleared. We need to delay grabbing the selection until the
    // default handlers for the mouseup event have fired, and and selected text has been
    // deselected.
    setTimeout(() => {
      this.updateStateSelection(this.validateSelection(window.getSelection()), event);
    }, 0);
  }

  startSelection(event) {
    // Once we start the selection, we'll wait for the mouseup to happen.
    document.addEventListener('mouseup', this.updateSelection, false);
  }

  clearNativeSelection() {
    console.log('clearing native selection');
    window.getSelection().removeAllRanges();
  }

  createAnnotation(type, resource = null) {
    const annotation = this.mapStateToAnnotation(this.state.selection, type);
    this.props.createAnnotation(this.props.sectionId, annotation, resource);
    setTimeout(() => {
      this.updateStateSelection(null);
      this.clearNativeSelection();
    }, 0);
  }

  annotateSelection(event) {
    event.stopPropagation();
    this.createAnnotation('annotation');
  }

  highlightSelection(event) {
    event.stopPropagation();
    this.createAnnotation('highlight');
  }

  attachResourceToSelection(resource) {
    console.log(resource, 'resource');
    this.createAnnotation('resource', resource);
    this.endResourceSelection();
  }

  lockSelection() {
    this.setState({ selectionLocked: true }, () => {
      this.clearNativeSelection();
      this.props.lockSelection(this.mapStateToAnnotation(this.state.selection, 'selection'));
    });
  }

  unlockSelection() {
    this.setState({ selectionLocked: false }, () => {
      this.props.lockSelection(null);
    });
  }

  startResourceSelection(event) {
    this.setState({ resourceSelection: true });
    this.lockSelection();
  }

  endResourceSelection(event) {
    this.setState({ resourceSelection: false });
    this.unlockSelection()
  }

  shareSelection() {
    // TBD
  }

  render() {
    return (
      <div className="annotatable" ref={(a) => { this.annotatable = a; }}>
        {this.state.resourceSelection ?
          <Drawer.Wrapper
            closeCallback={this.endResourceSelection}
          >
            <div style={{paddingTop: 50}}>
                <Resource.Picker
                  projectId={this.props.projectId}
                  selectionHandler={this.attachResourceToSelection}
                />
            </div>
          </Drawer.Wrapper>
        : null}

        <AnnotationPopup
          share={this.shareSelection}
          highlight={this.highlightSelection}
          annotate={this.annotateSelection}
          attachResource={this.startResourceSelection}
          selection={this.state.selection}
          selectionClickEvent={this.state.selectionClickEvent}
          selectionLocked={this.state.selectionLocked}
        />
        { this.props.children ? Children.only(this.props.children) : null }
      </div>
    );
  }

}

export default Annotatable;

import React, { Children, Component, PropTypes } from 'react';
import has from 'lodash/has';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Annotation from 'components/reader/Annotation';
import { Drawer, Dialog } from 'components/backend';
import { Resource } from 'containers/reader';
import AnnotationContainers from 'containers/reader/Annotation';
import { Resource as ResourceComponents } from 'components/reader';
import fakeData from 'helpers/fakeData';
import { annotationsAPI, requests } from 'api';
import { entityStoreActions, uiVisibilityActions } from 'actions';
import isString from 'lodash/isString';
import { linkHelpers as lh } from 'routes';
const { request, flush } = entityStoreActions;

class Annotatable extends Component {

  static propTypes = {
    textId: React.PropTypes.string.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    projectId: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    containerSize: React.PropTypes.number.isRequired,
    fontSize: React.PropTypes.number.isRequired,
    children: React.PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    currentUser: React.PropTypes.object,
    lockSelection: React.PropTypes.func,
    selectionLockedAnnotation: React.PropTypes.object,
    selectionLocked: React.PropTypes.bool,
    body: React.PropTypes.object,
    resources: React.PropTypes.array,
    annotations: React.PropTypes.array
  }

  static defaultProps = {
    resource: [],
    annotations: []
  }

  constructor() {
    super();
    this.updateSelection = this.updateSelection.bind(this);
    this.startSelection = this.startSelection.bind(this);
    this.updateStateSelection = this.updateStateSelection.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.highlightSelection = this.highlightSelection.bind(this);
    this.startAnnotateSelection = this.startAnnotateSelection.bind(this);
    this.startResourceSelection = this.startResourceSelection.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.attachResourceToSelection = this.attachResourceToSelection.bind(this);
    this.closestTextNode = this.closestTextNode.bind(this);
    this.handlePossibleAnnotationClick = this.handlePossibleAnnotationClick.bind(this);
    this.createAnnotation = this.createAnnotation.bind(this);

    this.state = this.defaultState();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.startSelection, false);
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
    document.removeEventListener('mousedown', this.startSelection, false);
    document.removeEventListener('mouseup', this.updateSelection, false);
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  defaultState() {
    return {
      selection: null,
      pseudoSelection: null,
      drawerContents: null,
      selectionLocked: false,
      selectionClickEvent: null,
      listAnnotations: null
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
    return this.compareSelections(selection, this.state.selection) === true;
  }

  clearSelection() {
    const { listAnnotations, drawerContents, ...newState } = this.defaultState();
    this.setState(newState);
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
    this.timer = setTimeout(() => {
      this.updateStateSelection(this.validateSelection(window.getSelection()), event);
    }, 0);
  }

  startSelection(event) {
    // Once we start the selection, we'll wait for the mouseup to happen.
    document.addEventListener('mouseup', this.updateSelection, false);
  }

  clearNativeSelection() {
    window.getSelection().removeAllRanges();
  }

  createAnnotation(annotation, options = {}) {
    const resource = options.resource || null;
    const call = annotationsAPI.create(this.props.sectionId, annotation, resource);
    const requestOptions = {};
    if (options.addsTo) requestOptions.adds = options.addsTo;
    const res = this.props.dispatch(request(call, requests.rAnnotationCreate, requestOptions));
    res.promise.then(() => {
      if (options.closeOnSave) this.closeDrawer();
      this.updateStateSelection(null);
      this.clearNativeSelection();
      this.unlockSelection();
    });
    return res.promise;
  }

  startAnnotateSelection(event) {
    this.setState({ drawerContents: "annotate" });
    this.lockSelection();
  }

  highlightSelection(event) {
    event.stopPropagation();
    const annotation = this.mapStateToAnnotation(this.state.selection, 'highlight');
    this.createAnnotation(annotation);
  }

  attachResourceToSelection(resource) {
    const annotation = this.state.selectionLockedAnnotation;
    annotation.format = "resource";
    const closeOnSave = true;
    this.createAnnotation(annotation, { resource, closeOnSave });
  }

  lockSelection() {
    const selectionLockedAnnotation =
      this.mapStateToAnnotation(this.state.selection, 'selection');
    this.setState({
      selectionLocked: true,
      selectionLockedAnnotation
    }, () => {
      this.clearNativeSelection();
      this.props.lockSelection(selectionLockedAnnotation);
    });
  }

  unlockSelection() {
    this.setState({ selectionLocked: false }, () => {
      this.props.lockSelection(null);
    });
  }

  startResourceSelection(event) {
    this.setState({ drawerContents: "resources" });
    this.lockSelection();
  }

  closeDrawer(event) {
    this.setState({ drawerContents: null });
    // Keyboard event doesn't hide the popup by default,
    // so manually remove the selection
    if (event && event.type === 'keyup') {
      this.setState({ selection: null });
    }
    this.unlockSelection();
  }


  handlePossibleAnnotationClick(event) {
    if (!event || !event.target) return;
    const { listableAnnotationIds } = event.target.dataset;
    if (!isString(listableAnnotationIds) || listableAnnotationIds.length < 1) return;
    const listAnnotations = listableAnnotationIds.split(",");
    const drawerContents = "annotations";
    this.setState({ drawerContents, listAnnotations });
    event.preventDefault();
    event.stopPropagation();
  }

  /* eslint-disable no-unreachable */
  drawerProps() {
    const base = { open: false, closeCallback: this.closeDrawer };
    let options;
    switch (this.state.drawerContents) {
      case "resources":
        options = { open: true, style: "backend" };
        break;
      case "annotate":
        options = { open: true, lockScroll: "always", style: "frontend" };
        break;
      case "annotations":
        options = {
          open: true,
          lockScroll: "always",
          style: "frontend",
          icon: "word-bubble",
          title: "Annotations"
        };
        break;
      default:
        options = {};
        break;
    }
    return Object.assign(base, options);
  }
  /* eslint-enable no-unreachable */

  /* eslint-disable no-unreachable */
  renderDrawerContents() {
    switch (this.state.drawerContents) {
      case "resources":
        return this.renderDrawerResources(); // eslint-disable no-unreachable
        break;
      case "annotate":
        return this.renderDrawerAnnotate(); // eslint-disable no-unreachable
        break;
      case "annotations":
        return this.renderDrawerAnnotations(); // eslint-disable no-unreachable
        break;
      default:
        return null;
        break;
    }
  }
  /* eslint-enable no-unreachable */

  renderDrawerResources() {
    return (
      <Resource.Picker
        projectId={this.props.projectId}
        selectionHandler={this.attachResourceToSelection}
      />
    );
  }

  renderDrawerAnnotate() {
    const { subject, startNode, startChar, endNode, endChar } =
      this.state.selectionLockedAnnotation;
    return (
      <Annotation.Selection.Wrapper
        closeDrawer={this.closeDrawer}
        subject={subject}
        startNode={startNode}
        startChar={startChar}
        endNode={endNode}
        endChar={endChar}
        saveHandler={this.createAnnotation}
        truncate={600}
        annotating
      />
    );
  }

  renderDrawerAnnotations() {
    return (
      <AnnotationContainers.List
        closeDrawer={this.closeDrawer}
        sectionId={this.props.sectionId}
        annotationIds={this.state.listAnnotations}
        createHandler={this.createAnnotation}
      />
    );
  }

  render() {

    const showLogin = bindActionCreators(
      () => uiVisibilityActions.visibilityToggle('signInUpOverlay'),
      this.props.dispatch
    );

    return (
      <div>
        {/* Children must preceed the resource viewer, because the annotatable ref needs to
        be rendered prior to the resource viewer calculating where to put things. */}
        <div className="annotatable"
          ref={(a) => { this.annotatable = a; }}
          onClick={this.handlePossibleAnnotationClick}
        >
          { this.props.children ? Children.only(this.props.children) : null }
        </div>

        {/* The drawer contains resource, annotator, comments, etc */}
        <Drawer.Wrapper {...this.drawerProps()}>
          {this.renderDrawerContents()}
        </Drawer.Wrapper>

        {/* Render the annotation popup interface */}
        <Annotation.Popup.Wrapper
          currentUser={this.props.currentUser}
          shareUrl={lh.readerSection(this.props.textId, this.props.sectionId)}
          highlight={this.highlightSelection}
          annotate={this.startAnnotateSelection}
          attachResource={this.startResourceSelection}
          selection={this.state.selection}
          selectionClickEvent={this.state.selectionClickEvent}
          selectionLocked={this.state.selectionLocked}
          annotatableDomElement={this.annotatable}
          showLogin={showLogin}
        />

        {/* Render the margin resources */}
        {this.props.resources ?
          <ResourceComponents.Viewer.Wrapper
            sectionId={this.props.sectionId}
            textId={this.props.textId}
            resources={this.props.resources}
            annotations={this.props.annotations}
            containerSize={this.props.containerSize}
            fontSize={this.props.fontSize}
            body={this.props.body}
          /> : null
        }
      </div>
    );
  }

}

export default connect(
  Annotatable.mapStateToProps
)(Annotatable);

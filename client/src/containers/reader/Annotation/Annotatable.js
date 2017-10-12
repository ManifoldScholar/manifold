import React, { Children, Component } from "react";
import PropTypes from "prop-types";
import has from "lodash/has";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Annotation from "components/reader/Annotation";
import { Drawer } from "components/backend";
import { Notation } from "containers/reader";
import AnnotationContainers from "containers/reader/Annotation";
import { Notation as NotationComponents } from "components/reader";
import { annotationsAPI, requests } from "api";
import { entityStoreActions, uiVisibilityActions } from "actions";
import isString from "lodash/isString";
import lh from "helpers/linkHandler";
// import ch from "helpers/consoleHelpers";

const { request } = entityStoreActions;

class Annotatable extends Component {
  static propTypes = {
    textId: PropTypes.string.isRequired,
    sectionId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    bodySelector: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    containerSize: PropTypes.number.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    currentUser: PropTypes.object,
    lockSelection: PropTypes.func,
    selectionLockedAnnotation: PropTypes.object,
    selectionLocked: PropTypes.bool,
    notations: PropTypes.array,
    annotations: PropTypes.array,
    text: PropTypes.object,
    section: PropTypes.object
  };

  static defaultProps = {
    notation: [],
    annotations: []
  };

  constructor() {
    super();
    this.state = this.defaultState();
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
    // document.removeEventListener("mousedown", this.startSelection, false);
    // document.removeEventListener("mouseup", this.updateSelection, false);
    // document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  defaultState() {
    return {
      selection: null,
      pseudoSelection: null,
      drawerContents: null,
      selectionLocked: false,
      selectionClickEvent: null,
      textAnnotations: null,
      selectedAnnotation: null,
      showAnnotationsInDrawer: null
    };
  }

  // This method handles shift + arrow selection modification
  handleKeyDown = event => {
    const key = event.keyCode;
    const isShift = event.shiftKey;
    if (isShift && (key >= 37 && key <= 40)) {
      this.updateSelection(event);
    }
  };

  // The native selection is read only, so we'll map it to a similar selection object
  // that we have more control over.
  updateStateSelection = (nativeSelection, selectionClickEvent = null) => {
    // if there is no native selection and we're not in a locked start, clear it.
    if (!nativeSelection && !this.state.selectionLocked)
      return this.clearSelection();
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
  };

  didSelectionChange(selection) {
    return this.compareSelections(selection, this.state.selection) === true;
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
    let endOffset = range.startOffset + 1;
    if (endOffset > range.startContainer.length)
      endOffset = range.startContainer.length;
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
      subject: selection.text,
      format
    };
    return annotation;
  }

  // Find the closest element tagged as a text node.
  closestTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (has(parent.dataset, "nodeUuid")) {
        return parent;
      }
      const ancestorNode = this.closest(parent, "[data-node-uuid]");
      return ancestorNode;
    }
    const ancestorNode = this.closest(node, "[data-node-uuid]");
    return ancestorNode;
  }

  // Utility method should probably be put elsewhere.
  closest(el, selector) {
    let element = el;
    const matchesSelector =
      element.matches ||
      element.webkitMatchesSelector ||
      element.mozMatchesSelector ||
      element.msMatchesSelector;
    while (element) {
      if (matchesSelector.call(element, selector)) {
        break;
      }
      element = element.parentElement;
    }
    return element;
  }

  // Returns true if selection a and b should be considered the same selection.
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

  asyncUpdateSelection = event => {
    event.persist();
    this.timer = setTimeout(() => {
      this.updateSelection(event);
    }, 0);
  };

  updateSelection = event => {
    event.persist();
    // ch.notice("Annotation: updating selection", "pencil2");
    this.updateStateSelection(
      this.validateSelection(window.getSelection()),
      event
    );
  };

  startSelection = event => {
    if (event.ctrlKey || event.button === 2) return; // ignore right click & ctrl click.
    // ch.notice('Annotation: starting selection', "pencil2");
    this.clearSelection();
  };

  clearSelectedAnnotation() {
    this.setState({ selectedAnnotation: null });
  }

  clearNativeSelection() {
    window.getSelection().removeAllRanges();
  }

  clearSelection() {
    // ch.notice("Annotation: clearing selection", "pencil2");
    /* eslint-disable no-unused-vars */
    const {
      textAnnotations,
      drawerContents,
      ...newState
    } = this.defaultState();
    this.setState(newState);
    /* eslint-enable no-unused-vars */
  }

  createAnnotation = (annotation, options = {}) => {
    const notation = options.notation || null;
    const call = annotationsAPI.create(
      this.props.sectionId,
      annotation,
      notation
    );
    const requestOptions = { adds: requests.rAnnotations };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationCreate, requestOptions)
    );
    res.promise.then(() => {
      if (options.closeOnSave) this.closeDrawer();
      this.updateStateSelection(null);
      this.clearNativeSelection();
      this.unlockSelection();
    });
    return res.promise;
  };

  startAnnotateSelection = eventIgnored => {
    this.setState({ drawerContents: "annotate" });
    this.lockSelection();
  };

  highlightSelection = event => {
    event.stopPropagation();
    const annotation = this.mapStateToAnnotation(
      this.state.selection,
      "highlight"
    );
    this.createAnnotation(annotation);
  };

  destroySelected = eventIgnored => {
    const annotation = this.state.selectedAnnotation;
    if (!annotation) return;
    const call = annotationsAPI.destroy(this.state.selectedAnnotation.id);
    const options = { removes: annotation };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationDestroy, options)
    );
    res.promise.then(() => {
      this.updateStateSelection(null);
      this.clearNativeSelection();
      this.unlockSelection();
    });
    return res.promise;
  };

  attachNotationToSelection = notation => {
    const annotation = this.state.selectionLockedAnnotation;
    annotation.format = notation.type.slice(0, -1); // Type is a plural, so take the 's' off
    const closeOnSave = true;
    this.createAnnotation(annotation, { notation, closeOnSave });
  };

  /* Given an annotation ID, this will calculate the DOM range and select it using the
     browser selection API. This will, in turn, cause the annotation popup to appear.
   */
  selectAnnotation(event, annotationId) {
    // ch.notice("Selecting from existing annotation", "pencil2");
    const annotation = this.props.annotations.find(a => a.id === annotationId);
    if (annotation) this.setState({ selectedAnnotation: annotation });
    const [first, last] = this.firstAndLastAnnotationNode(annotationId);
    const sel = window.getSelection();
    const range = document.createRange();
    range.setStart(first, 0);
    range.setEnd(last, last.length);
    sel.removeAllRanges();
    sel.addRange(range);
    this.updateSelection(event);
  }

  firstAndLastAnnotationNode(id) {
    const nodes = document.querySelectorAll(`[data-annotation-ids*="${id}"]`);
    const finder = n => n.nodeType === Node.TEXT_NODE;
    const first = [...nodes[0].childNodes].find(finder);
    const last = [...nodes[nodes.length - 1].childNodes].find(finder);
    return [first, last];
  }

  lockSelection() {
    const selectionLockedAnnotation = this.mapStateToAnnotation(
      this.state.selection,
      "selection"
    );
    this.setState(
      {
        selectionLocked: true,
        selectionLockedAnnotation
      },
      () => {
        this.clearNativeSelection();
        this.props.lockSelection(selectionLockedAnnotation);
      }
    );
  }

  unlockSelection() {
    this.setState({ selectionLocked: false }, () => {
      this.props.lockSelection(null);
    });
  }

  startNotationSelection = eventIgnored => {
    this.setState({ drawerContents: "notations" });
    this.lockSelection();
  };

  startShare = (eventIgnored, type) => {
    this.setState({ drawerContents: "share", shareType: type });
    this.lockSelection();
  };

  startBookmark(eventIgnored) {
    // TOD: Implement bookmarks
  }

  closeDrawer = event => {
    this.setState({ drawerContents: null });
    // Keyboard event doesn't hide the popup by default,
    // so manually remove the selection
    if (event && event.type === "keyup") {
      this.setState({ selection: null });
    }
    this.unlockSelection();
  };

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

  doesElementContainAnnotationAndHighlight(el) {
    return (
      this.doesElementContainRemovableHighlight(el) &&
      this.doesElementContainAnnotation(el)
    );
  }

  elementAnnotationIds(el, type = "textAnnotationIds") {
    if (!el) return null;
    const ids = el.dataset[type];
    return ids.split(",");
  }

  handleAnnotationClick(event, el) {
    this.showAnnotationsInDrawer(this.elementAnnotationIds(el));
  }

  handleRemovableHighlightClick(event, el) {
    const id = el.dataset.removableHighlightId;
    this.selectAnnotation(event, id);
  }

  handleDisambiguationClick(eventIgnored, el) {
    this.setState({
      showAnnotationsInDrawer: event => {
        this.clearNativeSelection();
        this.handleAnnotationClick(event, el);
      }
    });
  }

  showAnnotationsInDrawer(textAnnotations) {
    const drawerContents = "annotations";
    this.setState({ drawerContents, textAnnotations });
  }

  handleAnnotatableClick = event => {
    if (!event || !event.target) return;
    const el = event.target;
    if (this.doesElementContainAnnotationAndHighlight(el))
      this.handleDisambiguationClick(event, el);
    if (this.doesElementContainRemovableHighlight(el))
      return this.handleRemovableHighlightClick(event, el);
    if (this.doesElementContainAnnotation(el))
      return this.handleAnnotationClick(event, el);
  };

  /* eslint-disable no-unreachable */
  drawerProps() {
    const base = { open: false, closeCallback: this.closeDrawer };
    let options;
    switch (this.state.drawerContents) {
      case "notations":
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
      case "share":
        options = {
          open: true,
          lockScroll: "always",
          style: "frontend",
          icon: "nodes",
          title: "Share"
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
      case "notations":
        return this.renderDrawerNotations(); // eslint-disable no-unreachable
        break;
      case "annotate":
        return this.renderDrawerAnnotate(); // eslint-disable no-unreachable
        break;
      case "annotations":
        return this.renderDrawerAnnotations(); // eslint-disable no-unreachable
        break;
      case "share":
        return this.renderDrawerShare(); // eslint-disable no-unreachable
        break;
      default:
        return null;
        break;
    }
  }
  /* eslint-enable no-unreachable */

  renderDrawerNotations() {
    return (
      <Notation.Picker
        projectId={this.props.projectId}
        selectionHandler={this.attachNotationToSelection}
      />
    );
  }

  renderDrawerAnnotate() {
    const {
      subject,
      startNode,
      startChar,
      endNode,
      endChar
    } = this.state.selectionLockedAnnotation;
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
        annotationIds={this.state.textAnnotations}
        createHandler={this.createAnnotation}
      />
    );
  }

  renderDrawerShare() {
    const {
      subject,
      startNode,
      startChar,
      endNode,
      endChar
    } = this.state.selectionLockedAnnotation;
    const type = this.state.shareType || null;
    return (
      <Annotation.Share.Wrapper
        closeDrawer={this.closeDrawer}
        subject={subject}
        startNode={startNode}
        startChar={startChar}
        endNode={endNode}
        endChar={endChar}
        truncate={600}
        shareType={type}
        text={this.props.text}
        section={this.props.section}
        annotating
      />
    );
  }

  render() {
    const showLogin = bindActionCreators(
      () => uiVisibilityActions.visibilityToggle("signInUpOverlay"),
      this.props.dispatch
    );

    // We include a tabIndex on this div so that it correctly captures the handleKeyDown
    // event, which is needed for key-based selection. Without it, the handleKeyDown event
    // will not work. We realize this present a slight accessibility issue, but until we
    // find a work-around, we're stuck with it. The following line disables the lint
    // warning around this tabindex.
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    return (
      <div
        className="no-focus-outline"
        onMouseDown={this.startSelection}
        onMouseUp={this.asyncUpdateSelection}
        onKeyDown={this.handleKeyDown}
        tabIndex="0"
      >
        {/* Children must precede the notation viewer, because the annotatable ref needs to
        be rendered prior to the notation viewer calculating where to put things. */}
        <div
          className="annotatable"
          ref={a => {
            this.annotatable = a;
          }}
          onClick={this.handleAnnotatableClick}
        >
          {this.props.children ? Children.only(this.props.children) : null}
        </div>

        {/* The drawer contains notations, annotator, comments, etc */}
        <Drawer.Wrapper {...this.drawerProps()}>
          {this.renderDrawerContents()}
        </Drawer.Wrapper>

        {/* Render the annotation popup interface */}
        <Annotation.Popup.Wrapper
          currentUser={this.props.currentUser}
          shareUrl={lh.link(
            "readerSection",
            this.props.textId,
            this.props.sectionId
          )}
          selectedAnnotation={this.state.selectedAnnotation}
          showAnnotationsInDrawer={this.state.showAnnotationsInDrawer}
          highlight={this.highlightSelection}
          destroySelected={this.destroySelected}
          annotate={this.startAnnotateSelection}
          bookmark={this.startBookmark}
          attachNotation={this.startNotationSelection}
          cite={event => this.startShare(event, "citation")}
          selection={this.state.selection}
          selectionClickEvent={this.state.selectionClickEvent}
          selectionLocked={this.state.selectionLocked}
          annotatableDomElement={this.annotatable}
          showLogin={showLogin}
          text={this.props.text}
          section={this.props.section}
        />

        {/* Render the margin notations */}
        {this.props.notations
          ? <NotationComponents.Viewer.List
              sectionId={this.props.sectionId}
              textId={this.props.textId}
              notations={this.props.notations}
              annotations={this.props.annotations}
              containerSize={this.props.containerSize}
              bodySelector={this.props.bodySelector}
            />
          : null}
      </div>
    );
    /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
  }
}

export { Annotatable as AnnotatableContainer }; // unconnected for testing
export default connect(Annotatable.mapStateToProps)(Annotatable);

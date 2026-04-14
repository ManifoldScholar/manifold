import React, { Component } from "react";
import PropTypes from "prop-types";
import { SignInUpOverlayContext } from "components/global/sign-in-up/Overlay/context";
import AnnotatableDebug from "./handlers/Debug";
import AnnotatableDrawer from "./Drawer";
import { DisplaySelectModal } from "./Drawer/types";
import AnnotatablePopup from "./Popup";
import CaptureSelection from "./handlers/CaptureSelection";
import CaptureClick from "./handlers/CaptureClick";
import selectionHelpers from "./helpers/selectionHelpers";
import locationHelper from "helpers/location";
import isEqual from "lodash/isEqual";

export class Annotatable extends Component {
  static contextType = SignInUpOverlayContext;

  static propTypes = {
    currentAnnotatingReadingGroup: PropTypes.string,
    debug: PropTypes.bool.isRequired,
    text: PropTypes.object.isRequired,
    textId: PropTypes.string.isRequired,
    section: PropTypes.object.isRequired,
    sectionId: PropTypes.string.isRequired,
    createAnnotationApi: PropTypes.func.isRequired,
    destroyAnnotationApi: PropTypes.func.isRequired,
    revalidate: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    annotations: PropTypes.array,
    resourceDisplayFormatDialog: PropTypes.object
  };

  static defaultProps = {
    debug: false
  };

  constructor(props) {
    super(props);

    this.state = this.initialState;
  }

  componentDidMount() {
    this.setState({ renderedAnnotations: this.props.annotations });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.annotations, prevProps.annotations)) {
      const lastAnnotation = this.state.renderedAnnotations[
        this.state.renderedAnnotations.length - 1
      ];
      // if the user just removed a highlight, make sure we don't overwrite it
      const wasRemoved = lastAnnotation?.attributes.removed;
      if (wasRemoved) {
        // call setTimeout with no delay to force focus to happen after all state updates
        setTimeout(() =>
          this.restoreFocusAndSelection({
            restoreFocusTo: "selection",
            restoreSelectionTo: "selection"
          })
        );
        return this.setState({
          renderedAnnotations: [...this.props.annotations, lastAnnotation]
        });
      }
      return this.setState({ renderedAnnotations: this.props.annotations });
    }

    const { selection } = this.state.selectionState ?? {};
    const { range, ...selectionData } = selection ?? {};
    const { selection: prevSelection } = prevState.selectionState ?? {};
    const { range: prevRange, ...prevSelectionData } = prevSelection ?? {};

    if (!isEqual(selectionData, prevSelectionData)) {
      /**
       * In order to restore cursor position when selection is lost,
       * we need to wrap a pending text selection in an HTML element.
       * So we create a *fake* annotation and append it to the list of
       * rendered annotations. On each new selection, this one is replaced by
       * the latest selection. When selection is lost, that appended element
       * is restyled (but kept in the DOM so we can set the cursor position there).
       */
      if (this.state?.selectionState.selectionComplete) {
        const selectionAnnotation = this.createAnnotationFromSelection(
          this.state.selectionState.selectionAnnotation
        );
        return this.appendLastSelectionAnnotation(selectionAnnotation);
      }
      return this.reviseLastSelectionAnnotation();
    }
  }

  get initialState() {
    return {
      selectionState: {
        selection: null,
        selectionComplete: false,
        selectionAnnotation: null,
        popupTriggerX: null,
        popupTriggerY: null
      },
      activeEvent: null,
      annotation: null, // the ID of the active annotation
      annotationState: null, // null, pending, active
      drawerState: null, // a key indicating visible drawer content
      drawerProps: {}, // props to be passed to the drawer when it opens
      renderedAnnotations: this.state?.renderedAnnotations ?? []
    };
  }

  get debuggable() {
    return this.props.debug;
  }

  get actions() {
    if (this.cachedActions) return this.cachedActions;
    const actions = [
      "openNewResourceAnnotationDrawer",
      "destroyAnnotation",
      "createHighlight",
      "createAnnotation",
      "openNewAnnotationDrawer",
      "openCitationDrawer",
      "openViewAnnotationsDrawer",
      "showLogin",
      "closeDrawer",
      "focusHandler",
      "openResourceAnnotationFormatModal"
    ];
    /* eslint-disable no-param-reassign */
    this.cachedActions = actions.reduce((map, action) => {
      map[action] = this[action];
      return map;
    }, {});
    /* eslint-enable no-param-reassign */
    return this.cachedActions;
  }

  get activeAnnotationObject() {
    if (!this.props.annotations) return null;
    const compareId = Array.isArray(this.state.annotation)
      ? this.state.annotation[0]
      : this.state.annotation;
    return this.props.annotations.find(a => a.id === compareId);
  }

  get pendingAnnotationNode() {
    return [
      ...document.querySelectorAll("[data-annotation-ids*='selection']")
    ].pop();
  }

  setAnnotatableRef = el => {
    this.annotatableRef = el;
  };

  setPopupRef = el => {
    this.popupRef = el;
  };

  setSelectableRef = el => {
    this.selectableRef = el;
  };

  setSelectionState = selectionState => {
    const { annotationState } = this.state;
    const emptySelection = !selectionState.selection;

    if (annotationState === "locked") return; // locked is a no-opp.

    // If the selection is empty, and it's not locked, we always reset.
    if (emptySelection && annotationState !== "locked")
      return this.resetState({
        restoreFocusTo: null,
        restoreSelectionTo: null
      });

    // If we have an active annotation state, maintain the state.
    if (
      !emptySelection &&
      selectionHelpers.selectionMatchesAnnotation(
        selectionState,
        this.activeAnnotationObject
      )
    )
      return this.setState({
        selectionState,
        annotationState: "active"
      });

    // If no guards catch it, we update the state.
    return this.setState({
      selectionState,
      annotation: null,
      annotationState: "pending"
    });
  };

  setActiveAnnotation = (annotationId, event = null, eventInfo = {}) => {
    this.setState({
      activeEvent: {
        type: event.type,
        clientX: event.clientX,
        clientY: event.clientY,
        ...eventInfo
      },
      annotation: annotationId,
      annotationState: "active"
    });
  };

  openNewAnnotationDrawer = (event = null) => {
    if (event) event.stopPropagation();
    this.setState({
      drawerProps: {
        pendingAnnotation: this.state.selectionState.selectionAnnotation
      }
    });
    this.openDrawer("newAnnotation");
  };

  openCitationDrawer = () => {
    this.setState({
      drawerProps: {
        annotation: this.state.selectionState.selectionAnnotation,
        section: this.props.section
      }
    });
    this.openDrawer("citation");
  };

  createHighlight = () => {
    const { currentAnnotatingReadingGroup } = this.props;
    const attributes = {
      ...this.state.selectionState.selectionAnnotation,
      format: "highlight",
      private: currentAnnotatingReadingGroup === "private",
      readingGroupId:
        currentAnnotatingReadingGroup !== "private" &&
        currentAnnotatingReadingGroup !== "public"
          ? currentAnnotatingReadingGroup
          : null
    };
    this.createAnnotation({ attributes });
  };

  createAnnotation = ({ attributes }, options = {}) => {
    const promise = this.props.createAnnotationApi(
      this.props.sectionId,
      attributes,
      options.notation || null
    );
    promise.then(response => {
      this.props.revalidate();
      this.setState(this.initialState, () => {
        setTimeout(() => {
          // delay till after closeDrawer() runs
          this.restoreFocusAndSelection({
            restoreFocusTo: response.data?.id,
            restoreSelectionTo: response.data?.id
          });
        });
      });
    });
    return promise;
  };

  /* Currently, this callback is used only for removing highlights.
     Annotations are deleted using a call in the global component that
     does not attempt to restore focus. In order to restore focus after
     delete, we create a *fake* here on success and reset selection and
     annotation state. We can't call this.resetState here because we
     don't want to overwrite this.state.renderedAnnotations once we push
     the fake. Then we call focus on the new node in componentDidUpdate
     to ensure that it happens after state updates there.
  */
  destroyAnnotation = (annotation, onSuccess) => {
    if (!annotation) return;
    const fullAnnotation = this.state.renderedAnnotations.find(
      a => a.id === annotation.id
    );
    const promise = this.props.destroyAnnotationApi(annotation.id);
    promise.then(() => {
      this.props.revalidate();
      if (onSuccess) onSuccess();
      // recreate destroyed node and append to renderedAnnotations
      const selectionAnnotation = this.createAnnotationFromSelection(
        this.selectionAnnotationFromAnnotation(fullAnnotation),
        "previous",
        true
      );
      this.appendLastSelectionAnnotation(selectionAnnotation);
      // clear selection state to hide the popup
      this.setState({
        selectionState: {
          selection: null,
          selectionComplete: false,
          selectionAnnotation: null,
          popupTriggerX: null,
          popupTriggerY: null
        },
        activeEvent: null,
        annotation: null,
        annotationState: null
      });
    });
    return promise;
  };

  openNewResourceAnnotationDrawer = displayFormat => {
    this.setState({
      drawerProps: {
        pendingAnnotation: this.state.selectionState.selectionAnnotation,
        readerDisplayFormat: displayFormat,
        projectId: this.props.projectId
      }
    });
    this.openDrawer("newResourceAnnotation");
  };

  openResourceAnnotationFormatModal = (event = null) => {
    if (event) event.preventDefault();

    this.setState({
      annotationState: "locked",
      drawerState: null
    });

    this.props.resourceDisplayFormatDialog.onToggleClick();
  };

  openViewAnnotationsDrawer = (ids, event = null) => {
    this.setState({
      annotation: ids[0],
      annotationState: "locked",
      drawerProps: {
        annotationIds: ids,
        sectionId: this.props.sectionId,
        textId: this.props.textId
      }
    });
    this.openDrawer("viewAnnotations", event, false);
  };

  showLogin = () => {
    if (this.context) this.context.toggle();
  };

  maybeRemoveAnnotationHashFromUrl() {
    if (!locationHelper.hashTypeMatch(this.props.location, "annotation"))
      return;
    this.props.navigate({ hash: "" }, { state: { noScroll: true } });
  }

  openDrawer = (drawerState, event = null, lock = true) => {
    if (event) event.preventDefault();
    if (lock) this.setState({ annotationState: "locked" });
    this.setState({ drawerState });
  };

  closeDrawer = () => {
    this.maybeRemoveAnnotationHashFromUrl();
    this.resetState({
      restoreFocusTo: this.selectableRef,
      restoreSelectionTo: this.pendingAnnotationNode
    });
  };

  createAnnotationFromSelection = (selection, style, removed) => {
    return {
      id: "selection",
      attributes: {
        userIsCreator: true,
        annotationStyle: "pending",
        format: style ?? "highlight",
        removed,
        ...selection
      }
    };
  };

  selectionAnnotationFromAnnotation = annotation => {
    if (!annotation) return null;
    const {
      endChar,
      endNode,
      startChar,
      startNode,
      subject
    } = annotation.attributes;
    return {
      endChar,
      endNode,
      startChar,
      startNode,
      subject
    };
  };

  appendLastSelectionAnnotation = annotation => {
    const newArray = [...this.state.renderedAnnotations];
    const lastAnnotation = newArray[newArray.length - 1];
    const isSelection = lastAnnotation?.id === "selection";

    // if last annotation was fake (aka a selection), replace it
    if (isSelection) {
      newArray.pop();
    }

    this.setState({
      renderedAnnotations: [...newArray, annotation]
    });
  };

  // when selected text is released, revise the style of last selection
  reviseLastSelectionAnnotation = () => {
    const { renderedAnnotations } = this.state;
    const lastAnnotation = renderedAnnotations[renderedAnnotations.length - 1];
    const isSelection = lastAnnotation?.id === "selection";

    // if last annotation wasn't fake, don't revise it
    if (!isSelection) return;

    const revisedAnnotation = {
      ...lastAnnotation,
      // id: "previous",
      attributes: {
        ...lastAnnotation.attributes,
        format: "previous",
        annotationStyle: null
      }
    };

    this.appendLastSelectionAnnotation(revisedAnnotation);
  };

  focusHandler = annotation => {
    if (!annotation) return;

    const refEl = document.querySelector(
      `[data-text-annotation-ids="${annotation.id}"]`
    );
    if (refEl) this.setSelectableRef(refEl);
    this.closeDrawer();
  };

  restoreFocusAndSelection = ({
    restoreFocusTo = this.selectableRef,
    restoreSelectionTo
  }) => {
    if (!restoreFocusTo && !restoreSelectionTo) return;

    let focusNode = restoreFocusTo;
    let selectionNode = restoreSelectionTo;

    try {
      const getNodeForId = id =>
        document.querySelector(`[data-annotation-ids*="${id}"]`);

      // optionally restore selection and focus to node if ID is passed
      if (typeof focusNode === "string") {
        const node = getNodeForId(focusNode);
        if (node) {
          focusNode = node;
        }
      }
      if (typeof selectionNode === "string") {
        const node = getNodeForId(selectionNode);
        if (node) {
          selectionNode = node;
        }
      }

      // move focus to node or text section wrapper
      if (focusNode && focusNode instanceof Node) {
        focusNode.focus();
      }

      // not ideal, but iOS seems to select the whole text sometimes
      // when calling `setPosition()`, and managing selection when the primary
      // input mode is touch isn't necessary
      const touchIsPrimary = window.matchMedia(
        "(hover: none) and (pointer: coarse)"
      ).matches;
      if (selectionNode && selectionNode instanceof Node && !touchIsPrimary) {
        // move cursor to end of last selection node
        const selection = window.getSelection();
        selection.setPosition(selectionNode, 1);
      }
    } catch (error) {
      console.warn(error); // eslint-disable-line no-console
    }
  };

  resetState = focusAndSelectionNodes => {
    this.setState(this.initialState);
    setTimeout(() => {
      this.restoreFocusAndSelection(focusAndSelectionNodes);
    }, 1);
  };

  getAnnotationUrl = () => {
    if (!this.state.activeEvent?.annotationIds?.length) return undefined;

    const annotationId = this.state.activeEvent.annotationIds[0];
    return `/read/${this.props.textId}/section/${this.props.sectionId}#annotation-${annotationId}`;
  };

  render() {
    const { annotationState, selectionState, renderedAnnotations } = this.state;
    const pendingAnnotation =
      annotationState === "locked" ? selectionState.selectionAnnotation : null;

    return (
      <>
        {this.debuggable && (
          <AnnotatableDebug
            annotatableProps={this.props}
            annotatableState={this.state}
          />
        )}

        <CaptureSelection
          annotatableRef={this.annotatableRef}
          activeAnnotation={this.state.annotation}
          activeEvent={this.state.activeEvent}
          selectionState={selectionState}
          updateSelection={this.setSelectionState}
          popupRef={this.popupRef}
          setSelectableRef={this.setSelectableRef}
        >
          <CaptureClick
            activeAnnotation={this.state.annotation}
            updateActiveAnnotation={this.setActiveAnnotation}
            actions={this.actions}
          >
            <div
              id="annotatableRef"
              className="annotatable"
              ref={this.setAnnotatableRef}
            >
              {this.props.render(
                pendingAnnotation,
                renderedAnnotations,
                this.destroyAnnotation
              )}
            </div>
          </CaptureClick>
        </CaptureSelection>

        {selectionState.selectionComplete && (
          <AnnotatablePopup
            selectionState={selectionState}
            annotatableRef={this.annotatableRef}
            actions={this.actions}
            text={this.props.text}
            section={this.props.section}
            activeEvent={this.state.activeEvent}
            activeAnnotation={this.activeAnnotationObject}
            annotationState={annotationState}
            setPopupRef={this.setPopupRef}
            annotationHref={this.getAnnotationUrl()}
            clearSelection={() =>
              this.resetState({
                restoreFocusTo: this.selectableRef,
                restoreSelectionTo: this.pendingAnnotationNode
              })
            }
          />
        )}

        <AnnotatableDrawer
          drawerState={this.state.drawerState}
          actions={this.actions}
          close={this.closeDrawer}
          {...this.state.drawerProps}
        />
        <DisplaySelectModal
          dialog={this.props.resourceDisplayFormatDialog}
          onClose={() =>
            this.resetState({
              restoreFocusTo: this.selectableRef,
              restoreSelectionTo: this.pendingAnnotationNode
            })
          }
          handleNext={this.actions.openNewResourceAnnotationDrawer}
          pendingAnnotation={this.state.selectionState.selectionAnnotation}
        />
      </>
    );
  }
}

export default Annotatable;

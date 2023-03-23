import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { annotationsAPI, requests } from "api";
import { entityStoreActions, uiVisibilityActions } from "actions";
import AnnotatableDebug from "./annotatable-components/Debug";
import AnnotatableDrawer from "./annotatable-components/Drawer";
import AnnotatablePopup from "./annotatable-components/Popup/index";
import CaptureSelection from "./annotatable-components/CaptureSelection";
import CaptureClick from "./annotatable-components/CaptureClick";
import AnnotationNotationViewer from "./annotatable-components/NotationViewer";
import selectionHelpers from "./annotatable-components/selectionHelpers";
import locationHelper from "helpers/location";
import withReadingGroups from "hoc/withReadingGroups";
import isEqual from "lodash/isEqual";

const { request } = entityStoreActions;

export class Annotatable extends Component {
  static mapStateToProps() {
    return {};
  }

  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    currentAnnotatingReadingGroup: PropTypes.string,
    debug: PropTypes.bool.isRequired,
    text: PropTypes.object.isRequired,
    textId: PropTypes.string.isRequired,
    section: PropTypes.object.isRequired,
    sectionId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    containerSize: PropTypes.number.isRequired,
    bodySelector: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
    annotations: PropTypes.array,
    notations: PropTypes.array
  };

  static defaultProps = {
    debug: false
  };

  constructor(props) {
    super(props);

    this.state = this.initialState;

    this.lastSelectionRange = React.createRef();
  }

  componentDidMount() {
    this.setState({ renderedAnnotations: this.props.annotations });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.annotations.length !== prevProps.annotations.length)
      this.setState({ renderedAnnotations: this.props.annotations });

    const { selection } = this.state.selectionState ?? {};
    const { range, ...selectionData } = selection ?? {};
    const { selection: prevSelection } = prevState.selectionState ?? {};
    const { range: prevRange, ...prevSelectionData } = prevSelection ?? {};

    if (!isEqual(selectionData, prevSelectionData)) {
      if (this.state?.selectionState.selectionComplete) {
        const test = this.createAnnotationFromSelection(
          this.state.selectionState.selectionAnnotation
        );
        return this.appendSelectionAnnotation(test);
      }
      return this.removeSelectionAnnotation();
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
      "openNewNotationDrawer",
      "destroyAnnotation",
      "createHighlight",
      "createAnnotation",
      "openNewAnnotationDrawer",
      "openCitationDrawer",
      "openViewAnnotationsDrawer",
      "showLogin",
      "closeDrawer"
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
      return this.resetState(false);

    // If we have an active annotation state, maintain the state.
    if (
      !emptySelection &&
      selectionHelpers.selectionMatchesAnnotation(
        selectionState,
        this.activeAnnotationObject
      )
    )
      return this.setState({ selectionState, annotationState: "active" });

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
    const call = annotationsAPI.create(
      this.props.sectionId,
      attributes,
      options.notation || null
    );
    const requestOptions = {
      adds: requests.rAnnotations,
      clears: [
        requests.rMyAnnotationsForText,
        requests.rMyFilteredAnnotationsForText
      ]
    };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationCreate, requestOptions)
    );
    res.promise.then(() => {
      this.resetState();
    });
    return res.promise;
  };

  destroyAnnotation = annotation => {
    if (!annotation) return;
    const call = annotationsAPI.destroy(annotation.id);
    const options = { removes: annotation };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationDestroy, options)
    );
    res.promise.then(() => {
      this.resetState();
    });
    return res.promise;
  };

  openNewNotationDrawer = (event = null) => {
    this.setState({
      drawerProps: {
        pendingAnnotation: this.state.selectionState.selectionAnnotation,
        projectId: this.props.projectId
      }
    });
    this.openDrawer("newNotation", event);
  };

  openViewAnnotationsDrawer = (ids, event = null) => {
    this.setState({
      annotation: ids[0],
      annotationState: "locked",
      drawerProps: {
        annotationIds: ids,
        sectionId: this.props.sectionId
      }
    });
    this.openDrawer("viewAnnotations", event, false);
  };

  showLogin = () => {
    this.props.dispatch(
      uiVisibilityActions.visibilityToggle("signInUpOverlay")
    );
  };

  maybeRemoveAnnotationHashFromUrl() {
    if (!this.props.history) return;
    if (!locationHelper.hashTypeMatch(this.props.location, "annotation"))
      return;
    this.props.history.push({ hash: "", state: { noScroll: true } });
  }

  openDrawer = (drawerState, event = null, lock = true) => {
    if (event) event.preventDefault();
    if (lock) this.setState({ annotationState: "locked" });
    this.setState({ drawerState });
  };

  closeDrawer = () => {
    this.maybeRemoveAnnotationHashFromUrl();
    this.resetState();
  };

  resetState = (restoreSelection = true) => {
    this.setState(this.initialState);

    if (!restoreSelection) return;

    if (this.selectableRef) {
      this.selectableRef.focus();
    }

    const lastSelection = [
      ...document.querySelectorAll("[data-annotation-ids='selection']")
    ].pop();

    if (lastSelection) {
      const selection = window.getSelection();
      selection.setPosition(lastSelection, 1);
    }
  };

  createAnnotationFromSelection = selection => {
    return {
      id: "selection",
      attributes: {
        userIsCreator: true,
        annotationStyle: "pending",
        format: "highlight",
        ...selection
      }
    };
  };

  // replace last selection with latest
  appendSelectionAnnotation = annotation => {
    const newArray = [...this.state.renderedAnnotations];

    newArray.pop();

    this.setState({
      renderedAnnotations: [...newArray, annotation]
    });
  };

  removeSelectionAnnotation = () => {
    const { renderedAnnotations } = this.state;
    const latestAnnotation =
      renderedAnnotations[renderedAnnotations.length - 1];

    const revisedAnnotation = {
      ...latestAnnotation,
      attributes: {
        ...latestAnnotation.attributes,
        annotationStyle: "previous"
      }
    };

    this.appendSelectionAnnotation(revisedAnnotation);
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
              {this.props.render(pendingAnnotation, renderedAnnotations)}
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
            clearSelection={this.resetState}
          />
        )}

        <AnnotatableDrawer
          drawerState={this.state.drawerState}
          actions={this.actions}
          close={this.closeDrawer}
          {...this.state.drawerProps}
        />
        <AnnotationNotationViewer
          sectionId={this.props.sectionId}
          textId={this.props.textId}
          notations={this.props.notations}
          annotations={this.props.annotations}
          containerSize={this.props.containerSize}
          bodySelector={this.props.bodySelector}
        />
      </>
    );
  }
}

export default connect(Annotatable.mapStateToProps)(
  withReadingGroups(Annotatable)
);

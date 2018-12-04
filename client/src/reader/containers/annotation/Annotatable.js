import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { annotationsAPI, requests } from "api";
import { entityStoreActions, uiVisibilityActions } from "actions";
import AnnotatableDebug from "./annotatable-components/Debug";
import AnnotatableDrawer from "./annotatable-components/Drawer";
import AnnotatablePopup from "./annotatable-components/Popup";
import CaptureSelection from "./annotatable-components/CaptureSelection";
import CaptureClick from "./annotatable-components/CaptureClick";
import AnnotationNotationViewer from "./annotatable-components/NotationViewer";
import selectionHelpers from "./annotatable-components/selectionHelpers";
import locationHelper from "helpers/location";

const { request } = entityStoreActions;

export class Annotatable extends Component {
  static mapStateToProps() {
    return {};
  }

  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
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
      drawerProps: {} // props to be passed to the drawer when it opens
    };
  }

  get debuggable() {
    return this.props.debug;
  }

  get actions() {
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
    return actions.reduce((map, action) => {
      map[action] = this[action];
      return map;
    }, {});
    /* eslint-enable no-param-reassign */
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

  setSelectionState = selectionState => {
    const { annotationState } = this.state;
    const emptySelection = !selectionState.selection;

    if (annotationState === "locked") return; // locked is a no-opp.

    // If the selection is empty, and it's not locked, we always reset.
    if (emptySelection && annotationState !== "locked")
      return this.setState(this.initialState);

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
      activeEvent: Object.assign(
        {
          type: event.type,
          clientX: event.clientX,
          clientY: event.clientY
        },
        eventInfo
      ),
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
    const attributes = Object.assign(
      {},
      this.state.selectionState.selectionAnnotation,
      { format: "highlight" }
    );
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

  lockSelection() {
    this.setState({ annotationState: "locked" });
  }

  unlockSelection() {
    this.setState({ annotationState: "pending" });
  }

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
    if (lock) this.lockSelection();
    this.setState({ drawerState });
  };

  closeDrawer = () => {
    this.maybeRemoveAnnotationHashFromUrl();
    this.unlockSelection();
    this.resetState();
  };

  resetState = () => {
    this.setState(this.initialState);
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }
  };

  render() {
    return (
      <Fragment>
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
          selectionState={this.state.selectionState}
          updateSelection={this.setSelectionState}
        >
          <CaptureClick
            activeAnnotation={this.state.annotation}
            updateActiveAnnotation={this.setActiveAnnotation}
            onClick={this.handleClick}
            actions={this.actions}
          >
            <div
              id="annotatableRef"
              className="annotatable"
              ref={this.setAnnotatableRef}
            >
              {this.props.render(
                this.state.annotationState === "locked"
                  ? this.state.selectionState.selectionAnnotation
                  : null
              )}
            </div>
          </CaptureClick>
        </CaptureSelection>

        <AnnotatablePopup
          dispatch={this.props.dispatch}
          selectionState={this.state.selectionState}
          annotatableRef={this.annotatableRef}
          actions={this.actions}
          text={this.props.text}
          section={this.props.section}
          activeEvent={this.state.activeEvent}
          activeAnnotation={this.activeAnnotationObject}
          annotationState={this.state.annotationState}
        />
        <AnnotatableDrawer
          drawerState={this.state.drawerState}
          actions={this.actions}
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
      </Fragment>
    );
  }
}

export default connect(Annotatable.mapStateToProps)(Annotatable);

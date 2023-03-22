import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Fader from "./Fader";
import Group from "./Group";
import Single from "./Single";
import Preview from "./Preview";

import { connect } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { uiReaderActions, entityStoreActions } from "actions";
import { annotationsAPI, requests } from "api";
import { bindActionCreators } from "redux";
import throttle from "lodash/throttle";
import isNil from "lodash/isNil";
import { scrollOptions } from "utils/domUtils";
import withConfirmation from "hoc/withConfirmation";
import { withTranslation } from "react-i18next";

const { request } = entityStoreActions;

// The list is the out wrapper and is responsible for interacting with the store,
// managing the visibility and positioning of its entities, etc.
class NotationViewerList extends PureComponent {
  static mapStateToProps = (state, ownProps) => {
    const newState = {
      activeAnnotation: state.ui.transitory.reader.activeAnnotation || null,
      activeAnnotationPassive:
        state.ui.transitory.reader.activeAnnotationPassive
    };
    return { ...newState, ...ownProps };
  };

  static displayName = "NotationViewer.List";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    activeAnnotation: PropTypes.string,
    notations: PropTypes.array,
    annotations: PropTypes.array,
    bodySelector: PropTypes.string,
    containerSize: PropTypes.number,
    sectionId: PropTypes.string,
    textId: PropTypes.string,
    textSlug: PropTypes.string,
    confirm: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    const bac = bindActionCreators;
    const { dispatch } = props;
    this.actions = {
      makeActive: bac(uiReaderActions.setActiveAnnotation, dispatch),
      startDestroy: this.startDestroy
    };
    this.notationHeight = 110;
    this.groupHeight = 200;
    this.state = {
      markers: [],
      scrollY: 0,
      previewEntry: null
    };
  }

  componentDidMount() {
    this.updateEntries(this.props);
    this.height = this.bodyNodeHeight(this.props);
    window.addEventListener("scroll", this.updateScrollY, scrollOptions());

    this.timer = setInterval(() => {
      this.updateIfHeightChanged();
    }, 500);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.annotations !== this.props.annotations ||
      prevProps.notations !== this.props.notations
    ) {
      this.updateEntries(this.props);
    }
    if (prevProps.activeAnnotation !== this.props.activeAnnotation) {
      this.setPreviewEntry(this.props);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.updateScrollY);
    window.clearInterval(this.timer);
  }

  getNotationLocation(top) {
    if (top <= 120) return 120;
    return top - 10;
  }

  setPreviewEntry(props) {
    const aId = props.activeAnnotation;
    if (!aId) return this.clearPreviewAnnotation();
    const annotation = props.annotations.find(a => a.id === aId);
    const notation = this.notationForAnnotation(props, annotation);
    if (!notation || !annotation) return this.clearPreviewAnnotation();
    return this.setState({
      previewEntry: { annotation, notation, key: annotation.id }
    });
  }

  markerByAnnotationId(props, aId) {
    return [...this.markerNodes(props)].find(marker => {
      return marker.dataset.annotationNotation === aId;
    });
  }

  markerIsVisible(marker) {
    const top = marker.getBoundingClientRect().top;
    return top > 50 && top < window.innerHeight - 130;
  }

  annotationMarkerIsVisible(props, aId) {
    const annotationMarker = this.markerByAnnotationId(props, aId);
    if (!annotationMarker) return false;
    return this.markerIsVisible(annotationMarker);
  }

  activeAnnotationMarkerIsVisibleAndNotPasive(props) {
    if (!props.activeAnnotation) return false;
    if (props.activeAnnotationPassive === true) return false;
    return this.annotationMarkerIsVisible(props, props.activeAnnotation);
  }

  lastVisibleMarker(props) {
    return [...this.markerNodes(props)].reverse().find(this.markerIsVisible);
  }

  clearPreviewAnnotation() {
    this.setState({ previewEntry: null });
  }

  autoSetActive(props) {
    if (this.activeAnnotationMarkerIsVisibleAndNotPasive(props)) return;
    const makeActiveMarker = this.lastVisibleMarker(props);
    if (!makeActiveMarker && props.activeAnnotation)
      return this.actions.makeActive(null);
    if (!makeActiveMarker) return;
    const annotationId = makeActiveMarker.dataset.annotationNotation;
    if (annotationId !== props.activeAnnotation) {
      this.actions.makeActive({ annotationId, passive: true });
    }
  }

  listIsVisible = () => {
    // If the list element hasn't rendered yet, we'll assume that it's going to.
    if (!this.listEl) return true;
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    // offsetParent is null when the element has display: none.
    // There are other ways to check for this, but not as fast.
    return this.listEl.offsetParent !== null;
  };

  updateScrollY = throttle(eventIgnored => {
    const scrollY = window.pageYOffset;
    if (!this.listIsVisible()) this.autoSetActive(this.props);
    this.setState({ scrollY });
  }, 250);

  updateEntries(props) {
    const entries = this.groupOverlappingEntries(this.entries(props));
    this.setState({ entries });
  }

  bodyNodeHeight(props) {
    const body = this.bodyNode(props);
    if (!body) return;
    return body.offsetHeight;
  }

  bodyNode(props) {
    return document.querySelector(props.bodySelector);
  }

  markerNodes(props) {
    if (!this.bodyNode(props)) return [];
    const markerNodes = this.bodyNode(props).querySelectorAll(
      "[data-annotation-notation]"
    );
    return [...markerNodes];
  }

  entryFromMarkerNode(props, markerNode) {
    if (!markerNode) return null;
    const aId = markerNode.getAttribute("data-annotation-notation");
    const annotation = props.annotations.find(a => a.id === aId);
    const notation = this.notationForAnnotation(props, annotation);
    if (!notation || !annotation) return null;
    const top = markerNode.getBoundingClientRect().top + window.pageYOffset;
    const location = this.getNotationLocation(top);
    return { annotation, notation, location, key: annotation.id };
  }

  notationForAnnotation(props, annotation) {
    if (!annotation || !props.notations) return null;
    const nId =
      annotation.attributes.resourceId ||
      annotation.attributes.resourceCollectionId;
    return props.notations.find(n => n.id === nId);
  }

  updateIfHeightChanged() {
    const height = this.bodyNodeHeight(this.props);
    if (height === this.height) return;
    this.height = height;
    this.updateEntries(this.props);
  }

  doDestroy(entry) {
    const { annotation } = entry;
    const { type, id } = annotation;
    const call = annotationsAPI.destroy(id);
    const options = { removes: { type, id } };
    const destroyRequest = request(
      call,
      requests.feResourceAnnotationDestroy,
      options
    );
    this.props.dispatch(destroyRequest);
  }

  startDestroy = entry => {
    const t = this.props.t;
    const heading = t("modals.delete_note");
    const message = t("modals.delete_note_body");
    this.props.confirm(heading, message, () => this.doDestroy(entry));
  };

  entries(props) {
    return this.markerNodes(props)
      .map(markerNode => {
        const entry = this.entryFromMarkerNode(props, markerNode);
        return entry;
      })
      .filter(e => e); // filter empty entries in collection.
  }

  groupOverlappingEntries(entries, index = 0) {
    if (index >= entries.length - 1) return entries;
    const current = entries[index];
    const next = entries[index + 1];
    if (current.location + this.groupHeight >= next.location) {
      // Make/add a group, start back at 0
      if (current.group) {
        // Existing group adds a new item
        current.entries.push(next);
        // And remove it from the array
        entries.splice(index + 1, 1);
      } else {
        // Make a new group
        const group = {
          group: true,
          key: `group-${index}`,
          location: current.location,
          height: this.groupHeight,
          entries: [current, next]
        };
        entries.splice(index, 2, group);
      }
      // Run through the array with new group arrangement
      return this.groupOverlappingEntries(entries, 0);
    }
    return this.groupOverlappingEntries(entries, index + 1);
  }

  renderGroup(group) {
    const { activeAnnotation, textId, sectionId, textSlug } = this.props;
    const wrapperStyle = {
      top: group.location,
      height: group.height
    };

    return (
      <div style={wrapperStyle} className="notation-wrapper">
        <Fader scrollY={this.state.scrollY}>
          <Group
            group={group}
            params={{ textId, sectionId, textSlug }}
            actions={this.actions}
            activeAnnotation={activeAnnotation}
            singleHeight={this.notationHeight}
          />
        </Fader>
      </div>
    );
  }

  renderSingle(entry) {
    const { activeAnnotation, textId, sectionId, textSlug } = this.props;
    const wrapperStyle = { top: entry.location + "px" };

    return (
      <div style={wrapperStyle} className="notation-wrapper">
        <Fader scrollY={this.state.scrollY}>
          <Single
            entry={entry}
            params={{ textId, sectionId, textSlug }}
            actions={this.actions}
            active={activeAnnotation === entry.annotation.id}
          />
        </Fader>
      </div>
    );
  }

  render() {
    if (!this.state.entries || this.state.entries.length < 1) return null;

    const { textId, sectionId, textSlug } = this.props;
    const viewerClass = `notation-viewer container-width-${this.props.containerSize}`;
    return (
      <nav
        className={viewerClass}
        aria-label={this.props.t("glossary.notation_title_case_other")}
      >
        <ul className="viewer-list" ref={el => (this.listEl = el)}>
          {this.state.entries.map(entry => {
            return (
              <li key={entry.key}>
                {entry.group
                  ? this.renderGroup(entry)
                  : this.renderSingle(entry)}
              </li>
            );
          })}
        </ul>
        <CSSTransition
          in={!isNil(this.state.previewEntry)}
          classNames="notation"
          timeout={{ enter: 300, exit: 300 }}
          unmountOnExit
        >
          <Preview
            entry={this.state.previewEntry}
            actions={this.actions}
            params={{ textId, sectionId, textSlug }}
          />
        </CSSTransition>
      </nav>
    );
  }
}

export default withTranslation()(
  withConfirmation(
    connect(NotationViewerList.mapStateToProps)(NotationViewerList)
  )
);

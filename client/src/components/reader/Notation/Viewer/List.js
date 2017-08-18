import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Notation } from "components/reader";
import { connect } from "react-redux";
import { uiReaderActions, entityStoreActions } from "actions";
import { annotationsAPI, requests } from "api";
import { bindActionCreators } from "redux";
import { Dialog } from "components/backend";
import config from "../../../../config";
import throttle from "lodash/throttle";
import { scrollOptions } from "utils/domUtils";

const { request } = entityStoreActions;

// The list is the out wrapper and is responsible for interacting with the store,
// managing the visibility and positioning of its entities, etc.
class NotationViewerList extends PureComponent {
  static displayName = "NotationViewer.List";

  static mapStateToProps = (state, ownProps) => {
    const newState = {
      activeAnnotation: state.ui.reader.activeAnnotation || null
    };
    return Object.assign({}, newState, ownProps);
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    activeAnnotation: PropTypes.string,
    notations: PropTypes.array,
    annotations: PropTypes.array,
    bodySelector: PropTypes.string,
    containerSize: PropTypes.number,
    sectionId: PropTypes.string,
    textId: PropTypes.string
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
      confirmation: null
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

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.annotations !== this.props.annotations ||
      nextProps.notations !== this.props.notations
    ) {
      this.updateEntries(nextProps);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.updateScrollY);
    window.clearInterval(this.timer);
  }

  getNotationLocation(top) {
    if (top <= 120) return 0;
    return top - 10;
  }

  updateScrollY = throttle(eventIgnored => {
    const { scrollY } = window;
    this.setState({ scrollY });
  }, 250);

  updateEntries(props) {
    const entries = this.groupOverlappingEntries(this.entries(props));
    this.setState({ entries });
  }

  bodyNodeHeight(props) {
    const body = this.bodyNode(props);
    return body.offsetHeight;
  }

  bodyNode(props) {
    return document.querySelector(props.bodySelector);
  }

  markerNodes(props) {
    const markerNodes = this.bodyNode(props).querySelectorAll(
      "[data-annotation-notation]"
    );
    return [...markerNodes];
  }

  entryFromMarkerNode(props, markerNode) {
    const aId = markerNode.getAttribute("data-annotation-notation");
    const annotation = props.annotations.find(a => a.id === aId);
    const notation = this.notationForAnnotation(props, annotation);
    if (!notation || !annotation) return null;
    const top =
      markerNode.getBoundingClientRect().top + document.body.scrollTop;
    const location = this.getNotationLocation(top);
    return { annotation, notation, location, key: annotation.id };
  }

  notationForAnnotation(props, annotation) {
    if (!annotation) return null;
    const nId =
      annotation.attributes.resourceId || annotation.attributes.collectionId;
    return props.notations.find(n => n.id === nId);
  }

  updateIfHeightChanged() {
    const height = this.bodyNodeHeight(this.props);
    if (height === this.height) return;
    this.height = height;
    this.updateEntries(this.props);
  }

  closeDialog() {
    this.setState({ confirmation: null });
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
    const { heading, message } = config.app.locale.dialogs.notation.destroy;
    new Promise((resolve, reject) => {
      this.setState({ confirmation: { resolve, reject, heading, message } });
    }).then(
      () => {
        this.doDestroy(entry);
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
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
    const { activeAnnotation, textId, sectionId } = this.props;
    const wrapperStyle = {
      top: group.location,
      height: group.height
    };
    return (
      <div style={wrapperStyle} className="notation-wrapper">
        <Notation.Viewer.Fader scrollY={this.state.scrollY}>
          <Notation.Viewer.Group
            group={group}
            params={{ textId, sectionId }}
            actions={this.actions}
            activeAnnotation={activeAnnotation}
            singleHeight={this.notationHeight}
          />
        </Notation.Viewer.Fader>
      </div>
    );
  }

  renderSingle(entry) {
    const { activeAnnotation, textId, sectionId } = this.props;
    const wrapperStyle = { top: entry.location + "px" };
    return (
      <div style={wrapperStyle} className="notation-wrapper">
        <Notation.Viewer.Fader scrollY={this.state.scrollY}>
          <Notation.Viewer.Single
            entry={entry}
            params={{ textId, sectionId }}
            actions={this.actions}
            active={activeAnnotation === entry.annotation.id}
          />
        </Notation.Viewer.Fader>
      </div>
    );
  }

  render() {
    if (!this.state.entries) return null;
    const viewerClass = `notation-viewer container-width-${this.props
      .containerSize}`;

    return (
      <nav className={viewerClass}>
        {this.state.confirmation
          ? <Dialog.Confirm {...this.state.confirmation} />
          : null}
        <ul className="viewer-list">
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
      </nav>
    );
  }
}

export default connect(NotationViewerList.mapStateToProps)(NotationViewerList);

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import classNames from "classnames";
import throttle from "lodash/throttle";
import Single from "./Single";
import GroupThumbnail from "./GroupThumbnail";
import { connect } from "react-redux";
import { uiReaderActions } from "actions";
import lh from "helpers/linkHandler";

export class ResourceViewerGroup extends PureComponent {
  static displayName = "ResourceViewer.Group";

  static propTypes = {
    items: PropTypes.array,
    activeAnnotation: PropTypes.string,
    location: PropTypes.number,
    height: PropTypes.number,
    singleHeight: PropTypes.number,
    fadeIn: PropTypes.bool,
    textId: PropTypes.string,
    sectionId: PropTypes.string,
    dispatch: PropTypes.func
  };

  static mapStateToProps(state, ownProps) {
    const newState = {
      activeAnnotation: state.ui.reader.activeAnnotation
    };
    return Object.assign({}, newState, ownProps);
  }

  static defaultProps = {
    location: 0,
    fadeIn: true
  };

  constructor() {
    super();
    this.state = {
      visible: true,
      groupActiveAnnotationId: null
    };

    this.handleFade = this.handleFade.bind(this);
    this.setGroupActive = this.setGroupActive.bind(this);
    this.throttledFade = throttle(this.handleFade, 200).bind(this);
  }

  componentDidMount() {
    if (this.props.fadeIn) {
      this.handleFade();
      window.addEventListener("scroll", this.throttledFade);
    }
  }

  componentWillUnmount() {
    if (this.props.fadeIn) {
      window.removeEventListener("scroll", this.throttledFade);
    }
  }

  setGroupActive(annotationId) {
    this.setState({
      groupActiveAnnotationId: annotationId
    });
  }

  setActiveAnnotation(annotationId) {
    this.props.dispatch(uiReaderActions.setActiveAnnotation(annotationId));
  }

  getHighlightedItem() {
    const propsActive = this.props.activeAnnotation;
    const stateActive = this.state.groupActiveAnnotationId;
    if (!propsActive && !stateActive) {
      return this.props.items[0];
    }

    if (this.matchHighlightItemById(propsActive))
      return this.matchHighlightItemById(propsActive);
    if (this.matchHighlightItemById(stateActive))
      return this.matchHighlightItemById(stateActive);
    return this.props.items[0];
  }

  matchHighlightItemById(id) {
    // Match highlighted items based on props activeAnnotation
    const highlighted = this.props.items.filter(item => {
      return id === item.annotationId;
    });

    // If there are any results, return them
    // otherwise return null
    if (highlighted.length > 0) return highlighted[0];

    return null;
  }

  handleFade(eventIgnored) {
    const rect = this.group.getBoundingClientRect();
    this.setState({
      visible: rect.top > 120 && rect.top + rect.height / 2 < window.innerHeight
    });
  }

  render() {
    const { textId, sectionId } = this.props;
    const highlightedItem = this.getHighlightedItem();
    const groupClass = classNames({
      "resource-preview-group": true,
      "transition-out": this.props.fadeIn && !this.state.visible,
      "transition-in": this.props.fadeIn && this.state.visible
    });

    const thumbnailsClass = classNames({
      "group-thumbnails": true,
      overflow: this.props.items.length > 8
    });

    return (
      <div
        className={groupClass}
        style={{
          top: this.props.location + "px",
          height: this.props.height + "px"
        }}
        ref={r => {
          this.group = r;
        }}
      >
        <div
          className="group-highlighted-resource-wrapper"
          style={{ height: this.props.singleHeight + "px" }}
        >
          <ReactCSSTransitionGroup
            transitionName="highlight"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
          >
            <Single
              annotationId={highlightedItem.annotationId}
              resource={highlightedItem.resource}
              height={this.props.singleHeight}
              fadeIn={false}
              link={lh.link(
                "readerSectionResource",
                textId,
                sectionId,
                highlightedItem.resource.id
              )}
              key={highlightedItem.resource.id}
            />
          </ReactCSSTransitionGroup>
        </div>

        <ul className={thumbnailsClass}>
          {this.props.items.map(item => {
            return (
              <li key={item.resource.id}>
                <Link
                  onMouseOver={() => {
                    this.setActiveAnnotation(item.annotationId);
                    this.setGroupActive(item.annotationId);
                  }}
                  onMouseLeave={() => {
                    this.setActiveAnnotation(null);
                  }}
                  to={lh.link(
                    "readerSectionResource",
                    textId,
                    sectionId,
                    item.resource.id
                  )}
                  title={item.resource.id}
                >
                  <GroupThumbnail
                    resource={item.resource}
                    active={item.annotationId === this.props.activeAnnotation}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default connect(ResourceViewerGroup.mapStateToProps)(
  ResourceViewerGroup
);

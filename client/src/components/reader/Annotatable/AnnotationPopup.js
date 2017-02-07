import React, { Component, PropTypes } from 'react';
import { throttle } from 'lodash';
import classNames from 'classnames';
import get from 'lodash/get';
import { closest } from 'utils/domUtils';

export default class AnnotationPopup extends Component {

  static propTypes = {
    selection: PropTypes.object,
    selectionLocked: PropTypes.bool,
    share: PropTypes.func,
    highlight: PropTypes.func,
    annotate: PropTypes.func,
    attachResource: PropTypes.func,
    bookmark: PropTypes.func,
    selectionClickEvent: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      visible: false,
      top: 0,
      left: 0,
      direction: 'up'
    };
  }

  componentDidMount() {
    window.addEventListener('resize', throttle(() => {
      this.positionPopup(this.props.selection);
    }, 400));
  }

  componentWillReceiveProps(nextProps) {
    this.maybeShowPopup(this.props, nextProps);
  }

  getLockedSelectionRect() {
    return document.querySelector('.annotation-locked-selected').getBoundingClientRect();
  }

  maybeShowPopup(prevProps, nextProps) {
    if (nextProps && prevProps !== nextProps) {
      // Locked?
      if (nextProps.selectionLocked) {
        return;
      }
      // Update popup
      if (!nextProps.selection) {
        // Hide the popup if there is no "Range"
        this.setState({ visible: false });
      } else {
        // Calculate the position for the popup
        this.positionPopup(nextProps.selection, nextProps.selectionClickEvent);

        // Otherwise show the popup and set it's (new) position
        this.setState({ visible: true });
      }
    }
  }

  hasSelection(selection) {
    if (!selection) return false;
    if (selection && selection.range) {
      return true;
    }
  }

  positionPopup(selection, selectionClickEvent = null) {
    let rect;
    // If it's locked, we no longer want to position relative to the actual selection,
    // since the text nodes in it likely no long exist.
    if (this.props.selectionLocked) {
      rect = this.getLockedSelectionRect();
    } else if (this.hasSelection(selection)) {
      rect = selection.range.getBoundingClientRect();
    } else {
      return;
    }
    const rectCenter = rect.width / 2;
    const popupHeight = this.popupEl.offsetHeight;
    const popupWidth = this.popupEl.offsetWidth;
    const halfPopupWidth = popupWidth / 2;
    const clientX = get(selectionClickEvent, 'clientX');
    const clientY = get(selectionClickEvent, 'clientY');
    const up = 'up';
    const down = 'down';
    // not ideal to grab this by class, but not sure how else to handle it
    const annotatable = closest(this.popupEl, '.annotatable');
    const annotatableRect = annotatable.getBoundingClientRect();
    const topVisiblePosition = document.body.scrollTop + 100;
    const bottomVisiblePosition = topVisiblePosition + window.innerHeight;
    const popupTopEdgeIfUp = window.scrollY + rect.top - popupHeight;
    const popupBottomEdgeIfDown = window.scrollY + rect.bottom + popupHeight;
    const topCollisionPossible = popupTopEdgeIfUp < topVisiblePosition;
    const bottomCollisionPossible = popupBottomEdgeIfDown > bottomVisiblePosition;
    const margin = annotatableRect.left;
    const minLeft = Math.max(((margin * -1) + 25), (rect.left - halfPopupWidth));
    const maxLeft = (popupWidth * -1) + annotatableRect.width + annotatableRect.left + margin + -25;

    let left;
    let top;
    let preferBottom = false;

    if (clientX !== null && clientX !== undefined && clientY !== null && clientY !== undefined) {
      preferBottom = (Math.abs(rect.bottom - clientY) < Math.abs(clientY - rect.top));
      left = clientX - halfPopupWidth;
    }

    // If there's no click event, we're probably responding to a window resizing, in which
    // case we can try to keep the left position as is.
    if (!selectionClickEvent) {
      left = this.popupEl.getBoundingClientRect().left;
    }

    if (isNaN(left)) left = minLeft;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    let direction = up;
    if (topCollisionPossible) direction = down;
    if (preferBottom && !bottomCollisionPossible) direction = down;
    const naturalTopPosition = window.pageYOffset + rect.top - popupHeight;
    const naturalBottomPosition = window.pageYOffset + rect.bottom + 60;
    if (direction === up) top = naturalTopPosition;
    if (direction === down) top = naturalBottomPosition;

    this.setState(Object.assign(this.state, { top, left, direction }));
  }

  render() {

    const popupClass = classNames({
      'annotation-popup': true,
      visible: this.state.visible
    });

    const tailClass = classNames({
      tail: true,
      'tail-down': this.state.direction === 'up',
      'tail-up': this.state.direction === 'down',
    });

    return (
      <div className={popupClass}
        ref={(a) => { this.popupEl = a; }}
        style={{
          top: this.state.top,
          left: this.state.left
        }}
      >
        {/* Provisional button for creating resources */}
        <button onClick={this.props.attachResource}>
          <i className="manicon manicon-cube-shine"></i>
          Resource
        </button>
        <button onClick={this.props.highlight}>
          <i className="manicon manicon-pencil-simple"></i>
          Highlight
        </button>
        <button onClick={this.props.annotate}>
          <i className="manicon manicon-word-bubble"></i>
          Annotate
        </button>
        <button onClick={this.props.bookmark}>
          <i className="manicon manicon-bookmark-outline"></i>
          Bookmark
        </button>
        <button onClick={this.props.share}>
          <i className="manicon manicon-nodes"></i>
          Share
        </button>
        <div className={tailClass}></div>
      </div>
    );
  }
}

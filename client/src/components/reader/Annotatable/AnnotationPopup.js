import React, { Component, PropTypes } from 'react';
import { throttle } from 'lodash';
import classNames from 'classnames';
import get from 'lodash/get';

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

  hasSelection(selection) {
    if (!selection) return false;
    if (selection && selection.range) {
      return true;
    }
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

  detectViewportCollision(left) {
    console.log(left, 'left');
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

  positionPopup(selection, selectionClickEvent = null) {
    if (this.hasSelection(selection)) {
      const rect = selection.range.getBoundingClientRect();
      const rectCenter = rect.width / 2;
      const popupHeight = this.popupEl.offsetHeight;
      const popupWidth = this.popupEl.offsetWidth;
      const halfPopupWidth = popupWidth / 2;

      let clientX = get(selectionClickEvent, 'clientX');
      let clientY = get(selectionClickEvent, 'clientY');

      let up = 'up';
      let down = 'down';
      let left;
      let top;
      let preferBottom = false;
      let annotatable = this.closest(this.popupEl, '.annotatable') // not ideal to grab this by class..
      let annotatableRect = annotatable.getBoundingClientRect();
      let topVisiblePosition = document.body.scrollTop + 100;
      let bottomVisiblePosition = topVisiblePosition + window.innerHeight;
      let popupTopEdgeIfUp = window.scrollY + rect.top - popupHeight;
      let popupBottomEdgeIfDown = window.scrollY + rect.bottom + popupHeight;
      let topCollisionPossible = popupTopEdgeIfUp < topVisiblePosition;
      let bottomCollisionPossible = popupBottomEdgeIfDown > bottomVisiblePosition;
      let margin = annotatableRect.left;
      let minLeft = Math.max(((margin * -1) + 25), (rect.left - halfPopupWidth));
      let maxLeft = (popupWidth * -1) + annotatableRect.width + annotatableRect.left + margin + -25;


      if (clientX !== null && clientX !== undefined && clientY !== null && clientY !== undefined) {
        preferBottom = (Math.abs(rect.bottom - clientY) < Math.abs(clientY - rect.top));
        left = clientX - halfPopupWidth;
      }

      // Resizing
      if (!selectionClickEvent) {
        left = this.popupEl.getBoundingClientRect().left;
      }

      if (left === NaN) left = minLeft;
      if (left < minLeft) left = minLeft;
      if (left > maxLeft) left = maxLeft;

      let direction = up;
      if (topCollisionPossible) direction = down;
      if (preferBottom && !bottomCollisionPossible) direction = down;
      const naturalTopPosition = window.pageYOffset + rect.top - popupHeight;
      const naturalBottomPosition = window.pageYOffset + rect.bottom + 60;
      if (direction == up) top = naturalTopPosition;
      if (direction == down) top = naturalBottomPosition;

      this.setState(Object.assign(this.state, { top, left, direction }));
    }
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

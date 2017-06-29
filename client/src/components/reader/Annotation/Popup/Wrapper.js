import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup as ReactCSSTransitionGroup } from 'react-transition-group';
import { throttle } from 'lodash';
import { EmailButton, TwitterButton, FacebookButton } from 'react-sociable';
import classNames from 'classnames';
import get from 'lodash/get';
import { closest } from 'utils/domUtils';
import Annotate from './Annotate';
import Share from './Share';

export default class AnnotationPopup extends Component {

  static displayName = "Annotation.Popup.Wrapper";

  static propTypes = {
    selection: PropTypes.object,
    selectionLocked: PropTypes.bool,
    selectionClickEvent: PropTypes.object,
    annotatableDomElement: PropTypes.object,
    shareUrl: PropTypes.string.isRequired,
    highlight: PropTypes.func.isRequired,
    annotate: PropTypes.func.isRequired,
    cite: PropTypes.func.isRequired,
    attachResource: PropTypes.func.isRequired,
    bookmark: PropTypes.func.isRequired,
    showLogin: PropTypes.func.isRequired,
    text: PropTypes.object.isRequired,
    section: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      visible: false,
      top: 0,
      bottom: 'auto',
      left: 0,
      direction: 'up',
      secondary: null,
    };

    this.secondaryPageTransitionTime = 300;

    this.showSecondary = this.showSecondary.bind(this);
    this.resetSecondary = this.resetSecondary.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', throttle(() => {
      this.positionPopup(this.props.selection);
    }, 400));
  }

  componentWillReceiveProps(nextProps) {
    this.maybeShowPopup(this.props, nextProps);
  }

  componentWillUnmount() {
    clearTimeout(this.secondaryPageTimeout);
  }

  getLockedSelectionRect() {
    const locked = document.querySelector('.annotation-locked-selected');
    if (!locked) return null;
    return locked.getBoundingClientRect();
  }

  maybeShowPopup(prevProps, nextProps) {
    if (nextProps && prevProps.selection !== nextProps.selection) {
      // Locked?
      if (nextProps.selectionLocked) {
        return;
      }
      // Update popup
      if (!nextProps.selection) {
        // Hide the popup if there is no "Range"
        this.setState({
          visible: false,
          secondary: null
        });
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
    if (!rect) return;
    const rectCenter = rect.width / 2;
    const popupHeight = this.popupEl.offsetHeight;
    const popupWidth = this.popupEl.offsetWidth;
    const halfPopupWidth = popupWidth / 2;
    const clientX = get(selectionClickEvent, 'clientX');
    const clientY = get(selectionClickEvent, 'clientY');
    const up = 'up';
    const down = 'down';
    const annotatable = this.props.annotatableDomElement;
    const annotatableRect = annotatable.getBoundingClientRect();
    // Get crossbrowser document scrollTop
    const documentScrollTop =
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      window.scrollY;
    const topVisiblePosition = documentScrollTop + 100;
    const bottomVisiblePosition = documentScrollTop + window.innerHeight;
    const popupTopEdgeIfUp = documentScrollTop + rect.top - popupHeight;
    const popupBottomEdgeIfDown = documentScrollTop + rect.bottom + popupHeight;
    const topCollisionPossible = popupTopEdgeIfUp < topVisiblePosition;
    const bottomCollisionPossible = popupBottomEdgeIfDown > bottomVisiblePosition;
    const margin = annotatableRect.left;
    const minLeft = Math.max(((margin * -1) + 25), (rect.left - halfPopupWidth));
    const maxLeft =
      (popupWidth * -1) + annotatableRect.width + annotatableRect.left + margin + -25;

    let left;
    let top;
    let bottom;
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
    // Hardcode offset so that the tail of the popop doesn't sit right on top of
    // the text.
    const naturalTopPosition = window.pageYOffset + rect.top - 60;
    const naturalBottomPosition = window.pageYOffset + rect.bottom + 60;
    if (direction === up) {
      top = 'auto';
      bottom = window.innerHeight - naturalTopPosition;
    }
    if (direction === down) {
      top = naturalBottomPosition;
      bottom = 'auto';
    }

    this.setState({ top, bottom, left, direction });
  }

  showSecondary(page) { this.setState({ secondary: page }); }

  resetSecondary() {
    this.setState({
      secondary: null
    });
  }

  renderSecondaryShare() {
    if (this.state.secondary !== 'share') return null;

    return (
      <Share
        selectionText={this.props.selection.text}
        shareUrl={this.props.shareUrl}
        direction={this.state.direction}
        back={this.resetSecondary}
        cite={this.props.cite}
        text={this.props.text}
        section={this.props.section}
      />
    );
  }

  render() {
    const popupClass = classNames({
      'annotation-popup': true,
      visible: this.state.visible
    });

    return (
      <div className={popupClass}
        ref={(a) => { this.popupEl = a; }}
        style={{
          top: this.state.top,
          bottom: this.state.bottom,
          left: this.state.left
        }}
      >
        <Annotate
          attachResource={this.props.attachResource}
          highlight={this.props.highlight}
          annotate={this.props.annotate}
          bookmark={this.props.bookmark}
          showShare={() => { this.showSecondary('share'); }}
          secondary={this.state.secondary}
          direction={this.state.direction}
          showLogin={this.props.showLogin}
        />
        <ReactCSSTransitionGroup
          transitionName="page"
          transitionEnterTimeout={this.secondaryPageTransitionTime}
          transitionLeaveTimeout={this.secondaryPageTransitionTime}
          component="div"
          className="popup-page-secondary-group"
        >
          {this.renderSecondaryShare()}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

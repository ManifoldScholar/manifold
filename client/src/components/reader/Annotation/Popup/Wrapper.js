import React, { Component } from "react";
import PropTypes from "prop-types";
import { throttle } from "lodash";
import classNames from "classnames";
import get from "lodash/get";
import Secondary from "./Secondary";
import { bindActionCreators } from "redux";
import { uiVisibilityActions } from "actions";
import mapValues from "lodash/mapValues";
import isString from "lodash/isString";

export default class AnnotationPopup extends Component {
  static displayName = "Annotation.Popup.Wrapper";

  static propTypes = {
    selection: PropTypes.object,
    selectedAnnotation: PropTypes.object,
    showAnnotationsInDrawer: PropTypes.func,
    selectionLocked: PropTypes.bool,
    selectionClickEvent: PropTypes.object,
    annotatableDomElement: PropTypes.object,
    cite: PropTypes.func,
    section: PropTypes.object,
    children: PropTypes.object,
    text: PropTypes.object,
    dispatch: PropTypes.func
  };

  static defaultProps = {
    contents: "annotation"
  };

  constructor() {
    super();
    this.state = {
      visible: false,
      top: 0,
      bottom: "auto",
      left: 0,
      direction: "up",
      secondary: null
    };
  }

  componentDidMount() {
    window.addEventListener(
      "resize",
      throttle(() => {
        this.positionPopup(this.props.selection);
      }, 400)
    );
  }

  componentDidUpdate(prevProps) {
    this.maybeShowPopup(prevProps, this.props);
  }

  componentWillUnmount() {
    clearTimeout(this.secondaryPageTimeout);
  }

  getLockedSelectionRect() {
    const locked = document.querySelector(".annotation-locked-selected");
    if (!locked) return null;
    return locked.getBoundingClientRect();
  }

  maybeShowPopup(prevProps, props) {
    if (props && prevProps.selection !== props.selection) {
      // Locked?
      if (props.selectionLocked) {
        return;
      }
      // Update popup
      if (!props.selection) {
        // Hide the popup if there is no "Range"
        this.setState({
          visible: false,
          secondary: null
        });
      } else {
        // Calculate the position for the popup
        this.positionPopup(props.selection, props.selectionClickEvent);

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
    if (!this.popupEl) return;
    const popupHeight = this.popupEl.offsetHeight;
    const popupWidth = this.popupEl.offsetWidth;
    const halfPopupWidth = popupWidth / 2;
    const clientX = get(selectionClickEvent, "clientX");
    const clientY = get(selectionClickEvent, "clientY");
    const up = "up";
    const down = "down";
    const annotatable = this.props.annotatableDomElement;
    const section = annotatable.querySelector(".manifold-text-section");
    const annotatableRect = section.getBoundingClientRect();
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
    const bottomCollisionPossible =
      popupBottomEdgeIfDown > bottomVisiblePosition;
    const margin = annotatableRect.left;
    const minLeft = Math.max(margin * -1 + 25, rect.left - halfPopupWidth);
    const maxLeft = margin + annotatableRect.width - popupWidth * 0.5;
    let left;
    let top;
    let bottom;
    let preferBottom = false;

    if (
      clientX !== null &&
      clientX !== undefined &&
      clientY !== null &&
      clientY !== undefined
    ) {
      preferBottom =
        Math.abs(rect.bottom - clientY) < Math.abs(clientY - rect.top);
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
      top = "auto";
      bottom = window.innerHeight - naturalTopPosition;
    }
    if (direction === down) {
      top = naturalBottomPosition;
      bottom = "auto";
    }

    const positions = this.roundPositions({ top, left, bottom });
    this.setState({ ...positions, direction });
  }

  roundPositions(positions) {
    return mapValues(positions, pos => {
      if (!isString(pos)) return Math.round(pos);
      return pos;
    });
  }

  showSecondary = page => {
    this.setState({ secondary: page });
  };

  resetSecondary = () => {
    this.setState({
      secondary: null
    });
  };

  stopPropagation(event) {
    event.nativeEvent.stopPropagation();
    event.stopPropagation();
  }

  childProps() {
    const showLogin = bindActionCreators(
      () => uiVisibilityActions.visibilityToggle("signInUpOverlay"),
      this.props.dispatch
    );

    return {
      secondary: this.state.secondary,
      direction: this.state.direction,
      back: this.resetSecondary,
      cite: this.props.cite,
      text: this.props.text,
      section: this.props.section,
      selection: this.props.selection,
      showSecondary: this.showSecondary,
      showLogin
    };
  }

  renderChildren() {
    if (!this.props.children) return null;
    const props = this.childProps();
    return React.cloneElement(this.props.children, props);
  }

  render() {
    const popupClass = classNames({
      "annotation-popup": true,
      visible: this.state.visible
    });

    return (
      <div
        onMouseDown={this.stopPropagation}
        onClick={this.stopPropagation}
        role="presentation"
        className={popupClass}
        ref={a => {
          this.popupEl = a;
        }}
        style={{
          top: this.state.top,
          bottom: this.state.bottom,
          left: this.state.left
        }}
      >
        {this.renderChildren()}
        <Secondary.Wrapper {...this.childProps()} />
      </div>
    );
  }
}

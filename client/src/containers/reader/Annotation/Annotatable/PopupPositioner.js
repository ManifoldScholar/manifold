import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { throttle } from "lodash";
import classNames from "classnames";

export default class AnnotationPopupPositioner extends PureComponent {
  static displayName = "Annotation.Popup.Positioner";

  static propTypes = {
    locked: PropTypes.bool.isRequired,
    children: PropTypes.func.isRequired,
    annotatableRef: PropTypes.object,
    selectionState: PropTypes.shape({
      selection: PropTypes.object,
      selectionComplete: PropTypes.boolean,
      selectionAnnotation: PropTypes.object,
      popupTriggerX: PropTypes.number,
      popupTriggerY: PropTypes.number
    })
  };

  static defaultProps = {
    locked: false,
    contents: "annotation"
  };

  constructor() {
    super();
    this.state = {
      direction: "up"
    };
  }

  componentDidMount() {
    window.addEventListener(
      "resize",
      throttle(() => {
        this.updatePosition();
      }, 400)
    );
  }

  componentDidUpdate() {
    if (this.props.locked || !this.props.selectionState.selection) return;
    this.updatePosition();
  }

  setPopupRef = el => {
    this.popupRef = el;
  };

  get visible() {
    const { selection, selectionComplete } = this.props.selectionState;
    return selection && selectionComplete;
  }

  get isMobile() {
    // TODO: Implement mobile detection.
    return false;
  }

  get selectionRect() {
    const { selection } = this.props.selectionState;
    if (!selection || !selection.range) return null;
    const out = selection.range.getBoundingClientRect();
    return out;
  }

  get popupDimensions() {
    if (!this.popupRef)
      throw new Error("Cannot get popupDimensions without a popupRef");
    return {
      height: this.popupRef.offsetHeight,
      width: this.popupRef.offsetWidth
    };
  }

  get isPositionable() {
    const {
      selectionState: { selection },
      annotatableRef
    } = this.props;
    if (!selection) return false;
    if (!annotatableRef) return false;
    if (this.isMobile) return true;
    if (!selection.range) return false;
    if (!this.selectionRect) return false;
    if (!this.popupRef) return false;
    return true;
  }

  get scrollTop() {
    return (
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      window.pageYOffset
    );
  }

  get annotatableRect() {
    const { annotatableRef } = this.props;
    if (!annotatableRef)
      throw new Error("Cannot get annotatableRect without an annotatableRef");
    const el = annotatableRef.querySelector(".manifold-text-section");
    return el.getBoundingClientRect();
  }

  get margin() {
    return this.annotatableRect.left;
  }

  get directions() {
    return { up: "up", down: "down" };
  }

  get hasTriggers() {
    const {
      selectionState: { popupTriggerX, popupTriggerY }
    } = this.props;
    return (
      popupTriggerX !== null &&
      popupTriggerX !== undefined &&
      popupTriggerY !== null &&
      popupTriggerY !== undefined
    );
  }

  positionForMobile() {
    // TODO: Handle mobile position.
  }

  preferBottom(selectionRect) {
    const {
      selectionState: { popupTriggerY }
    } = this.props;
    return (
      Math.abs(selectionRect.bottom - popupTriggerY) <
      Math.abs(popupTriggerY - selectionRect.top)
    );
  }

  validateLeft(left, minLeft, maxLeft) {
    let out = left;
    if (isNaN(out)) out = minLeft;
    if (out < minLeft) out = minLeft;
    if (out > maxLeft) out = maxLeft;
    return out;
  }

  positionForDesktop() {
    if (!this.isPositionable) return;

    try {
      const selectionRect = this.selectionRect;
      const scrollTop = this.scrollTop;
      const { height: popupHeight, width: popupWidth } = this.popupDimensions;
      const { minLeft, maxLeft } = this.minAndMaxLeft(
        selectionRect,
        popupWidth
      );

      // Get crossbrowser document scrollTop
      const topVisiblePosition = scrollTop + 100;
      const bottomVisiblePosition = scrollTop + window.innerHeight;
      const popupTopEdgeIfUp = scrollTop + selectionRect.top - popupHeight;
      const popupBottomEdgeIfDown =
        scrollTop + selectionRect.bottom + popupHeight;
      const topCollisionPossible = popupTopEdgeIfUp < topVisiblePosition;
      const bottomCollisionPossible =
        popupBottomEdgeIfDown > bottomVisiblePosition;

      let left;
      let top;
      let bottom;
      let preferBottom = false;

      if (this.hasTriggers) {
        preferBottom = this.preferBottom(selectionRect);
        left = this.props.selectionState.popupTriggerX - popupWidth / 2;
      } else {
        // If there's no click event, we're probably responding to a window resizing, in which
        // case we can try to keep the left position as is.
        left = this.popupRef.getBoundingClientRect().left;
      }

      left = this.validateLeft(left, minLeft, maxLeft);

      let direction = this.directions.up;
      if (topCollisionPossible) direction = this.directions.down;
      if (preferBottom && !bottomCollisionPossible)
        direction = this.directions.down;

      // Hardcode offset so that the tail of the popup doesn't sit right on top of
      // the text.

      if (direction === this.directions.up) {
        top = "auto";
        const naturalTopPosition = window.pageYOffset + selectionRect.top - 30;
        bottom = window.innerHeight - naturalTopPosition;
      }
      if (direction === this.directions.down) {
        const naturalBottomPosition =
          window.pageYOffset + selectionRect.bottom + 50;
        top = naturalBottomPosition;
        bottom = "auto";
      }

      this.popupRef.style.position = "absolute";
      this.popupRef.style.top = this.withUnit(top);
      this.popupRef.style.bottom = this.withUnit(bottom);
      this.popupRef.style.left = this.withUnit(left);
      this.setState({ direction });
    } catch (error) {
      /* eslint-disable no-console */
      console.log("There was an error positioning the annotation popup");
      console.log(error);
      /* eslint-enable no-console */
    }
  }

  minAndMaxLeft(selectionRect, popupWidth) {
    const minLeft = Math.max(
      this.margin * -1 + 25,
      selectionRect.left - popupWidth / 2
    );
    const maxLeft = this.margin + this.annotatableRect.width - popupWidth * 0.5;
    return { minLeft, maxLeft };
  }

  withUnit(value) {
    if (value === "auto") return value;
    return `${Math.round(value)}px`;
  }

  updatePosition() {
    if (this.isMobile) return this.positionForMobile();
    this.positionForDesktop();
  }

  render() {
    const popupClass = classNames({
      "annotation-popup": true,
      visible: this.visible
    });

    return (
      <div
        onMouseDown={this.stopPropagation}
        onClick={this.stopPropagation}
        role="presentation"
        className={popupClass}
        ref={this.setPopupRef}
      >
        {this.visible ? this.props.children(this.state) : null}
      </div>
    );
  }
}

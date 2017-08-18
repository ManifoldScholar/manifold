import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { scrollOptions } from "utils/domUtils";

export default class EdgeLockScroll extends PureComponent {
  static displayName = "Utility.EdgeLockScroll";

  static propTypes = {
    children: PropTypes.element.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      touchStart: null
    };

    this.edgeLock = this.edgeLock.bind(this);
  }

  componentDidMount() {
    this.scroller = this.child;

    if (!this.scroller) return null;

    this.handleWheel = event => {
      this.edgeLock(this.scroller, event);
    };

    this.handleTouch = event => {
      const touchDelta = this.state.touchStart - event.touches[0].pageY;
      this.edgeLock(this.scroller, event, touchDelta);
    };

    this.setTouchStart = event => {
      this.setState({
        touchStart: event.touches[0].pageY
      });
    };

    this.scroller.addEventListener(
      "mousewheel",
      this.handleWheel,
      scrollOptions()
    );
    this.scroller.addEventListener(
      "touchmove",
      this.handleTouch,
      scrollOptions()
    );
    this.scroller.addEventListener(
      "touchstart",
      this.setTouchStart,
      scrollOptions()
    );
  }

  componentWillUnmount() {
    this.scroller.removeEventListener(
      "mousewheel",
      this.handleWheel,
      scrollOptions()
    );
    this.scroller.removeEventListener(
      "touchmove",
      this.handleTouch,
      scrollOptions()
    );
    this.scroller.removeEventListener(
      "touchstart",
      this.setTouchStart,
      scrollOptions()
    );
  }

  edgeLock(scroller, event, touchDelta) {
    const delta = touchDelta || event.deltaY;
    const offset = scroller.offsetTop;
    if (delta < 0 && scroller.scrollTop <= 0) {
      event.preventDefault();
    }

    if (
      delta > 0 &&
      scroller.scrollTop >= scroller.scrollHeight - window.innerHeight + offset
    ) {
      event.preventDefault();
    }
  }

  render() {
    return (
      <div className="edge-lock-scroll">
        {React.cloneElement(this.props.children, {
          ref: child => {
            this.child = child;
          }
        })}
      </div>
    );
  }
}

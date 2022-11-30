import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class EdgeLockScroll extends PureComponent {
  static displayName = "Utility.EdgeLockScroll";

  static propTypes = {
    children: PropTypes.element.isRequired
  };

  constructor(props) {
    super(props);
    this.childRef = React.createRef();

    this.state = {
      touchStart: null
    };
  }

  componentDidMount() {
    this.scroller = this.childRef.current;

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

    this.scroller.addEventListener("mousewheel", this.handleWheel, {
      passive: false
    });
    this.scroller.addEventListener("touchmove", this.handleTouch, {
      passive: false
    });
    this.scroller.addEventListener("touchstart", this.setTouchStart, {
      passive: true
    });
  }

  componentWillUnmount() {
    this.scroller.removeEventListener("mousewheel", this.handleWheel, {
      passive: false
    });
    this.scroller.removeEventListener("touchmove", this.handleTouch, {
      passive: false
    });
    this.scroller.removeEventListener("touchstart", this.setTouchStart, {
      passive: true
    });
  }

  edgeLock = (scroller, event, touchDelta) => {
    if (event.target !== this.child) return; // Ignore locking if the element being scrolled is not the direct child

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
  };

  render() {
    return (
      <div className="edge-lock-scroll">
        {React.cloneElement(React.Children.only(this.props.children), {
          ref: this.childRef
        })}
      </div>
    );
  }
}

import React, { PureComponent, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import isString from 'lodash/isString';

export default class ScrollLock extends PureComponent {

  static displayName = "Utility.ScrollLock";

  static propTypes = {
    children: React.PropTypes.element.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      touchStart: null
    };

    this.edgeLock = this.edgeLock.bind(this);
  }

  edgeLock(scroller, event, touchDelta) {
    const delta = touchDelta ? touchDelta : event.deltaY;
    if (delta < 0 && scroller.scrollTop <= 0) {
      event.preventDefault();
    }

    if (delta > 0 && scroller.scrollTop >= scroller.scrollHeight - window.innerHeight) {
      event.preventDefault();
    }
  }

  componentDidMount() {
    this.scroller = isString(this.props.children.type) ?
      this.child : ReactDOM.findDOMNode(this.child);

    this.handleWheel = (event) => {
      this.edgeLock(this.scroller, event);
    };

    this.handleTouch = (event) => {
      const touchDelta = this.state.touchStart - event.touches[0].pageY;
      this.edgeLock(this.scroller, event, touchDelta);
    };

    this.setTouchStart = (event) => {
      this.setState({
        touchStart: event.touches[0].pageY
      });
    };

    this.scroller.addEventListener('mousewheel', this.handleWheel);
    this.scroller.addEventListener('touchmove', this.handleTouch);
    this.scroller.addEventListener('touchstart', this.setTouchStart);
  }

  componentWillUnmount() {
    this.scroller.removeEventListener('mousewheel', this.handleWheel);
    this.scroller.removeEventListener('touchmove', this.handleTouch);
    this.scroller.removeEventListener('touchstart', this.setTouchStart);
  }

  render() {
    return (
      <div className="scroll-lock">
        {React.cloneElement(this.props.children, { ref: (child) => { this.child = child; } })}
      </div>
    );
  }

}

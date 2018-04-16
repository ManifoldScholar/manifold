import React, { Component } from "react";
import PropTypes from "prop-types";
import { throttle } from "lodash";
import classNames from "classnames";

export default class ScrollAware extends Component {
  static propTypes = {
    children: PropTypes.object,
    threshold: PropTypes.number,
    topClass: PropTypes.string,
    notTopClass: PropTypes.string,
    startPinned: PropTypes.bool,
    pinnedClass: PropTypes.string,
    notPinnedClass: PropTypes.string,
    pinThreshold: PropTypes.number
  };

  static defaultProps = {
    threshold: 200,
    topClass: "top",
    notTopClass: "not-top",
    // Following convention from Headroom.js,
    // pinned is used to reference having scroll up past a
    // threshold amount
    startPinned: true,
    pinnedClass: "pinned",
    notPinnedClass: "not-pinned",
    pinThreshold: 50
  };

  constructor() {
    super();
    this.state = {
      top: true,
      pinned: true,
      scroll: 0,
      direction: "down",
      log: null
    };

    this.throttleScroll = throttle(this.handleScroll, 500).bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.throttleScroll);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) return true;
    return (
      this.state.top !== nextState.top || this.state.pinned !== nextState.pinned
    );
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.throttleScroll);
  }

  getScrollTop() {
    let scrollTop = 0;
    if (window.pageYOffset !== undefined) {
      scrollTop = window.pageYOffset;
    } else {
      scrollTop = (
        document.documentElement ||
        document.body.parentNode ||
        document.body
      ).scrollTop;
    }
    return scrollTop;
  }

  isPinned(direction, log) {
    // Note that direction and log are the next direction/log
    // Unpin by default
    let pinned = this.state.pinned;
    if (
      direction === "up" &&
      Math.abs(this.getScrollTop() - log) > this.props.pinThreshold
    ) {
      pinned = true;
    } else if (
      direction === "down" &&
      Math.abs(this.getScrollTop() - log) > this.props.pinThreshold
    ) {
      pinned = false;
    }

    return pinned;
  }

  maybeLog(direction) {
    // Set a scroll log on direction change
    // Note that this.state.direction is the old direction
    let log = this.state.log;
    if (this.state.direction !== direction) {
      log = this.getScrollTop();
    }

    return log;
  }

  handleScroll() {
    const top = this.getScrollTop() < this.props.threshold;
    const direction = this.getScrollTop() > this.state.scroll ? "down" : "up";
    const log = this.maybeLog(direction);
    const pinned = this.isPinned(direction, log);

    this.setState({
      top,
      pinned,
      direction,
      log,
      scroll: this.getScrollTop()
    });
  }

  renderChildren() {
    let firstChild = false;
    if (React.Children.count(this.props.children) > 1) {
      firstChild = this.props.children[0];
    } else {
      firstChild = this.props.children;
    }
    return React.cloneElement(firstChild, {
      scrollAware: {
        top: this.state.top,
        pinned: this.state.pinned
      }
    });
  }

  render() {
    // Dynaimcally assign scroller classes based on props
    const scrollClasses = {
      "scroll-aware": true
    };

    scrollClasses[this.props.topClass] = this.state.top;
    scrollClasses[this.props.notTopClass] = !this.state.top;
    scrollClasses[this.props.pinnedClass] = this.state.pinned;
    scrollClasses[this.props.notPinnedClass] = !this.state.pinned;

    const scrollClass = classNames(scrollClasses);

    return <div className={scrollClass}>{this.renderChildren()}</div>;
  }
}

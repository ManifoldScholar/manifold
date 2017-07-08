import React, { Component } from "react";
import PropTypes from "prop-types";
import { throttle } from "lodash";
import classNames from "classnames";

export default class ScrollAware extends Component {
  static propTypes = {
    children: PropTypes.object,
    threshold: PropTypes.number,
    topClass: PropTypes.string,
    notTopClass: PropTypes.string
  };

  static defaultProps = {
    threshold: 200,
    topClass: "top",
    notTopClass: "not-top"
  };

  constructor() {
    super();
    this.state = {
      top: true
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) return true;
    return this.state.top !== nextState.top;
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  getScrollTop() {
    let scrollTop = 0;
    if (window.pageYOffset !== undefined) {
      scrollTop = window.pageYOffset;
    } else {
      scrollTop = (document.documentElement ||
        document.body.parentNode ||
        document.body).scrollTop;
    }
    return scrollTop;
  }

  handleScroll = throttle(() => {
    const isTop = this.getScrollTop() < this.props.threshold;
    this.setState({ top: isTop });
  }, 500);

  renderChildren() {
    let firstChild = false;
    if (React.Children.count(this.props.children) > 1) {
      firstChild = this.props.children[0];
    } else {
      firstChild = this.props.children;
    }
    return React.cloneElement(firstChild, {
      scrollAware: {
        top: this.state.top
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

    const scrollClass = classNames(scrollClasses);

    return (
      <div className={scrollClass}>
        {this.renderChildren()}
      </div>
    );
  }
}

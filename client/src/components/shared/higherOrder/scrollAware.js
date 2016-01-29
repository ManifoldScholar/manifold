import React, { Component, PropTypes } from 'react';
import { throttle } from '../../../../node_modules/lodash/function';
import classNames from 'classnames';

export default class ScrollAware extends Component {
  static propTypes = {
    children: PropTypes.object,
    threshold: PropTypes.number,
    throttle: PropTypes.number
  };

  static defaultProps = {
    threshold: 200,
    throttle: 500
  };

  constructor() {
    super();
    this.state = {
      top: true
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) return true;
    return this.state.top !== nextState.top;
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getScrollTop() {
    let scrollTop = 0;
    if (window.pageYOffset !== undefined) {
      scrollTop = window.pageYOffset;
    } else {
      scrollTop = (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }
    return scrollTop;
  }

  handleScroll = throttle(() => {
    const isTop = this.getScrollTop() < this.props.threshold;
    this.setState({ top: isTop });
  }, 500);

  render() {
    const scrollClass = classNames({
      'scroll-aware': true,
      top: this.state.top,
      'not-top': !this.state.top
    });

    return (
        <div className={scrollClass}>
          {this.props.children}
        </div>
    );
  }
}

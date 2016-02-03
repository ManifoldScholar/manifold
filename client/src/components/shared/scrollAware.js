import React, { Component, PropTypes } from 'react';
import { throttle } from 'lodash/function';
import classNames from 'classnames';

export default class ScrollAware extends Component {
  static propTypes = {
    children: PropTypes.element,
    threshold: PropTypes.number,
    throttle: PropTypes.number
  };

  static defaultProps = {
    threshold: 200,
    throttle: 500
  };

  constructor() {
    super();
    this.state = {top: true};
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate() {
    console.log('ima update now');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.top != nextState.top;
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

  handleScroll = () => {
    const isTop = this.getScrollTop() < this.props.threshold;
    this.setState({ top: isTop });
  };

  render() {
    return (
        <div className="stub">
          {this.props.children}
        </div>
    );
  }
}

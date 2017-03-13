import React, { PureComponent, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import isString from 'lodash/isString';
import { HigherOrder } from 'components/global';

export default class LockBodyScroll extends PureComponent {

  static displayName = "Utility.LockBodyScroll";

  static propTypes = {
    lockClass: PropTypes.string,
    children: PropTypes.element.isRequired
  };

  static defaultProps = {
    lockClass: 'no-scroll'
  };

  constructor(props) {
    super(props);

    this.state = {
      inBrowser: false,
      currentScrollTop: 0
    };

  }

  componentDidMount() {
    // When the component mounts, grab the scrolltop
    // and apply a scroll-freezing class to the body
    if (this.state.inBrowser === false) {
      // eslint-disable-line react/no-did-mount-set-state
      this.setState({
        inBrowser: true,
        currentScrollTop: document.body.scrollTop
      });
    }
  }

  componentWillUnmount() {
    // Remove the body class and apply scrolltop (for touch)
    document.body.scrollTop = this.state.currentScrollTop;
  }

  render() {
    return (
      <div className="lock-body-scroll">
        <HigherOrder.BodyClass className={this.props.lockClass}>
          {this.props.children}
        </HigherOrder.BodyClass>
      </div>
    );
  }

}

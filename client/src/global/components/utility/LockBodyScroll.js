import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import BodyClass from "hoc/BodyClass";

export default class LockBodyScroll extends PureComponent {
  static displayName = "Utility.LockBodyScroll";

  static propTypes = {
    lockClass: PropTypes.string,
    children: PropTypes.element.isRequired
  };

  static defaultProps = {
    lockClass: "no-scroll"
  };

  constructor(props) {
    super(props);

    this.state = {
      currentScrollTop: __SERVER__ ? 0 : document.body.scrollTop
    };
  }

  componentDidMount() {
    // document.body.scrollTop = this.state.currentScrollTop;
  }

  componentWillUnmount() {
    // Apply back scrolltop (for touch)
    // document.body.scrollTop = this.state.currentScrollTop;
  }

  render() {
    return (
      <div className="lock-body-scroll">
        <BodyClass className={this.props.lockClass}>
          {this.props.children}
        </BodyClass>
      </div>
    );
  }
}

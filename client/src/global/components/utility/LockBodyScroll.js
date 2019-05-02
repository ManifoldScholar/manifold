import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import BodyClass from "hoc/body-class";

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

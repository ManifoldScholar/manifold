import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import locationHelper from "helpers/location";

export default class BlurOnLocationChange extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }
  componentDidUpdate(prevProps) {
    if (!this.props.location) return;
    if (!this.wrapperRef.current) return;
    if (locationHelper.equals(this.props.location, prevProps.location)) return;
    const focused = this.wrapperRef.current.querySelector(":focus");
    if (!focused) return;
    focused.blur();
  }

  render() {
    return (
      <React.Fragment>
        <div ref={this.wrapperRef}>{this.props.children}</div>
      </React.Fragment>
    );
  }
}

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import setter from "../setter";
import Errorable from "../Errorable";

class Errors extends PureComponent {
  static propTypes = {
    names: PropTypes.array.isRequired,
    wide: PropTypes.bool
  };

  render() {
    const { children, names, wide, ...otherProps } = this.props;
    return (
      <Errorable
        className={wide ? "wide" : undefined}
        name={names}
        {...otherProps}
      />
    );
  }
}

export default setter(Errors);

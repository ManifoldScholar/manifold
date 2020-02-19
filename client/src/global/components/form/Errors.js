import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import Errorable from "./Errorable";
import classNames from "classnames";

class Errors extends PureComponent {
  static propTypes = {
    names: PropTypes.array.isRequired,
    wide: PropTypes.bool
  };

  render() {
    const wrapperClassNames = classNames({
      "form-input": true,
      wide: this.props.wide
    });

    const { children, names, ...otherProps } = this.props;
    return (
      <Errorable className={wrapperClassNames} name={names} {...otherProps} />
    );
  }
}

export default setter(Errors);

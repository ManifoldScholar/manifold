import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import setter from './setter';

class FormSwitch extends Component {

  static displayName = "Form.Switch";

  static propTypes = {
    label: PropTypes.string,
    set: PropTypes.func,
    value: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  truthy(value) {
    return value === true || value === "true";
  }

  handleClick(event) {
    event.preventDefault();
    this.props.set(!this.truthy(this.props.value));
  }

  render() {
    const classes = classnames({
      "boolean-primary": true,
      checked: this.truthy(this.props.value)
    });

    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <div className="toggle-indicator">
          {/* Add .checked to .boolean-primary to change visual state */}
          <div onClick={this.handleClick} className={classes}></div>
        </div>
      </div>
    );
  }
}

export default setter(FormSwitch);

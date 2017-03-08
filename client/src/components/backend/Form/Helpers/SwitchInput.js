import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import classnames from 'classnames';

export default class FormSwitchInput extends Component {

  static displayName = "Form.Switch.Input";

  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func
  };

  static defaultProps = {
    value: {}
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  truthy(value) {
    return value === true || value === "true";
  }

  handleClick(event) {
    const adjustedEvent = event;
    this.trackingInput.value = !this.truthy(this.props.value);
    adjustedEvent.target = this.trackingInput;
    this.props.onChange(adjustedEvent);
  }

  render() {
    const classes = classnames({
      "boolean-primary": true,
      checked: this.truthy(this.props.value)
    });

    return (
      <div className="toggle-indicator">
        {/* Add .checked to .boolean-primary to change visual state */}
        <div onClick={this.handleClick} className={classes}></div>
        <input
          type="text"
          style={{ display: "none" }}
          ref={(input) => { this.trackingInput = input; }}
        />
      </div>
    );
  }

}

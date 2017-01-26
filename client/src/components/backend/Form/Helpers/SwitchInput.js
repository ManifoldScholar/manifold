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
    this.switchValue = this.props.value;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const adjustedEvent = event;
    this.switchValue = !this.switchValue;
    this.trackingInput.value = this.switchValue;
    adjustedEvent.target = this.trackingInput;
    this.props.onChange(adjustedEvent);
  }

  render() {
    const classes = classnames({
      "boolean-primary": true,
      checked: this.switchValue === true
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

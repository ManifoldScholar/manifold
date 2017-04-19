import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import setter from '../setter';

class AvatarBuilderColorPicker extends Component {

  static displayName = "Form.AvatarBuilder.ColorPicker";

  static propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
    errors: PropTypes.array,
    password: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <input
          ref={(input) => { this.inputElement = input; }}
          type="text"
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          value={this.props.value || ""}
        />
      </div>
    );
  }
}

export default setter(AvatarBuilderColorPicker);

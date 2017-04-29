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
    const avatarColors = [
      {value: 'primary', label: '', className: 'primary'},
      {value: '', label: '', className: ''},
      {value: 'secondary', label: '', className: 'secondary'},
      {value: 'tertiary', label: '', className: 'tertiary'},
      {value: 'quaternary', label: '', className: 'quaternary'},
      {value: 'quinary', label: '', className: 'quinary'}
    ];
    return (
      <div className="color-picker">

      <div className="colors">
        <Form.Radios
            options={avatarColors}
            layout="color-picker-item"
            toggleIcon="manicon-check"
        />
      </div>

        <div>
          <p className="default-description">Select A Different Background Color</p>
        </div>
      </div>
    );
  }
}

export default setter(AvatarBuilderColorPicker);

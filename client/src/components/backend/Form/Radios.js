import React, { Component, PropTypes } from 'react';

export default class Radios extends Component {

  static displayName = "From.Radios";

  static propTypes = {
    label: PropTypes.string
  };

  render() {
    return (
      <div className="form-input">
        <label>{this.props.label}</label>

        <label className="form-toggle radio horizontal">
          <input type="radio" name="selection"/>
            <span className="toggle-indicator">
            </span>
            <span className="toggle-label">Checkbox item</span>
        </label>

        <label className="form-toggle radio horizontal">
          <input type="radio" name="selection"/>
            <span className="toggle-indicator">
            </span>
            <span className="toggle-label">Checkbox item</span>
        </label>

        <label className="form-toggle radio horizontal">
          <input type="radio" name="selection"/>
            <span className="toggle-indicator">
            </span>
            <span className="toggle-label">Checkbox item</span>
        </label>
      </div>
    );
  }

}

import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import sharedPropsValidation from './propTypes';
import classNames from 'classnames';

export default class FormSelect extends Component {

  static displayName = "Form.Select";

  static propTypes = {
    ...sharedPropsValidation,
    selected: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })).isRequired
  };

  static defaultProps = {
    layout: "horizontal"
  }

  render() {

    const options = this.props.options.map((option) => {
      return (
        <option key={option.value} value={option.value}>{option.label}</option>
      );
    });

    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <Form.Connect.Set {...this.props} >
          <div className="form-select">
            <i className="manicon manicon-caret-down"></i>
            <select defaultValue={this.props.selected}>
              {options}
            </select>
          </div>
        </Form.Connect.Set>
      </div>
    );
  }

}

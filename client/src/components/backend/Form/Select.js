import React, { Component, PropTypes } from 'react';
import { Form as GlobalForm } from 'components/global';
import classNames from 'classnames';
import setter from './setter';

class FormSelect extends Component {

  static displayName = "Form.Select";

  static propTypes = {
    value: PropTypes.any,
    errors: PropTypes.array,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })).isRequired
  };

  render() {

    const options = this.props.options.map((option) => {
      return (
        <option key={option.value} value={option.value}>{option.label}</option>
      );
    });

    return (
      <div className="form-input">
        <GlobalForm.Errorable
          className="form-input"
          name={this.props.name}
          errors={this.props.errors}
          label={this.props.label}
        >
          <label>{this.props.label}</label>
          <div className="form-select">
            <i className="manicon manicon-caret-down"></i>
            <select
              onChange={this.props.onChange}
              value={this.props.value}
            >
              {options}
            </select>
          </div>
        </GlobalForm.Errorable>
      </div>
    );
  }

}

export default setter(FormSelect);

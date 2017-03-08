import React, { Component, PropTypes } from 'react';
import sharedPropsValidation from './propTypes';
import { Form } from 'components/backend';
import classNames from 'classnames';

export default class FormRadios extends Component {

  static displayName = "Form.Radios";

  static propTypes = {
    ...sharedPropsValidation,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })).isRequired
  };

  static defaultProps = {
    layout: "horizontal"
  };

  render() {

    const inputClassNames = classNames('form-toggle', 'radio', this.props.layout);

    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        {this.props.options.map((option) => {
          return (
            <label htmlFor={option.value} className={inputClassNames} key={option.value} >
              <Form.Connect.Set {...this.props} value={option.value} >
                <input id={option.value} checked={this.props.value === option.value} type="radio" />
              </Form.Connect.Set>
              <span className="toggle-indicator"></span>
              <span className="toggle-label">{option.label}</span>
            </label>
          );
        })}

      </div>
    );
  }

}

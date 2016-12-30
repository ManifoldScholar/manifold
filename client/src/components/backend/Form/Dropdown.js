import React, { Component, PropTypes } from 'react';
import sharedPropsValidation from './propTypes';
import { Form } from 'components/backend';
import classNames from 'classnames';

export default class Radios extends Component {

  static displayName = "Form.Dropdown";

  static propTypes = {
    ...sharedPropsValidation,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })).isRequired
  };

  static defaultProps = {
    dirtyModel: {},
    actions: { set: () => {} },
    layout: "horizontal"
  };

  render() {

    const inputClassNames = classNames('form-toggle', 'radio', this.props.layout);

    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <div className="form-select">
          <i className="manicon manicon-caret-down"></i>
            <Form.Connect.Set {...this.props}>
              <select>
                {this.props.options.map((option) => {
                  return (
                      <option id={option.value}>{option.label}</option>
                  );
                })}
              </select>
          </Form.Connect.Set>
        </div>
      </div>
    );
  }

}

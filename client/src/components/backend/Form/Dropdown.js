import React, { Component, PropTypes } from 'react';
import sharedPropsValidation from './propTypes';
import { Form } from 'components/backend';
import classNames from 'classnames';

export default class FormDropdown extends Component {

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

  constructor(props) {
    super(props);
  }

  render() {

    const selectClassNames = classNames('form-select');

    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <div className={selectClassNames} >
          <i className="manicon manicon-caret-down"></i>
            <Form.Connect.Set {...this.props}>
              <select>
                {this.props.options.map((option) => {
                  return (
                      <option key={option.value} id={option.value}>
                        {option.label}
                      </option>
                  );
                })}
              </select>
          </Form.Connect.Set>
        </div>
      </div>
    );
  }

}

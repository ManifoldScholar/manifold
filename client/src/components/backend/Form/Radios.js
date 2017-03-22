import React, { Component, PropTypes } from 'react';
import setter from './setter';
import classNames from 'classnames';

class FormRadios extends Component {

  static displayName = "Form.Radios";

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })).isRequired,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
    errors: PropTypes.array,
    layout: PropTypes.string,
    set: PropTypes.func
  };

  static defaultProps = {
    layout: "horizontal"
  };

  render() {
    const inputClassNames = classNames(
      'form-toggle',
      'radio',
      this.props.layout
    );

    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        {this.props.options.map((option) => {
          return (
            <label htmlFor={option.value} className={inputClassNames} key={option.value} >
              <input
                id={option.value}
                checked={this.props.value === option.value}
                onChange={() => { this.props.set(option.value); }}
                type="radio"
              />
              <span className="toggle-indicator"></span>
              <span className="toggle-label">{option.label}</span>
            </label>
          );
        })}

      </div>
    );
  }

}

export default setter(FormRadios);

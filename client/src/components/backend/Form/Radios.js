import React, { Component, PropTypes } from 'react';
import setter from './setter';
import classNames from 'classnames';

class FormRadios extends Component {

  static displayName = "Form.Radios";

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
      className: PropTypes.string
    })).isRequired,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
    errors: PropTypes.array,
    layout: PropTypes.string,
    set: PropTypes.func,
    toggleIcon: PropTypes.string
  };

  static defaultProps = {
    layout: "horizontal"
  };

  render() {
    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        {this.props.options.map((option, index) => {
          const checked = this.props.value === option.value;
          const optionalClass = option.className ? option.className : '';
          const inputClassNames = classNames(
            'form-toggle',
            'radio',
            this.props.layout,
            optionalClass,
            { checked }
          );
          const iconClassNames = classNames(
              'manicon',
              this.props.toggleIcon
            )
          return (
            <label htmlFor={option.value} className={inputClassNames} key={option.value} >
              <input
                type="radio"
                value={option.value}
                id={option.value}
                checked={checked}
                onChange={() => { this.props.set(option.value); }}
              />
              <span className="toggle-indicator">
                {this.props.toggleIcon &&
                  <i className={iconClassNames}></i>
                }
              </span>
              <span className="toggle-label">{option.label}</span>
            </label>
          );
        })}
      </div>
    );
  }

}

export default setter(FormRadios);

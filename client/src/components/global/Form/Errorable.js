import React, { Component, PropTypes } from 'react';
import { Form } from 'components/global';
import classNames from 'classnames';

export default class Errorable extends Component {

  static propTypes = {
    errors: PropTypes.object,
    className: PropTypes.string,
    field: React.PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    children: React.PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  };

  constructor() {
    super();
    this.errorsArray = this.errorsArray.bind(this);
    this.hasErrors = this.hasErrors.bind(this);
  }

  errorsArray() {
    if (Array.isArray(this.props.field)) {
      let errors = [];
      this.props.field.forEach((field) => {
        if (this.props.errors.hasOwnProperty(field)) {
          errors = errors.concat(this.props.errors[field]);
        }
      });
      return errors;
    }
    return this.props.errors[this.props.field] || [];
  }

  hasErrors() {
    const errors = this.errorsArray();
    return errors && errors.length > 0;
  }

  render() {
    const wrapperClass = classNames({
      'form-error': this.hasErrors(),
      [this.props.className]: this.props.className
    });
    return (
      <div {...this.props} className={wrapperClass} >
        {this.props.children}
        <Form.InputError errors={this.errorsArray()} />
      </div>
    );
  }
}

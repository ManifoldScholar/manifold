import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/global';
import classNames from 'classnames';
import brackets2dots from 'brackets2dots';
import humps from 'humps';

export default class Errorable extends PureComponent {

  // If name = "*" this component will show all errors, rather than a specific
  // field error.
  static propTypes = {
    errors: PropTypes.array,
    className: PropTypes.string,
    name: React.PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    children: React.PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  };

  constructor() {
    super();
    this.fieldErrors = this.fieldErrors.bind(this);
  }

  allErrors() {
    if (!this.props.errors) return [];
    return this.props.errors;
  }

  fieldErrors() {
    if (!this.props.errors) return [];
    if (this.props.name === "*") return this.allErrors();
    let names = this.props.name;
    let errors = [];
    if (!Array.isArray(names)) {
      names = [this.props.name];
    }
    names.forEach((name) => {
      const pointer = this.pointerFor(name);
      const pointerErrors = this.props.errors.filter((error) => {
        return error.source.pointer === pointer;
      });
      errors = [...errors, ...pointerErrors];
    });
    return errors;
  }

  pointerFor(name) {
    const dotNotation = brackets2dots(name);
    const jsonPointer = dotNotation.replace(".", "/");
    return `/data/${jsonPointer}`;
  }

  render() {
    const { className, children, errors, label } = this.props;
    const fieldErrors = this.fieldErrors();
    const hasErrors = fieldErrors.length > 0;
    const wrapperClass = classNames({
      'form-error': hasErrors,
      [className]: className
    });

    return (
      <div className={wrapperClass} >
        {children}
        {hasErrors ?
          <Form.InputError errors={fieldErrors} />
        : null}
      </div>
    );
  }
}

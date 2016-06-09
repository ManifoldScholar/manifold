import React, { Component, PropTypes } from 'react';

export default class InputError extends Component {

  static propTypes = {
    errors: PropTypes.array,
  };

  constructor() {
    super();
    this.hasErrors = this.hasErrors.bind(this);
  }

  hasErrors() {
    return this.props.errors.length > 0;
  }

  render() {
    if (this.hasErrors()) {
      return (
        <span className="error">
          {this.props.errors.map((e) => {
            return (e + '. ');
          })}
        </span>
      );
    }
    return null;
  }
}

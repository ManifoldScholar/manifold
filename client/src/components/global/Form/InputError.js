import React, { Component, PropTypes } from 'react';
import get from 'lodash/get';
import isString from 'lodash/isString';
import capitalize from 'lodash/capitalize';
import humps from 'humps';

export default class InputError extends Component {

  static propTypes = {
    errors: PropTypes.array
  };

  constructor() {
    super();
    this.hasErrors = this.hasErrors.bind(this);
  }

  hasErrors() {
    return this.props.errors.length > 0;
  }

  nameFromPointer(pointer) {
    return humps.decamelize(pointer.split("/").pop(), { separator: " " });
  }

  errorString(error) {
    const param = get(error, 'source.param');
    const pointer = get(error, 'source.pointer');
    const name = param || this.nameFromPointer(pointer);
    return capitalize(`${name} ${error.detail}.  `);
  }

  render() {
    if (this.hasErrors()) {
      return (
        <span className="errors">
          {this.props.errors.map((e) => {
            return (
              <span key={e.source.pointer} className="error">
                { this.errorString(e) }
                <br />
              </span>
            );
          })}
        </span>
      );
    }
    return null;
  }
}

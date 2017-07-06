import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/backend';
import { Link } from 'react-router-dom';

export default class FormSave extends Component {

  static displayName = "Form.Save";

  static propTypes = {
    text: PropTypes.string,
    cancelRoute: PropTypes.string
  };

  static defaultProps = {
    text: 'Save'
  };

  render() {
    return (
      <div className="form-input submit">
        {this.props.cancelRoute ?
          <Link
            to={this.props.cancelRoute}
            className="button-secondary outlined dull"
          >
            {'Cancel'}
          </Link>
          : null
        }
        <input
          className="button-secondary outlined"
          type="submit"
          value={this.props.text}
        />
      </div>
    );
  }
}

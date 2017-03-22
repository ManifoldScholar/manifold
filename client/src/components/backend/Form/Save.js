import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class FormSave extends Component {

  static displayName = "Form.Save";

  static propTypes = {
    text: PropTypes.string
  };

  static defaultProps = {
    text: 'Save'
  };

  render() {
    return (
      <div className="form-input submit">
        <input
          className="button-secondary outlined"
          type="submit"
          value={this.props.text}
        />
      </div>
    );
  }
}

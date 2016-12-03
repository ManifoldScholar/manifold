import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class Save extends Component {

  static displayName = "Form.Save";

  static propTypes = {
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="form-input">
        <input className="button-secondary" type="submit" value="Save" />
      </div>
    );
  }
}

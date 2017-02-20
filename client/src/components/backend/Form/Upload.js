import React, { Component, PropTypes } from 'react';
import sharedPropsValidation from './propTypes';
import Dropzone from 'react-dropzone';
import { Form } from 'components/backend';
import { Form as GlobalForm } from 'components/global';

export default class FormUpload extends Component {

  static displayName = "Form.Upload";

  static propTypes = {
    ...sharedPropsValidation,
    label: PropTypes.string,
    background: PropTypes.string,
    accepts: PropTypes.string,
  };

  static defaultProps = {
    style: "thumbnail",
    accepts: "image"
  }

  constructor() {
    super();
    this.handleFileDrop = this.handleFileDrop.bind(this);
  }

  handleFileDrop(file) {
  }

  render() {
    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <Form.Connect.Set manualSet {...this.props} >
          <Form.Helpers.UploadInput
            style={this.props.style}
            current={this.props.current}
            remove={this.props.remove}
            accepts={this.props.accepts}
          />
        </Form.Connect.Set>
      </div>
    );
  }
}

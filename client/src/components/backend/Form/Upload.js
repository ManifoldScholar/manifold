import React, { Component, PropTypes } from 'react';
import sharedPropsValidation from './propTypes';
import Dropzone from 'react-dropzone';
import { Form } from 'components/backend';
import { Form as GlobalForm } from 'components/global';
import classnames from 'classnames';
import isString from 'lodash/isString';

export default class FormUpload extends Component {

  static displayName = "Form.Upload";

  static propTypes = {
    ...sharedPropsValidation,
    label: PropTypes.string,
    instructions: PropTypes.string,
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
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
    return (
      <div className="form-input">
        <label className={labelClass}>{this.props.label}</label>
        {
          isString(this.props.instructions) ?
            <span className="instructions">{this.props.instructions}</span>
          : null
        }
        <Form.Connect.Set manualSet {...this.props} >
          <Form.Helpers.UploadInput
            inlineStyle={this.props.inlineStyle}
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

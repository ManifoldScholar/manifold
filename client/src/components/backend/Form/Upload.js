import React, { Component, PropTypes } from 'react';
import sharedPropsValidation from './propTypes';
import Dropzone from 'react-dropzone';

export default class Upload extends Component {

  static displayName = "Form.Upload";

  static propTypes = {
    label: PropTypes.string
  };

  constructor() {
    super();
    this.handleFileDrop = this.handleFileDrop.bind(this);
  }

  handleFileDrop(file) {
    console.log(file[0] + ' Dropped!');
  }

  render() {
    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <Dropzone
          className="form-dropzone"
          style={{}}
          activeStyle={{}}
          accept="image/*, application/pdf, .doc, .docx, .txt, .md, .pages"
          multiple={false}
          ref="dropzone"
          onDrop={this.handleFileDrop}
        >
          <i className="manicon manicon-cloud-up"></i>
          <p>{'Upload a file or'}<br/>{'drag and drop here'}</p>
        </Dropzone>
      </div>
    );
  }
}

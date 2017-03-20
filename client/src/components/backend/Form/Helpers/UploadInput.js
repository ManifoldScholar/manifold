import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import startsWith from 'lodash/startsWith';
import endsWith from 'lodash/endsWith';
import get from 'lodash/get';

export default class FormUploadInput extends Component {

  static displayName = "Form.Helpers.UploadInput";

  static propTypes = {
    background: PropTypes.string,
    setValue: PropTypes.func,
    onChange: PropTypes.func,
    remove: PropTypes.string,
    value: PropTypes.any,
    current: PropTypes.string,
    inlineStyle: PropTypes.object,
    style: React.PropTypes.oneOf(['square', 'portrait', 'landscape']),
    accepts: PropTypes.string
  };

  static defaultProps = {
    style: "square",
    accepts: "any"
  };

  static types = {
    images: {
      accepts: "image/*",
      extensions: "jpeg, tiff, gif, png"
    },
    audio: {
      accepts: "audio/*",
      extensions: "mp3"
    },
    video: {
      accepts: "video/*",
      extensions: "mp4, webm"
    },
    pdf: {
      accepts: "application/pdf",
      extensions: "pdf"
    },
    document: {
      accepts: "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
        "application/msword,text/*",
      extensions: "doc docx txt"
    },
    spreadsheet: {
      accepts: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
        "application/vnd.ms-excel",
      extensions: "xls xlsx"
    },
    presentation: {
      accepts: "application/vnd.openxmlformats-officedocument.presentationml.presentation," +
        "application/vnd.ms-powerpoint",
      extensions: "ppt pptx"
    },
    texts: {
      accepts: "application/epub+zip,application/zip,text/*",
      extensions: ".epub, .zip, .md"
    },
    json: {
      accepts: "application/json",
      extensions: ".json"
    },
    any: {
      accepts: null,
      extensions: null
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      removed: false,
      attachment: null
    };

    this.setValue = this.setValue.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.attachment) return;
    if (this.state.attachment && prevState.attachment !== this.state.attachment) {
      this.setValue();
    }
  }

  setValue() {
    const reader = new FileReader();
    reader.onload = (e) => {
      const attachment = {
        data: reader.result,
        content_type: this.state.attachment.type,
        filename: this.state.attachment.name
      };
      if (this.props.setValue) this.props.setValue(attachment);
      if (this.props.onChange) this.props.onChange(attachment);
    };
    reader.readAsDataURL(this.state.attachment);
  }

  handleFileDrop(file) {
    this.setState({ attachment: file[0], removed: false });
  }

  handleRemove(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ attachment: null, removed: true });
    if (this.props.setValue) this.props.setValue(null);
    if (this.props.setValue) this.props.setValue(true, this.props.remove);
    if (this.props.onChange) this.props.onChange(null);
  }

  isFile(object) {
    return isObject(object) && object.hasOwnProperty('data');
  }

  displayState(props, state) {
    if (props.value || this.showCurrent(props, state)) {
      if (props.accepts === "images") return 'image-preview';
      return 'file-preview';
    }
    return 'empty';
  }

  accepts(props) {
    const key = props.accepts;
    let config;
    config = get(FormUploadInput.types, key);
    if (!config) config = FormUploadInput.types.any;
    return config;
  }

  showCurrent(props, state) {
    return !state.removed && isString(props.current);
  }

  previewFile(props, state) {
    if (this.isFile(props.value)) return props.value.data;
    if (this.showCurrent(props, state)) {
      return props.current;
    }
  }

  previewFileName(props, state) {
    if (this.isFile(props.value)) return props.value.filename;
    if (this.showCurrent(props, state)) {
      return props.current.split("/").pop().split("?").shift();
    }
  }

  renderImagePreview() {
    return (
      <div className="contents-image-preview">
        <div
          className="preview"
          style={{ backgroundImage: `url(${this.previewFile(this.props, this.state)}` }}
        >
        </div>
        <div className="message">
          <p className="secondary">
            <a
              onClick={this.handleRemove}
              href="#"
            >
              Remove this image
            </a><br />
            or <span className="fake-link">Upload a new image</span>
          </p>
        </div>
      </div>
    );
  }

  renderFilePreview() {
    return (
      <div className="contents-icon-preview">
        <div className="message">
          <i className="manicon manicon-document"></i>
          <p className="primary">
            {this.previewFileName(this.props, this.state)}
          </p>
          <p className="secondary">
            <a
              onClick={this.handleRemove}
              href="#"
            >
              Remove this file
            </a><br />
            or <span className="fake-link">Upload a new file</span>
          </p>
        </div>
      </div>
    );
  }

  renderEmpty() {
    const { extensions } = this.accepts(this.props);
    return (
      <div className="contents-empty">
        <i className="manicon manicon-cloud-up"></i>
        <div className="message">
          <p className="primary">
            {'Upload a file or'}
            <br/>
            {'drag and drop here'}
            <br />
          </p>
          { extensions ?
            <p className="secondary">
              {extensions}
            </p>
          : null }
        </div>
      </div>
    );
  }

  renderBasedOnState() {
    const state = this.displayState(this.props, this.state);
    if (state === "image-preview") return this.renderImagePreview();
    if (state === "file-preview") return this.renderFilePreview();
    return this.renderEmpty();
  }

  render() {

    const dropzoneProps = {};
    const { accepts } = this.accepts(this.props);
    if (accepts) dropzoneProps.accept = accepts;

    return (
      <Dropzone
        style={this.props.inlineStyle}
        className={`form-dropzone style-${this.props.style}`}
        activeStyle={{}}
        multiple={false}
        ref={"dropzone"}
        onDrop={this.handleFileDrop}
        {...dropzoneProps}
      >
        {this.renderBasedOnState()}
      </Dropzone>
    );
  }
}

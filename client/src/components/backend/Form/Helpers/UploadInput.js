import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

export default class FormUploadInput extends Component {

  static displayName = "Form.Helpers.UploadInput";

  static propTypes = {
    background: PropTypes.string,
    setValue: PropTypes.func,
    remove: PropTypes.string,
    value: PropTypes.any,
    current: PropTypes.string,
    style: PropTypes.string
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
      this.props.setValue(attachment);
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
    this.props.setValue(null);
    this.props.setValue(true, this.props.remove);
  }

  isFile(object) {
    return isObject(object) && object.hasOwnProperty('data');
  }

  current() {
    const value = this.props.value;
    if (this.isFile(value)) return value.data;
    if (!this.state.removed && isString(this.props.current)) return this.props.current;
    return null;
  }

  style() {
    const style = {};
    const current = this.current();
    if (current) {
      style.backgroundImage = `url(${current}`;
    }
    return style;
  }

  render() {
    return (
        <Dropzone
          className={`form-dropzone style-${this.props.style}`}
          activeStyle={{}}
          accept="image/*"
          multiple={false}
          ref="dropzone"
          onDrop={this.handleFileDrop}
        >
          <a className="remove"
            onClick={this.handleRemove}
          >
            Remove
          </a>
          <div
            style={this.style()}
            className="background"
          ></div>
          <div className="contents">
            <i className="manicon manicon-cloud-up"></i>
            <p>
              {'Upload a file or'}
              <br/>
              {'drag and drop here'}
              <br />
            </p>
          </div>
        </Dropzone>
    );
  }
}

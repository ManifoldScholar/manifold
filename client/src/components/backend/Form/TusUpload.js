import React, { Component } from "react";
import PropTypes from "prop-types";
import tus from 'tus-js-client';
import uniqueId from "lodash/uniqueId";
import Dropzone from "react-dropzone";
import { Form as GlobalForm } from "components/global";
import classnames from "classnames";
import isString from "lodash/isString";
import isObject from "lodash/isObject";
import get from "lodash/get";
import setter from "./setter";
import Instructions from "./Instructions";


export class FormTusUpload extends Component {
  static types = {
    any: {
      accepts: null,
      extensions: null
    }
  };

  static displayName = "Form.TusUpload";

  static propTypes = {
    set: PropTypes.func.isRequired, // set is called when the value changes
    setOther: PropTypes.func, // used to set another prop, eg removed, in session
    label: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    inlineStyle: PropTypes.object,
    name: PropTypes.string, // name of the model field: attributes[avatar]
    layout: PropTypes.oneOf([
      "square",
      "portrait",
      "landscape",
      "horizontal",
      "embed"
    ]),
    placeholder: PropTypes.string, // Allows override of placeholder graphic
    remove: PropTypes.string, // name of the model remove field: attributes[removeAvatar]
    accepts: PropTypes.string,
    value: PropTypes.any, // the current value of the field in the connected model
    initialValue: PropTypes.string, // the initial value of the input when it's rendered
    errors: PropTypes.array,
    inputId: PropTypes.string,
    idForError: PropTypes.string
  };

  static defaultProps = {
    layout: "square",
    accepts: "any",
    inputId: uniqueId("upload-"),
    idForError: uniqueId("upload-error-")
  };

  constructor(props) {
    super(props);

    this.state = {
      removed: false,
      attachment: null
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state !== prevState) this.setValueFromCurrentState();
  }

  setValueFromCurrentState = () => {
    const { attachment, removed } = this.state;
    const { set, setOther, remove: removeName } = this.props;
    if (setOther && removeName) setOther(removed, removeName);
    if (attachment) {
      const { type: mime_type, size, name: filename } = attachment;

      const upload = new tus.Upload(attachment, {
        chunkSize: 5*1024*1024,
        endpoint: "/api/files",
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {
          filename,
          mime_type
        },
        onError: function(_err) {},
        onProgress: function(_bytesUploaded, _bytesTotal) {
          //const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
          //console.log(bytesUploaded, bytesTotal, percentage + "%");
        },
        onSuccess: function() {
          const source = {
            id: upload.url,
            storage: 'cache',
            metadata: {
              filename,
              size,
              mime_type
            }
          };

          set(source);
        }
      })

      upload.start();
    } else {
      set(null);
    }
  };

  handleFileDrop = file => {
    this.setState({ attachment: file[0], removed: false });
  };

  handleRemove = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ attachment: null, removed: true });
  };

  isFile(object) {
    return isObject(object) && object.hasOwnProperty("data");
  }

  displayState(props, state) {
    if (props.value || this.showInitialValue(props, state)) {
      return "file-preview";
    }
    return "empty";
  }

  accepts(_props) {
    return FormTusUpload.types.any;
  }

  showInitialValue(props, state) {
    return (
      !state.removed &&
      isString(props.initialValue) &&
      props.initialValue !== ""
    );
  }

  previewFile(props, state) {
    if (this.isFile(props.value)) return props.value.data;
    if (this.showInitialValue(props, state)) {
      return props.initialValue;
    }
  }

  previewFileName(props, state) {
    if (this.isFile(props.value)) return props.value.filename;
    if (this.showInitialValue(props, state)) {
      return props.initialValue;
    }
  }

  renderFilePreview() {
    return (
      <div className="contents-icon-preview">
        <div className="message" data-id="preview">
          <i className="manicon manicon-document" aria-hidden="true" />
          <p className="primary">
            {this.previewFileName(this.props, this.state)}
          </p>
          <p className="secondary">
            <span
              role="button"
              tabIndex="0"
              className="fake-link"
              onClick={this.handleRemove}
              href="#"
            >
              Remove this file
            </span>
            <br />
            or{" "}
            <span className="fake-link" role="button" tabIndex="0">
              Upload a new file
            </span>
          </p>
        </div>
      </div>
    );
  }

  renderEmpty() {
    const { extensions } = this.accepts(this.props);
    return (
      <div className="contents-empty">
        {this.props.placeholder === "cover" ? (
          <GlobalForm.CoverUploadPlaceholder />
        ) : (
          <i className="manicon manicon-cloud-up" aria-hidden="true" />
        )}
        <div className="message">
          <p className="primary">
            <span className="fake-link" role="button" tabIndex="0">
              {"Upload a file"}
            </span>
            {" or "}
            <br />
            {"drag and drop here"}
            <br />
          </p>
          {extensions ? <p className="secondary">{extensions}</p> : null}
        </div>
      </div>
    );
  }

  renderBasedOnState() {
    const state = this.displayState(this.props, this.state);
    if (state === "file-preview") return this.renderFilePreview();
    return this.renderEmpty();
  }

  render() {
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
    const inputProps = {
      id: this.props.inputId,
      "aria-describedby": this.props.idForError
    };
    const dropzoneProps = {};
    const { accepts } = this.accepts(this.props);
    if (accepts) dropzoneProps.accept = accepts;
    return (
      <div className="form-input">
        <GlobalForm.Errorable
          className="form-input"
          name={this.props.name}
          errors={this.props.errors}
          label={this.props.label}
          idForError={this.props.idForError}
        >
          {this.props.label ? (
            <label htmlFor={this.props.inputId} className={labelClass}>
              {this.props.label}
            </label>
          ) : null}
          <Instructions instructions={this.props.instructions} />
          <Dropzone
            inputProps={inputProps}
            style={this.props.inlineStyle}
            className={`form-dropzone style-${this.props.layout}`}
            multiple={false}
            ref={dropzone => {
              this.dropzone = dropzone;
            }}
            onDrop={this.handleFileDrop}
            {...dropzoneProps}
          >
            {this.renderBasedOnState()}
          </Dropzone>
        </GlobalForm.Errorable>
      </div>
    );
  }
}

export default setter(FormTusUpload);

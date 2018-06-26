import React, { Component } from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import Dropzone from "react-dropzone";
import { Form as GlobalForm } from "components/global";
import classnames from "classnames";
import isString from "lodash/isString";
import isObject from "lodash/isObject";
import get from "lodash/get";
import setter from "./setter";
import Instructions from "./Instructions";

export class FormUpload extends Component {
  static displayName = "Form.Upload";

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
    errors: PropTypes.array
  };

  static defaultProps = {
    layout: "square",
    accepts: "any"
  };

  static types = {
    images: {
      accepts: "image/*",
      extensions: "gif, jpeg, jpg, png, svg"
    },
    audio: {
      accepts: "audio/*",
      extensions: "mp3, flac, wma, wav, mid, ogg, oga"
    },
    video: {
      accepts: "video/*",
      extensions: "mp4, webm, flv, wmv, mov, avi"
    },
    pdf: {
      accepts: "application/pdf",
      extensions: "pdf"
    },
    document: {
      accepts:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
        "application/msword,text/*," +
        "application/vnd.oasis.opendocument.text",
      extensions: "doc, docx, txt, odt"
    },
    csv: {
      accepts: "text/plain, text/csv",
      extensions: "txt, csv"
    },
    spreadsheet: {
      accepts:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
        "application/vnd.ms-excel," +
        "application/vnd.oasis.opendocument.spreadsheet,",
      extensions: "xls, xlsx, ods"
    },
    presentation: {
      accepts:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation," +
        "application/vnd.ms-powerpoint," +
        "application/vnd.oasis.opendocument.presentation",
      extensions: "ppt, pptx, odp"
    },
    texts: {
      accepts: "application/epub+zip,application/zip,text/*",
      extensions: "epub, zip, md"
    },
    json: {
      accepts: "application/json",
      extensions: "json"
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
  }

  componentDidMount() {
    this.id = uniqueId("upload-");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state !== prevState) this.setValueFromCurrentState();
  }

  setValueFromCurrentState = () => {
    const { attachment, removed } = this.state;
    const { set, setOther, remove: removeName } = this.props;
    if (setOther && removeName) setOther(removed, removeName);
    if (attachment) {
      const { type, name } = attachment;
      const reader = new FileReader();
      reader.onload = eventIgnored => {
        set({ data: reader.result, content_type: type, filename: name });
      };
      reader.readAsDataURL(attachment);
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
      if (props.accepts === "images") return "image-preview";
      return "file-preview";
    }
    return "empty";
  }

  accepts(props) {
    const key = props.accepts;
    let config;
    config = get(FormUpload.types, key);
    if (!config) config = FormUpload.types.any;
    return config;
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
      // return props.initialValue.split("/").pop().split("-").shift();
    }
  }

  renderImagePreview() {
    return (
      <div className="contents-image-preview">
        <div
          data-id="preview"
          className="preview"
          style={{
            backgroundImage: `url(${this.previewFile(this.props, this.state)})`
          }}
        >
          <span className="screen-reader-text">Upload Preview</span>
        </div>
        <div className="message">
          <p className="secondary">
            <span
              role="button"
              data-id="remove"
              className="fake-link"
              onClick={this.handleRemove}
            >
              Remove this image
            </span>
            <br />
            or{" "}
            <span className="fake-link" role="button">
              Upload an image
            </span>
          </p>
        </div>
      </div>
    );
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
              className="fake-link"
              onClick={this.handleRemove}
              href="#"
            >
              Remove this file
            </span>
            <br />
            or{" "}
            <span className="fake-link" role="button">
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
            <span className="fake-link" role="button">
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
    if (state === "image-preview") return this.renderImagePreview();
    if (state === "file-preview") return this.renderFilePreview();
    return this.renderEmpty();
  }

  render() {
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
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
        >
          {this.props.label ? (
            <label htmlFor={this.id} className={labelClass}>
              {this.props.label}
            </label>
          ) : null}
          <Instructions instructions={this.props.instructions} />
          <Dropzone
            id={this.id}
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

export default setter(FormUpload);

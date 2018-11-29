import React, { Component } from "react";
import PropTypes from "prop-types";
import labelId from "helpers/labelId";
import Dropzone from "react-dropzone";
import { Form as GlobalForm } from "components/global";
import classnames from "classnames";
import isString from "lodash/isString";
import Instructions from "../Instructions";
import Empty from "./Empty";
import Preview from "./Preview";

export default class FormUpload extends Component {
  static displayName = "Form.Upload.Base";

  static propTypes = {
    updateValue: PropTypes.func.isRequired, // set is called when the value changes
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
    accepts: PropTypes.object,
    value: PropTypes.any, // the current value of the field in the connected model
    initialValue: PropTypes.string, // the initial value of the input when it's rendered
    errors: PropTypes.array,
    inputId: PropTypes.string,
    idForError: PropTypes.string,
    wide: PropTypes.bool,
    progress: PropTypes.string,
    uploadError: PropTypes.string
  };

  static defaultProps = {
    layout: "square",
    accepts: null,
    wide: false,
    inputId: labelId("upload-"),
    idForError: labelId("upload-error-")
  };

  constructor(props) {
    super(props);
    this.state = {
      removed: false,
      attachment: null
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.attachment !== prevState.attachment ||
      this.state.removed !== prevState.removed
    ) {
      this.props.updateValue(this.state);
    }
  }

  get previewable() {
    if (this.currentPreview) return true;
    return false;
  }

  get currentPreview() {
    if (this.state.removed) return null;
    if (this.props.value) return this.props.value;
    if (this.props.initialValue) return this.props.initialValue;
    return null;
  }

  handleFileDrop = file => {
    this.setState({ attachment: file[0], removed: false });
  };

  handleRemove = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ attachment: null, removed: true });
  };

  render() {
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
    const inputClasses = classnames({
      "form-input": true,
      wide: this.props.wide
    });
    const inputProps = {
      id: this.props.inputId,
      "aria-describedby": this.props.idForError
    };
    return (
      <div className={inputClasses}>
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
          <Dropzone
            inputProps={inputProps}
            style={this.props.inlineStyle}
            className={`form-dropzone style-${this.props.layout}`}
            multiple={false}
            ref={dropzone => {
              this.dropzone = dropzone;
            }}
            onDrop={this.handleFileDrop}
            accepts={this.props.accepts}
          >
            {this.previewable ? (
              <Preview
                preview={this.currentPreview}
                handleRemove={this.handleRemove}
              />
            ) : (
              <Empty
                accepts={this.props.accepts}
                progress={this.props.progress}
                uploadError={this.props.uploadError}
                placeholder={this.props.placeholder}
              />
            )}
          </Dropzone>
          <Instructions instructions={this.props.instructions} />
        </GlobalForm.Errorable>
      </div>
    );
  }
}

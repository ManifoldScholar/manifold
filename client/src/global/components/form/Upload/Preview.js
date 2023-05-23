import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ImagePreview from "./ImagePreview";
import FilePreview from "./FilePreview";
import head from "lodash/head";
import split from "lodash/split";
import has from "lodash/has";
import isString from "lodash/isString";
import isObject from "lodash/isObject";
import startsWith from "lodash/startsWith";

const path = require("path");

export default class FormUploadPreview extends PureComponent {
  static propTypes = {
    preview: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    handleRemove: PropTypes.func,
    fileName: PropTypes.string
  };

  get isImage() {
    if (
      this.currentPreviewIsFileObject &&
      startsWith(this.currentPreview.content_type, "image/")
    )
      return true;
    if (this.currentPreviewIsPath) {
      const ext = this.currentPreviewExtension;
      return (
        startsWith(ext, ".png") ||
        startsWith(ext, ".gif") ||
        startsWith(ext, ".jpg") ||
        startsWith(ext, ".jpeg") ||
        startsWith(ext, ".svg")
      );
    }
    return false;
  }

  get currentPreview() {
    return this.props.preview;
  }

  get currentPreviewIsUrl() {
    return RegExp("^https?://", "i").test(this.currentPreview);
  }

  get currentPreviewIsAbsolutePath() {
    return startsWith(this.currentPreview, "/");
  }

  get currentPreviewIsPath() {
    return this.currentPreviewIsUrl || this.currentPreviewIsAbsolutePath;
  }

  get currentPreviewIsString() {
    return isString(this.currentPreview);
  }

  get currentPreviewIsFileObject() {
    const file = this.currentPreview;
    // JS File Object
    if (!isObject(file)) return false;
    if (file.hasOwnProperty("data")) return true;
    // Tus Upload Object
    return file.hasOwnProperty("id");
  }

  get previewFileName() {
    if (!this.previewable) return null;
    if (this.currentPreviewIsPath)
      return this.fileNameForPath(this.currentPreview);
    if (this.currentPreviewIsString) return this.currentPreview;
    return this.fileNameForObject(this.currentPreview);
  }

  get currentPreviewExtension() {
    const filename = this.fileNameForPath(this.currentPreview);
    return path.extname(filename).toLowerCase();
  }

  get previewable() {
    return this.currentPreviewIsString || this.currentPreviewIsFileObject;
  }

  fileNameForObject(fileObject) {
    // It's a regular JS File Object, and we get it from filename.
    if (fileObject.hasOwnProperty("filename")) return fileObject.filename;
    // It was a Tus Upload, in which case it's structured differently.
    if (has(fileObject, "metadata.filename")) {
      return fileObject.metadata.filename;
    }
    // We don't know what it is.
    /* eslint-disable no-console */
    console.log(
      "Form.Upload.Preview component passed a file object with an unexpected shape."
    );
    /* eslint-enable no-console */
    return "";
  }

  fileNameForPath(pathString) {
    if (this.props.fileName) return this.props.fileName;
    return head(split(path.basename(pathString), "?"));
  }

  render() {
    const childProps = {
      handleRemove: this.props.handleRemove,
      isBuilder: this.props.isBuilder
    };
    if (this.isImage)
      return <ImagePreview image={this.currentPreview} {...childProps} />;
    return <FilePreview fileName={this.previewFileName} {...childProps} />;
  }
}

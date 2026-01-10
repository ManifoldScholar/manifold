import { useState, useCallback, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFormField } from "hooks";
import Base from "./Upload/Base";
import { Upload } from "tus-js-client";
import config from "config";

export function FormTusUpload({ name, layout = "square", ...baseProps }) {
  const id = useId();
  const { t } = useTranslation();
  const { value, initialValue, set, errors } = useFormField(name);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  const removeFile = useCallback(() => {
    set(null);
    setProgress(null);
    setError(null);
  }, [set]);

  const handleUploadError = useCallback(
    err => {
      // eslint-disable-next-line no-console
      console.log(err, "TUS Upload Error");
      setError(t("errors.upload_failed"));
    },
    [t]
  );

  const handleUploadProgress = useCallback((bytesUploaded, bytesTotal) => {
    const pct = ((bytesUploaded / bytesTotal) * 100).toFixed(0);
    setProgress(pct);
  }, []);

  const handleUploadSuccess = useCallback(
    (tusUpload, attachment) => {
      const { type: mimeType, size, name: filename } = attachment;
      const source = {
        id: tusUpload.url,
        storage: "cache",
        metadata: {
          filename,
          size,
          mimeType
        }
      };
      set(source);
    },
    [set]
  );

  const updateValue = useCallback(
    state => {
      const { attachment } = state;
      if (attachment) {
        const { type: mimeType, name: filename } = attachment;
        const upload = new Upload(attachment, {
          chunkSize: 5 * 1024 * 1024,
          endpoint: config.services.api + "/api/files",
          retryDelays: [0, 1000, 3000, 5000],
          metadata: {
            filename,
            mimeType
          },
          onError: handleUploadError,
          onProgress: handleUploadProgress,
          onSuccess: () => handleUploadSuccess(upload, attachment)
        });
        setProgress(null);
        setError(null);
        upload.start();
      } else {
        removeFile();
      }
    },
    [handleUploadError, handleUploadProgress, handleUploadSuccess, removeFile]
  );

  return (
    <Base
      {...baseProps}
      name={name}
      value={value}
      initialValue={initialValue}
      errors={errors}
      layout={layout}
      accepts={{
        accepts: null,
        extensions: null
      }}
      progress={progress}
      uploadError={error}
      updateValue={updateValue}
      inputId={`upload-${id}`}
      idForError={`upload-error-${id}`}
      idForInstructions={`upload-instructions-${id}`}
    />
  );
}

FormTusUpload.displayName = "Form.TusUpload";

FormTusUpload.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  inlineStyle: PropTypes.object,
  layout: PropTypes.oneOf([
    "square",
    "portrait",
    "landscape",
    "horizontal",
    "embed"
  ]),
  placeholder: PropTypes.string,
  remove: PropTypes.string
};

export default FormTusUpload;

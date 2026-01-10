import { useCallback, useId } from "react";
import PropTypes from "prop-types";
import { useFormField } from "hooks";
import Base from "./Base";
import UserAvatar from "./UserAvatar";
import get from "lodash/get";

const UPLOAD_TYPES = {
  images: {
    accepts: "image/*",
    extensions: "gif, jpeg, jpg, png"
  },
  audio: {
    accepts: "audio/*",
    extensions: "mp3, flac, wav, ogg, oga"
  },
  video: {
    accepts: "video/x-flv,video/*",
    extensions: "mp4, webm, flv, mov, avi"
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
    accepts: "text/*,",
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
  vtt: {
    accepts: "text/vtt",
    extensions: "vtt"
  },
  any: {
    accepts: null,
    extensions: null
  }
};

export function FormUpload({
  name,
  remove,
  accepts: acceptsKey = "any",
  layout = "square",
  isUserAvatar,
  isBuilder,
  ...baseProps
}) {
  const id = useId();
  const { value, initialValue, set, errors } = useFormField(name);

  const updateValue = useCallback(
    state => {
      const { attachment, removed } = state;
      if (remove) set(removed, true, remove);
      if (attachment) {
        const { type, name: fileName } = attachment;
        const reader = new FileReader();
        reader.onload = () => {
          set({ data: reader.result, content_type: type, filename: fileName });
        };
        reader.readAsDataURL(attachment);
      } else {
        set(null);
      }
    },
    [set, remove]
  );

  const acceptsConfig = get(UPLOAD_TYPES, acceptsKey) || UPLOAD_TYPES.any;

  return isUserAvatar ? (
    <UserAvatar
      {...baseProps}
      name={name}
      value={value}
      initialValue={initialValue}
      errors={errors}
      layout={layout}
      updateValue={updateValue}
      inputId={`upload-${id}`}
      idForInstructions={`upload-instructions-${id}`}
    />
  ) : (
    <Base
      {...baseProps}
      name={name}
      value={value}
      initialValue={initialValue}
      errors={errors}
      layout={layout}
      accepts={acceptsConfig}
      updateValue={updateValue}
      inputId={`upload-${id}`}
      idForError={`upload-error-${id}`}
      idForInstructions={`upload-instructions-${id}`}
      isBuilder={isBuilder}
    />
  );
}

FormUpload.displayName = "Form.Upload";

// Expose types for external use
FormUpload.types = UPLOAD_TYPES;

FormUpload.propTypes = {
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
  remove: PropTypes.string,
  accepts: PropTypes.string,
  fileNameFrom: PropTypes.string,
  instructionsSingleLine: PropTypes.bool,
  isUserAvatar: PropTypes.bool,
  isBuilder: PropTypes.bool
};

export default FormUpload;

import { useState, useRef, useEffect, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import GlobalForm from "global/components/form";
import ReadingGroupPicker from "./ReadingGroupPicker";
import useSubmitAnnotation from "./hooks/useSubmitAnnotation";
import useReadingGroups from "./hooks/useReadingGroups";
import useUnverifiedMessage from "./hooks/useUnverifiedMessage";
import * as Styled from "./styles";

export default function AnnotationEditor({
  annotation = { attributes: {} },
  cancel,
  closeOnSave = true,
  readingGroups = [],
  saveAnnotation
}) {
  const { t } = useTranslation();

  const [body, setBody] = useState(annotation.attributes.body || "");
  const textareaId = useId();
  const textareaRef = useRef(null);

  const {
    adjustedReadingGroups,
    shouldShowReadingGroups,
    canEngagePublicly,
    canAccessReadingGroups,
    currentGroupId,
    currentGroupData
  } = useReadingGroups({
    annotation,
    readingGroups
  });

  const showUnverifiedMessage = useUnverifiedMessage(
    currentGroupId,
    currentGroupData
  );

  const disableSubmit = /^\s*$/.test(body) || showUnverifiedMessage;

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  const { handleSubmit, errors, loading } = useSubmitAnnotation({
    annotation,
    body,
    readingGroupId: currentGroupId,
    saveAnnotation,
    closeOnSave,
    cancel
  });

  const handleBodyChange = event => {
    setBody(event.target.value);
  };

  const handleCancel = event => {
    if (event) event.preventDefault();
    if (cancel) {
      cancel(event);
    }
  };

  return (
    <div className="annotation-editor">
      <form onSubmit={handleSubmit}>
        <GlobalForm.Errorable
          name="attributes[body]"
          errors={errors}
          idForError="annotation-textarea-error"
        >
          <label htmlFor={textareaId} className="screen-reader-text">
            {t("reader.actions.annotate_passage")}
          </label>
          <textarea
            ref={textareaRef}
            id={textareaId}
            aria-describedby="annotation-textarea-error"
            aria-required="true"
            style={{ width: "100%" }}
            placeholder={`${t("reader.actions.annotate_passage")}...`}
            onChange={handleBodyChange}
            value={body}
            className="annotation-editor__textarea"
          />
        </GlobalForm.Errorable>

        <div className="annotation-editor__actions">
          {shouldShowReadingGroups && (
            <ReadingGroupPicker
              adjustedReadingGroups={adjustedReadingGroups}
              currentGroupId={currentGroupId}
              currentGroupData={currentGroupData}
              canEngagePublicly={canEngagePublicly}
              canAccessReadingGroups={canAccessReadingGroups}
            />
          )}
          <div className="annotation-editor__buttons">
            <button
              type="button"
              onClick={handleCancel}
              className="button-primary button-primary--gray"
            >
              <span className="button-primary__text">
                {t("actions.cancel")}
              </span>
            </button>
            <button
              type="submit"
              className="button-secondary"
              disabled={disableSubmit || loading}
            >
              {t("actions.save")}
            </button>
          </div>
        </div>
      </form>
      {showUnverifiedMessage && (
        <Styled.UnverifiedMessage>
          {t("reader.menus.notes.unverified_message")}
        </Styled.UnverifiedMessage>
      )}
    </div>
  );
}

AnnotationEditor.displayName = "Annotation.Editor";

AnnotationEditor.propTypes = {
  annotation: PropTypes.object,
  cancel: PropTypes.func,
  closeOnSave: PropTypes.bool,
  sectionId: PropTypes.string,
  readingGroups: PropTypes.array,
  saveAnnotation: PropTypes.func.isRequired
};

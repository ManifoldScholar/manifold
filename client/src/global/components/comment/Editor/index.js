import { useState, useRef, useEffect, useCallback, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { singularEntityName } from "utils/entityUtils";
import { commentsAPI } from "api";
import { useThread } from "../Thread/Context";
import useApiCallback from "hooks/api/useApiCallback";
import * as Styled from "./styles";
import GlobalForm from "global/components/form";
import Authorize from "hoc/Authorize";

const idPrefix = "comment-textarea";
const idForErrorPrefix = "comment-textarea-error";

export default function CommentEditor({
  comment,
  parentId,
  label,
  placeholder: placeholderProp,
  cancel,
  initialOpen = false
}) {
  const { t } = useTranslation();
  const { subject, showLogin, addComment } = useThread();
  const uid = useId();
  const textAreaRef = useRef(null);
  const loginRef = useRef(null);

  // eslint-disable-next-line no-nested-ternary
  const mode = comment ? "edit" : parentId ? "reply" : "comment";
  const isEdit = mode === "edit";
  const isReply = mode === "reply";
  const isComment = mode === "comment";

  const [body, setBody] = useState(isEdit ? comment.attributes.body : "");
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    if (open || !isComment) {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      } else if (loginRef.current) {
        loginRef.current.focus();
      }
    }
  });

  const createComment = useApiCallback(commentsAPI.create);
  const updateComment = useApiCallback(commentsAPI.update);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();
      const payload = { body, parentId };
      try {
        let response;
        if (isEdit) {
          response = await updateComment(comment.id, payload);
        } else {
          response = await createComment(subject, payload);
        }
        setBody(isEdit ? comment.attributes.body : "");
        setErrors([]);
        setOpen(false);
        addComment(response?.data);
        if (cancel) cancel();
      } catch (response) {
        setErrors(response?.body?.errors ?? []);
      }
    },
    [
      body,
      parentId,
      isEdit,
      comment,
      subject,
      createComment,
      updateComment,
      addComment,
      cancel
    ]
  );

  const submitOnReturnKey = useCallback(
    event => {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        handleSubmit(event);
      }
    },
    [handleSubmit]
  );

  const handleBodyChange = event => {
    setBody(event.target.value);
  };

  const toggleOpen = () => setOpen(prev => !prev);

  const placeholderText = (() => {
    if (placeholderProp) return placeholderProp;
    if (isEdit) return t("placeholders.comments.edit");
    if (isReply) return t("placeholders.comments.reply");
    if (isComment) {
      return t("placeholders.comments.discuss_entity", {
        entity: singularEntityName(subject)
      });
    }
  })();

  const buttonLabel = isEdit ? t("actions.update") : t("actions.post");

  const formLabel = (() => {
    if (label) return label;
    if (isEdit) return t("actions.edit");
    if (isReply) return t("actions.reply");
  })();

  return (
    <Styled.Editor>
      {label ? (
        <Styled.Label
          label={label}
          onClick={toggleOpen}
          aria-expanded={open}
          postIcon="interactComment24"
          size="md"
          shape="lozenge"
          background="outline-accent"
        />
      ) : null}
      {(open || !isComment) && (
        <>
          <Authorize kind="unauthenticated">
            <Styled.Placeholder onClick={showLogin} ref={loginRef}>
              {t("placeholders.comments.unauthenticated")}
            </Styled.Placeholder>
          </Authorize>
          <Authorize kind="any">
            <form onSubmit={handleSubmit} aria-labelledby={formLabel}>
              <GlobalForm.Errorable
                name="attributes[body]"
                errors={errors}
                idForError={`${idForErrorPrefix}-${uid}`}
              >
                <label
                  htmlFor={`${idPrefix}-${uid}`}
                  className="screen-reader-text"
                >
                  {placeholderText}
                </label>
                <Styled.TextArea
                  ref={textAreaRef}
                  id={`${idPrefix}-${uid}`}
                  onKeyDown={submitOnReturnKey}
                  placeholder={placeholderText}
                  onChange={handleBodyChange}
                  value={body}
                  aria-describedby={`${idForErrorPrefix}-${uid}`}
                />
                <Styled.Actions>
                  <Styled.Buttons>
                    <button
                      type="button"
                      onClick={cancel ?? toggleOpen}
                      className="button-primary button-primary--gray"
                    >
                      {t("actions.cancel")}
                    </button>
                    <button className="button-secondary" disabled={!body}>
                      {buttonLabel}
                    </button>
                  </Styled.Buttons>
                </Styled.Actions>
              </GlobalForm.Errorable>
            </form>
          </Authorize>
        </>
      )}
    </Styled.Editor>
  );
}

CommentEditor.displayName = "Comment.Editor";

CommentEditor.propTypes = {
  comment: PropTypes.object,
  parentId: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  cancel: PropTypes.func,
  initialOpen: PropTypes.bool
};

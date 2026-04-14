import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line import/no-cycle
import CommentThread from "../Thread";
import CommentEditor from "../Editor";
import { useThread } from "../Thread/Context";
import Meta from "../meta";
import Deleted from "../deleted";
import Helper from "components/global/helper";
import FlagToggle from "components/global/Annotation/Annotation/UserContent/Flag/Toggle";
import * as Styled from "components/global/Annotation/Annotation/UserContent/styles";
import Authorize from "hoc/Authorize";

export default function CommentDetail({ comment, parent }) {
  const { t } = useTranslation();
  const { showLogin, handleDelete, handleRestore, handleDestroy } = useThread();

  const [editor, setEditor] = useState(null);
  const [editorKey, setEditorKey] = useState(0);
  const replyToggleRef = useRef(null);
  const editToggleRef = useRef(null);

  const startEdit = () => {
    setEditor("edit");
    setEditorKey(k => k + 1);
  };

  const startReply = () => {
    setEditor("reply");
    setEditorKey(k => k + 1);
  };

  const stopEdit = useCallback(() => {
    setEditor(null);
    if (editToggleRef.current) editToggleRef.current.focus();
  }, []);

  const stopReply = useCallback(() => {
    setEditor(null);
    if (replyToggleRef.current) replyToggleRef.current.focus();
  }, []);

  const renderEditor = () => {
    if (!editor) return null;
    if (editor === "reply") {
      return (
        <CommentEditor
          key={editorKey}
          parentId={comment.id}
          cancel={stopReply}
        />
      );
    }
    if (editor === "edit") {
      return (
        <CommentEditor key={editorKey} comment={comment} cancel={stopEdit} />
      );
    }
    return null;
  };

  const { attributes } = comment;
  if (attributes.deleted && !attributes.abilities.readDeleted) {
    return <Deleted comment={comment} />;
  }

  const { creator } = comment.relationships;

  return (
    <li className="annotation-reply">
      <Meta comment={comment} creator={creator} parent={parent} />
      <Styled.Body>
        <Helper.SimpleFormat text={comment.attributes.body} />
      </Styled.Body>
      <Authorize kind={"any"}>
        <Styled.Utility>
          {editor !== "edit" && (
            <Styled.UtilityList $isFlagged={comment.attributes.flagged}>
              <Authorize entity={comment} ability={"create"}>
                <li>
                  <Styled.Button
                    ref={replyToggleRef}
                    onClick={editor === "reply" ? stopReply : startReply}
                    aria-expanded={editor === "reply"}
                  >
                    {t("actions.reply")}
                  </Styled.Button>
                </li>
              </Authorize>
              <Authorize entity={comment} ability={"update"}>
                <li>
                  <Styled.Button
                    ref={editToggleRef}
                    onClick={startEdit}
                    aria-expanded={editor === "edit"}
                  >
                    {t("actions.edit")}
                  </Styled.Button>
                </li>
              </Authorize>
              <Authorize entity={comment} ability={"delete"}>
                <li>
                  <Styled.Button
                    onClick={() =>
                      comment.attributes.deleted
                        ? handleRestore(comment)
                        : handleDelete(comment)
                    }
                  >
                    {comment.attributes.deleted
                      ? t("actions.restore")
                      : t("actions.delete")}
                  </Styled.Button>
                </li>
              </Authorize>
              {comment.attributes.deleted && (
                <li>
                  <Styled.Button onClick={() => handleDestroy(comment)}>
                    {t("actions.destroy")}
                  </Styled.Button>
                </li>
              )}
              <li>
                <FlagToggle record={comment} />
              </li>
            </Styled.UtilityList>
          )}
          {renderEditor()}
        </Styled.Utility>
      </Authorize>
      <Authorize kind="unauthenticated">
        <Styled.Utility>
          <Styled.UtilityList>
            <li>
              <Styled.Button onClick={showLogin}>
                {t("actions.login_to_reply")}
              </Styled.Button>
            </li>
          </Styled.UtilityList>
        </Styled.Utility>
      </Authorize>
      <CommentThread parentId={comment.id} parent={comment} />
    </li>
  );
}

CommentDetail.displayName = "Comment.Detail";

CommentDetail.propTypes = {
  comment: PropTypes.object.isRequired,
  parent: PropTypes.object
};

import { useState, useRef, useCallback, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Helper from "global/components/helper";
import useDialog from "@castiron/hooks/useDialog";
import Utility from "frontend/components/utility";
import Editor from "../../Editor";
import Meta from "./Meta";
import BlockToggle from "./BlockToggle";
import InlineToggle from "./InlineToggle";
import FlagToggle from "./Flag/Toggle";
import CommentContainer from "global/containers/comment";
import { annotationsAPI } from "api";
import Authorize from "hoc/Authorize";
import { useCurrentUser, useRevalidate } from "hooks";
import useApiCallback from "hooks/api/useApiCallback";
import * as Styled from "./styles";

export default function AnnotationDetail({
  includeComments = true,
  includeMarkers,
  markerIcons,
  annotation,
  showCommentsToggleAsBlock,
  showLogin,
  refresh,
  closeDrawer,
  readingGroups
}) {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const revalidate = useRevalidate();

  const { readingGroupPrivacy, commentsCount } = annotation?.attributes ?? {};
  const isAnonymous = readingGroupPrivacy === "anonymous";

  const [action, setAction] = useState();
  const [showComments, setShowComments] = useState(
    includeComments && !isAnonymous
  );

  const threadRef = useRef(null);
  const replyToggleRef = useRef(null);
  const editUID = useId();
  const editDialog = useDialog({ modal: false, dismissalMode: "explicit" });

  const handleEditKeyDown = e => {
    // Prevent the event from bubbling up to the main dialog
    e.stopPropagation();
  };

  const startReply = () => {
    setAction("replying");
  };

  const startEdit = () => {
    editDialog.onToggleClick();
  };

  const stopReply = () => {
    setAction(null);

    if (replyToggleRef.current) replyToggleRef.current.focus();
  };

  const stopEdit = () => {
    editDialog.onCloseClick();
  };

  const updateAnnotation = useApiCallback(annotationsAPI.update);

  const saveAnnotation = useCallback(
    async data => {
      const result = await updateAnnotation(data.id, data.attributes);
      revalidate();
      return result;
    },
    [updateAnnotation, revalidate]
  );

  const destroyAnnotation = useApiCallback(annotationsAPI.destroy);

  const deleteAnnotation = useCallback(async () => {
    await destroyAnnotation(annotation.id);
    revalidate();
    if (closeDrawer) closeDrawer();
  }, [annotation.id, destroyAnnotation, closeDrawer, revalidate]);

  const toggleComments = () => {
    setShowComments(!showComments);

    if (!showComments && threadRef?.current) threadRef.current.focus();
  };

  const showCommentsToggle = !!commentsCount && !showComments;

  const showBlockCommentsToggle = showCommentsToggleAsBlock && !!commentsCount;
  const showInlineCommentsToggle =
    !showBlockCommentsToggle && showCommentsToggle;

  if (!annotation) return null;

  const creator = annotation.relationships?.creator;

  const verifiedUser = () => {
    const established = currentUser?.attributes.established;
    const trusted = currentUser?.attributes.trusted;

    return established || trusted;
  };

  const onReplySuccess = () => {
    if (refresh) refresh();
    setShowComments(true);
  };

  return (
    <>
      <li className="annotation-comments">
        <Styled.Inner>
          <Meta
            annotation={annotation}
            creator={creator}
            includeMarkers={includeMarkers}
            markerIcons={markerIcons}
          />
          <div
            {...(editDialog.open
              ? { inert: "", className: "screen-reader-text" }
              : {})}
          >
            <Styled.Body>
              <Helper.SimpleFormat text={annotation.attributes.body} />
            </Styled.Body>
            <Authorize kind={"any"}>
              <Styled.Utility>
                <Styled.UtilityList $isFlagged={annotation.attributes.flagged}>
                  <Authorize entity={"comment"} ability={"create"}>
                    <li>
                      <Styled.Button
                        ref={replyToggleRef}
                        onClick={action === "replying" ? stopReply : startReply}
                        aria-expanded={action === "replying"}
                      >
                        {t("actions.reply")}
                      </Styled.Button>
                    </li>
                  </Authorize>

                  <Authorize entity={annotation} ability={"update"}>
                    <li>
                      <Styled.Button
                        className="confirmable-button"
                        ref={editDialog.toggleRef}
                        onClick={startEdit}
                        aria-expanded={editDialog.open}
                        aria-controls={editUID}
                      >
                        {t("actions.edit")}
                      </Styled.Button>
                    </li>
                  </Authorize>
                  <Authorize entity={annotation} ability={"delete"}>
                    <li>
                      <Utility.ConfirmableButton
                        label={t("actions.delete")}
                        confirmHandler={deleteAnnotation}
                      />
                    </li>
                  </Authorize>
                  {verifiedUser && (
                    <li>
                      <FlagToggle record={annotation} />
                    </li>
                  )}
                  {showInlineCommentsToggle && (
                    <InlineToggle
                      active={action === "editing"}
                      loadComments={toggleComments}
                      commentsCount={commentsCount}
                    />
                  )}
                </Styled.UtilityList>
                {action === "replying" && (
                  <CommentContainer.Editor
                    subject={annotation}
                    cancel={stopReply}
                    onSuccess={onReplySuccess}
                    initialOpen
                  />
                )}
              </Styled.Utility>
            </Authorize>
            {showLogin && (
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
            )}
          </div>
          <Styled.EditDialog
            ref={editDialog.dialogRef}
            id={editUID}
            onKeyDown={handleEditKeyDown}
            {...(editDialog.open ? {} : { inert: "" })}
          >
            <Editor
              annotation={annotation}
              cancel={stopEdit}
              readingGroups={readingGroups}
              saveAnnotation={saveAnnotation}
            />
          </Styled.EditDialog>
          <div
            ref={threadRef}
            tabIndex={-1}
            aria-label={t("glossary.comments__thread")}
            className="annotation-comments__thread-container"
          >
            {showComments && <CommentContainer.Thread subject={annotation} />}
          </div>
        </Styled.Inner>
      </li>
      {showBlockCommentsToggle && (
        <BlockToggle
          toggleComments={toggleComments}
          commentsCount={commentsCount}
          expanded={showComments}
        />
      )}
    </>
  );
}

AnnotationDetail.displayName = "Annotation.Annotation.UserContent";

AnnotationDetail.propTypes = {
  annotation: PropTypes.object.isRequired,
  showLogin: PropTypes.func,
  includeComments: PropTypes.bool,
  includeMarkers: PropTypes.bool,
  markerIcons: PropTypes.bool,
  showCommentsToggleAsBlock: PropTypes.bool,
  readingGroups: PropTypes.array
};

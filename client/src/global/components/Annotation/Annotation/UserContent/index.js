import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Helper from "global/components/helper";
import Utility from "frontend/components/utility";
import Editor from "../../Editor";
import Meta from "./Meta";
import BlockToggle from "./BlockToggle";
import InlineToggle from "./InlineToggle";
import FlagToggle from "./Flag/Toggle";
import CommentContainer from "global/containers/comment";
import { annotationsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import Authorize from "hoc/Authorize";
import { useCurrentUser } from "hooks";
import * as Styled from "./styles";

const { request } = entityStoreActions;

export default function AnnotationDetail({
  includeComments = true,
  includeMarkers,
  annotation,
  showCommentsToggleAsBlock,
  showLogin
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const { readingGroupPrivacy, commentsCount } = annotation?.attributes ?? {};
  const isAnonymous = readingGroupPrivacy === "anonymous";

  const [action, setAction] = useState();
  const [showComments, setShowComments] = useState(
    includeComments && !isAnonymous
  );

  const threadRef = useRef(null);
  const replyToggleRef = useRef(null);
  const editToggleRef = useRef(null);

  const startReply = () => {
    setAction("replying");
  };

  const startEdit = () => {
    setAction("editing");
  };

  const stopReply = () => {
    setAction(null);

    if (replyToggleRef.current) replyToggleRef.current.focus();
  };

  const stopEdit = () => {
    setAction(null);

    if (editToggleRef.current) editToggleRef.current.focus();
  };

  const saveAnnotation = data => {
    const call = annotationsAPI.update(data.id, data.attributes);
    const res = dispatch(request(call, requests.rAnnotationUpdate));
    return res.promise;
  };

  const deleteAnnotation = () => {
    const call = annotationsAPI.destroy(annotation.id);
    const options = { removes: { type: "annotations", id: annotation.id } };
    const res = dispatch(request(call, requests.rAnnotationDestroy, options));
    return res.promise;
  };

  const loadComments = () => {
    setShowComments(true);

    if (threadRef?.current) threadRef.current.focus();
  };

  const showCommentsToggle = !!commentsCount && !showComments;

  const showBlockCommentsToggle =
    showCommentsToggleAsBlock && showCommentsToggle;
  const showInlineCommentsToggle =
    !showBlockCommentsToggle && showCommentsToggle;

  if (!annotation) return null;

  const creator = annotation.relationships?.creator;

  const verifiedUser = () => {
    const established = currentUser?.attributes.established;
    const trusted = currentUser?.attributes.trusted;

    return established || trusted;
  };

  return (
    <>
      <li className="annotation-comments">
        <Styled.Inner>
          <Meta
            annotation={annotation}
            creator={creator}
            includeMarkers={includeMarkers}
          />
          {action === "editing" ? (
            <Editor
              annotation={annotation}
              saveAnnotation={saveAnnotation}
              cancel={stopEdit}
            />
          ) : (
            <div>
              <Styled.Body>
                <Helper.SimpleFormat text={annotation.attributes.body} />
              </Styled.Body>
              <Authorize kind={"any"}>
                <Styled.Utility>
                  <Styled.UtilityList
                    $isFlagged={annotation.attributes.flagged}
                  >
                    <Authorize entity={"comment"} ability={"create"}>
                      <li>
                        <Styled.Button
                          ref={replyToggleRef}
                          onClick={
                            action === "replying" ? stopReply : startReply
                          }
                          aria-expanded={action === "replying"}
                        >
                          {t("actions.reply")}
                        </Styled.Button>
                      </li>
                    </Authorize>

                    <Authorize entity={annotation} ability={"update"}>
                      <li>
                        <Styled.Button
                          ref={editToggleRef}
                          onClick={startEdit}
                          aria-expanded={action === "editing"}
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
                        loadComments={loadComments}
                        commentsCount={commentsCount}
                      />
                    )}
                  </Styled.UtilityList>
                  {action === "replying" && (
                    <CommentContainer.Editor
                      subject={annotation}
                      cancel={stopReply}
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
          )}
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
          loadComments={loadComments}
          commentsCount={commentsCount}
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
  showCommentsToggleAsBlock: PropTypes.bool
};

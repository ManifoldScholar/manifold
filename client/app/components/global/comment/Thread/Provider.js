import { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { commentsAPI } from "api";
import { useSignInUpOverlay } from "components/global/sign-in-up/Overlay/context";
import ThreadContext from "./Context";
import useFetch from "hooks/api/useFetch";
import useApiCallback from "hooks/api/useApiCallback";

const perPage = 10;
const EMPTY_FILTER = {};

export default function CommentProvider({
  subject,
  condition = true,
  children
}) {
  const { toggle: showLogin } = useSignInUpOverlay();

  const [page, setPage] = useState(1);
  const [allComments, setAllComments] = useState([]);
  const paginationParams = useMemo(() => ({ number: page, size: perPage }), [
    page
  ]);

  const activatedRef = useRef(condition);
  if (condition) activatedRef.current = true;

  const { data, meta: commentsMeta } = useFetch(
    () => commentsAPI.index(subject, EMPTY_FILTER, paginationParams),
    [subject, paginationParams],
    { condition: !!subject && activatedRef.current }
  );

  useEffect(() => {
    if (!data) return;
    setAllComments(prev => {
      const mergeMap = new Map(prev.map(c => [c.id, c]));
      data.forEach(c => mergeMap.set(c.id, c));
      return Array.from(mergeMap.values());
    });
  }, [data]);

  const destroyCommentApi = useApiCallback(commentsAPI.destroy);
  const updateCommentApi = useApiCallback(commentsAPI.update);

  const addComment = newComment => {
    if (!newComment) return;
    setAllComments(prev => {
      const exists = prev.some(c => c.id === newComment.id);
      if (exists) {
        return prev.map(c =>
          c.id === newComment.id
            ? {
                ...c,
                attributes: { ...c.attributes, ...newComment.attributes }
              }
            : c
        );
      }
      return [...prev, newComment];
    });
  };

  const handleDelete = async comment => {
    setAllComments(prev =>
      prev.map(c =>
        c.id === comment.id
          ? { ...c, attributes: { ...c.attributes, deleted: true } }
          : c
      )
    );
    try {
      await updateCommentApi(comment.id, { deleted: true });
    } catch {
      setAllComments(prev =>
        prev.map(c =>
          c.id === comment.id
            ? { ...c, attributes: { ...c.attributes, deleted: false } }
            : c
        )
      );
    }
  };

  const handleRestore = async comment => {
    setAllComments(prev =>
      prev.map(c =>
        c.id === comment.id
          ? { ...c, attributes: { ...c.attributes, deleted: false } }
          : c
      )
    );
    try {
      await updateCommentApi(comment.id, { deleted: false });
    } catch {
      setAllComments(prev =>
        prev.map(c =>
          c.id === comment.id
            ? { ...c, attributes: { ...c.attributes, deleted: true } }
            : c
        )
      );
    }
  };

  const handleDestroy = async comment => {
    let originalIndex;
    setAllComments(prev => {
      originalIndex = prev.findIndex(c => c.id === comment.id);
      return prev.filter(c => c.id !== comment.id);
    });
    try {
      await destroyCommentApi(comment);
    } catch {
      setAllComments(prev => {
        const next = [...prev];
        next.splice(originalIndex, 0, comment);
        return next;
      });
    }
  };

  const loadNextPage = () => {
    setPage(prev => prev + 1);
  };

  const ctx = {
    comments: allComments,
    subject,
    showLogin,
    addComment,
    handleDelete,
    handleRestore,
    handleDestroy,
    pagination: commentsMeta?.pagination,
    loadedCount: allComments.length,
    loadNextPage
  };

  return (
    <ThreadContext.Provider value={ctx}>{children}</ThreadContext.Provider>
  );
}

CommentProvider.displayName = "Comment.Provider";

CommentProvider.propTypes = {
  subject: PropTypes.object,
  condition: PropTypes.bool,
  children: PropTypes.node
};

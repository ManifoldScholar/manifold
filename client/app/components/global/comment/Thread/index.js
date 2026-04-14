import PropTypes from "prop-types";
// eslint-disable-next-line import/no-cycle
import Detail from "../detail";
import ViewMore from "./ViewMore";
import { useThread } from "./Context";

export default function CommentThread({ parentId = null, parent }) {
  const { comments, pagination, loadedCount, loadNextPage } = useThread();

  const children = comments.filter(c => c.attributes.parentId === parentId);
  if (children.length <= 0) return null;

  return (
    <div className="annotation-comment-thread">
      <ul className="comment-list">
        {children.map(comment => (
          <Detail key={comment.id} comment={comment} parent={parent} />
        ))}
      </ul>
      {!parentId && (
        <ViewMore
          pagination={pagination}
          loadedCount={loadedCount}
          onNextClick={loadNextPage}
        />
      )}
    </div>
  );
}

CommentThread.displayName = "Comment.Thread";

CommentThread.propTypes = {
  parentId: PropTypes.string,
  parent: PropTypes.object
};

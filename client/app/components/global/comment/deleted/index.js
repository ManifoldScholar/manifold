import { useTranslation } from "react-i18next";
// eslint-disable-next-line import/no-cycle
import CommentThread from "../Thread";
import PropTypes from "prop-types";
import Avatar from "components/global/avatar/index";

export default function CommentDeleted({ comment }) {
  const { t } = useTranslation();

  return (
    <li className="annotation-reply">
      <section className="annotation-meta">
        <div>
          <div
            aria-hidden
            className="annotation-meta__avatar annotation-meta__avatar annotation-meta__avatar-placeholder-container"
          >
            <Avatar />
          </div>
          <h4 className="annotation-meta__deleted-message">
            {t("placeholders.comments.deleted")}
          </h4>
        </div>
      </section>
      <CommentThread parentId={comment.id} />
    </li>
  );
}

CommentDeleted.displayName = "Comment.Deleted";

CommentDeleted.propTypes = {
  comment: PropTypes.object.isRequired
};

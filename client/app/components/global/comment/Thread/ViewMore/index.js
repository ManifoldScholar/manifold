import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Utility from "components/global/utility";

const perPage = 10;

export default function ViewMore({ pagination, loadedCount, onNextClick }) {
  const { t } = useTranslation();

  if (!pagination) return null;
  const { totalCount } = pagination;
  if (loadedCount >= totalCount) return null;

  const remaining = totalCount - loadedCount;
  const nextCount = Math.min(perPage, remaining);

  return (
    <button className="comment-more" onClick={onNextClick}>
      {t("actions.see_next_comment", { count: nextCount })}
      <Utility.IconComposer
        icon="disclosureDown16"
        size={16}
        className="comment-more__icon"
      />
    </button>
  );
}

ViewMore.displayName = "Comment.ViewMore";

ViewMore.propTypes = {
  pagination: PropTypes.object,
  loadedCount: PropTypes.number.isRequired,
  onNextClick: PropTypes.func.isRequired
};

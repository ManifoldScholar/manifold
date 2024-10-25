import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";

export default function BlockCommentsToggle({ loadComments, commentsCount }) {
  const { t } = useTranslation();

  return (
    <button className="annotation-footer-button" onClick={loadComments}>
      <span className="annotation-footer-button__inner">
        <span className="annotation-footer-button__icon-container">
          <IconComposer icon="interactComment32" size="default" />
        </span>
        <span className="annotation-footer-button__text">
          {t("counts.comment", { count: commentsCount })}
        </span>
        <IconComposer
          icon="arrowLongRight16"
          size={24}
          className="annotation-footer-button__arrow-icon"
        />
      </span>
    </button>
  );
}

BlockCommentsToggle.displayName =
  "Annotation.Annotation.UserContent.BlockCommentsToggle";

BlockCommentsToggle.propTypes = {
  loadComments: PropTypes.func.isRequired,
  commentsCount: PropTypes.number.isRequired
};

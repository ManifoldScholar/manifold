import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";

export default function BlockCommentsToggle({
  toggleComments,
  commentsCount,
  expanded,
}) {
  const { t } = useTranslation();

  return (
    <button className="annotation-footer-button" onClick={toggleComments}>
      <span className="annotation-footer-button__inner">
        {expanded ? (
          <>
            <IconComposer
              icon="arrowLongLeft16"
              size={24}
              className="annotation-footer-button__arrow-icon"
            />
            <span className="annotation-footer-button__text annotation-footer-button__text--hide">
              {t("actions.hide_comments")}
            </span>
          </>
        ) : (
          <>
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
          </>
        )}
      </span>
    </button>
  );
}

BlockCommentsToggle.displayName =
  "Annotation.Annotation.UserContent.BlockCommentsToggle";

BlockCommentsToggle.propTypes = {
  toggleComments: PropTypes.func.isRequired,
  commentsCount: PropTypes.number.isRequired,
  expanded: PropTypes.bool.isRequired,
};

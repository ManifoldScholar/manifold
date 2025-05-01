import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function InlineCommentsToggle({
  loadComments,
  active,
  commentsCount,
}) {
  const { t } = useTranslation();

  return (
    <li>
      <Styled.Button onClick={loadComments} $active={active}>
        {t("counts.comment", { count: commentsCount })}
      </Styled.Button>
    </li>
  );
}

InlineCommentsToggle.displayName =
  "Annotation.Annotation.UserContent.InlineCommentsToggle";

InlineCommentsToggle.propTypes = {
  loadComments: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  commentsCount: PropTypes.number.isRequired,
};

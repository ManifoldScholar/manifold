import * as React from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const BlockHeaderDetail = ({ titleId, title, description }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="hero-builder-block__header-details">
        <h3 id={titleId} className="hero-builder-block__title">
          {title}
        </h3>
        {!!description && (
          <p className="hero-builder-block__description">{description}</p>
        )}
      </div>
      <div className="hero-builder-block__button">
        <span className="hero-builder-block__button-label">
          {t("actions.edit")}
        </span>
        <Utility.IconComposer icon="annotate32" size={26} />
      </div>
    </>
  );
};

BlockHeaderDetail.propTypes = {
  titleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string
};

export default BlockHeaderDetail;

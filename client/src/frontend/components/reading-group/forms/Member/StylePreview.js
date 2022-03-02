import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function StylePreview({ style }) {
  const { t } = useTranslation();

  return (
    <div className="member-settings-form__style-preview">
      <p>
        <span className={`underline-${style}`}>
          {t("forms.reading_group_member.style_preview")}
        </span>
      </p>
    </div>
  );
}

StylePreview.displayName = "ReadingGroup.Forms.MemberSettings.StylePreview";

StylePreview.propTypes = {
  style: PropTypes.string
};

export default StylePreview;

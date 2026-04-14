import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function StylePreview({ style }) {
  const { t } = useTranslation();

  return (
    <Styled.Preview>
      <p>
        <Styled.Underline $style={style}>
          {t("forms.reading_group_member.style_preview")}
        </Styled.Underline>
      </p>
    </Styled.Preview>
  );
}

StylePreview.displayName = "ReadingGroup.Forms.MemberSettings.StylePreview";

StylePreview.propTypes = {
  style: PropTypes.string
};

export default StylePreview;

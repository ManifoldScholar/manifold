import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Date from "./Date";
import Counts from "./Counts";
import * as Styled from "./styles";

export default function TextMeta({
  text,
  datesVisible,
  datePrefix,
  date,
  publishedVisible
}) {
  const { t } = useTranslation();

  const showStatus = datesVisible || publishedVisible;

  return (
    <Styled.Meta>
      {showStatus && (
        <Styled.Status>
          {datesVisible && <Date date={date} datePrefix={datePrefix} inline />}
          {publishedVisible && (
            <Styled.Published>
              {t("dates.published_title_case")}
            </Styled.Published>
          )}
        </Styled.Status>
      )}
      <Counts text={text} />
    </Styled.Meta>
  );
}

TextMeta.displayName = "Text.Meta";

TextMeta.propTypes = {
  text: PropTypes.object.isRequired,
  datesVisible: PropTypes.bool,
  datePrefix: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  publishedVisible: PropTypes.bool
};

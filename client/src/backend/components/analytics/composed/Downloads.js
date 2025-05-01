import React from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import { useTranslation } from "react-i18next";

export default function Downloads({ data, width = 25, rangeInWords }) {
  const { t } = useTranslation();

  const caption = rangeInWords
    ? t("analytics.downloads_in_date_range", {
        dateRange: rangeInWords,
      })
    : t("analytics.downloads");

  return (
    <Block
      width={width}
      icon="download24"
      title={t("glossary.download_title_case_other")}
    >
      <Figure stat={data?.value} caption={caption} />
    </Block>
  );
}

Downloads.displayName = "Analytics.Composed.Downloads";

Downloads.propTypes = {
  data: PropTypes.object.isRequired,
  width: PropTypes.number,
  rangeInWords: PropTypes.string,
};

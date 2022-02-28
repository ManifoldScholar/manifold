import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";

function Index({ count, unit, categoryCount, uncategorized = 0 }) {
  const { t } = useTranslation();

  if (categoryCount) {
    const categorized = count - uncategorized;
    if (!categorized) {
      return (
        <>
          <Trans i18nKey="counts.empty_volume" count={categoryCount}>
            There are <strong>{{ count: categoryCount }}</strong> empty volumes
          </Trans>
          {!!uncategorized && (
            <Trans i18nKey="counts.uncategorized_issues" count={uncategorized}>
              {" "}
              and <strong> {{ count: uncategorized }}</strong> additional issue
            </Trans>
          )}
        </>
      );
    }
    return (
      <>
        <Trans i18nKey="counts.categorized_issues" count={categorized}>
          There is <strong>{{ count: categorized }}</strong> issue in{" "}
          <strong>{{ categoryCount }}</strong>
          {{ volume: t("glossary.volume", { count: categoryCount }) }}
        </Trans>
        {!!uncategorized && (
          <Trans i18nKey="counts.uncategorized_issues" count={uncategorized}>
            and <strong>{{ count: uncategorized }}</strong> additional issue
          </Trans>
        )}
      </>
    );
  }
  return (
    <Trans i18nKey="counts.default_issues" count={count}>
      There is <strong>{{ count }}</strong> {{ unit }}
    </Trans>
  );
}

Index.displayName = "Journal.IssueList.CountTemplate";

Index.propTypes = {
  count: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  categoryCount: PropTypes.number,
  uncategorized: PropTypes.number
};

export default Index;

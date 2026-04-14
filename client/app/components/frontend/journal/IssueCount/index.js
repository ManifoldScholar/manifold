import React from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";

function Index({ count, unit, categoryCount, uncategorized = 0 }) {
  const { t } = useTranslation();

  if (categoryCount) {
    const categorized = count - uncategorized;
    if (!categorized) {
      return uncategorized ? (
        <Trans
          i18nKey="counts.empty_volume_and_issues"
          values={{
            count: categoryCount,
            uncategorized: t("counts.uncategorized_issues", {
              count: uncategorized
            })
          }}
          components={[<strong />]}
        />
      ) : (
        <Trans
          i18nKey="counts.empty_volume"
          values={{ count: categoryCount }}
          components={[<strong />]}
        />
      );
    }
    return uncategorized ? (
      <Trans
        i18nKey="counts.categorized_and_uncategorized_issues"
        values={{
          count: categorized,
          categoryCount,
          volume: t("glossary.volume", { count: categoryCount }),
          uncategorized: t("counts.uncategorized_issues", {
            count: uncategorized
          })
        }}
        components={{ strong: <strong /> }}
      />
    ) : (
      <Trans
        i18nKey="counts.categorized_issues"
        values={{
          count: categorized,
          categoryCount,
          volume: t("glossary.volume", { count: categoryCount })
        }}
        components={{ strong: <strong /> }}
      />
    );
  }
  return (
    <Trans
      i18nKey="counts.default_issues"
      values={{ count, unit }}
      components={[<strong />]}
    />
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

export const privacyFilter = (filters, updateFilters, params, t) => {
  const value = filters.formats?.every(f => f === "highlight")
    ? "highlight"
    : filters.privacy ?? "";
  return {
    label: t("filters.labels.privacy"),
    value,
    onChange: e => updateFilters(e, "privacy"),
    options: [
      {
        label: t("filters.annotations.all"),
        value: ""
      },
      {
        label: t("filters.annotations.only_private"),
        value: "private"
      },
      {
        label: t("filters.annotations.only_public"),
        value: "public"
      },
      {
        label: t("glossary.highlight_title_case_other"),
        value: "highlight"
      }
    ]
  };
};

import React from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import lh from "helpers/linkHandler";
import EntityRow from "./Row";
import { useTranslation } from "react-i18next";

function ReadingGroupRow({ active, entity, ...props }) {
  const { id, attributes } = entity;
  const {
    name,
    privacy,
    membershipsCount,
    createdAt,
    allAnnotationsCount
  } = attributes;
  const { t } = useTranslation();

  const additionalProps = {
    title: name,
    subtitle: `${membershipsCount} ${t("glossary.member", {
      count: membershipsCount
    })}, ${allAnnotationsCount} ${t("glossary.annotation", {
      count: allAnnotationsCount
    })}`,
    meta: (
      <FormattedDate
        prefix={t("dates.added_title_case")}
        format="MMMM, yyyy"
        date={createdAt}
      />
    ),
    label: privacy,
    active: active === id,
    onRowClick: lh.link("frontendReadingGroupDetail", id),
    rowClickMode: "inline"
  };

  return <EntityRow {...props} {...additionalProps} />;
}

ReadingGroupRow.propTypes = {
  entity: PropTypes.object,
  active: PropTypes.string
};

export default ReadingGroupRow;

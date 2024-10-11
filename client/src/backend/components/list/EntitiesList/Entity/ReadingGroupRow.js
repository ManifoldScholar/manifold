import React from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import lh from "helpers/linkHandler";
import EntityRow from "./Row";
import Utility from "global/components/utility";
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
    label: { text: privacy, level: privacy === "public" ? "notice" : "" },
    active: active === id,
    onRowClick: lh.link("frontendReadingGroupDetail", id),
    rowClickMode: "inline"
  };

  const utility = (
    <div className="entity-row__utility">
      <button
        className="entity-row__utility-button"
        title={t("backend.actions.publish_feature")}
      >
        <Utility.IconComposer icon="BEActivity64" size={26} />
      </button>
      <button
        className="entity-row__utility-button"
        title={t("backend.actions.publish_feature")}
      >
        <Utility.IconComposer icon="delete32" size={26} />
      </button>
    </div>
  );

  return <EntityRow utility={utility} {...props} {...additionalProps} />;
}

ReadingGroupRow.propTypes = {
  entity: PropTypes.object,
  active: PropTypes.string
};

export default ReadingGroupRow;

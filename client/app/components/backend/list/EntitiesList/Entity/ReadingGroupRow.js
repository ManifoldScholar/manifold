import React from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";

import EntityRow from "./Row";
import Utility from "components/global/utility";
import Checkbox from "../List/bulkActions/Checkbox";
import { useTranslation } from "react-i18next";

function ReadingGroupRow({
  active,
  entity,
  onDelete,
  bulkActionsActive,
  bulkSelection,
  addItem,
  removeItem,
  ...props
}) {
  const { id, attributes } = entity;
  const {
    name,
    privacy,
    membershipsCount,
    createdAt,
    annotationsCount,
    annotationFlagsCount
  } = attributes;

  const { t } = useTranslation();

  const isSelected =
    !!bulkSelection?.filters || bulkSelection?.ids?.includes(id);

  const additionalProps = {
    title: name,
    subtitle: `${membershipsCount} ${t("glossary.member", {
      count: membershipsCount
    })} | ${annotationsCount} ${t("glossary.annotation", {
      count: annotationsCount
    })}`,
    meta: (
      <FormattedDate
        prefix={t("dates.added_title_case")}
        format="MMMM, yyyy"
        date={createdAt}
      />
    ),
    label: [
      { text: privacy, level: privacy === "public" ? "notice" : "" },
      ...(annotationFlagsCount
        ? [
            {
              text: t("records.annotations.flag_count", {
                count: annotationFlagsCount
              }),
              level: "error"
            }
          ]
        : [])
    ],
    active: active === id,
    onRowClick: `/backend/groups/${id}/details`,
    rowClickMode: "inline",
    prepend: bulkActionsActive && (
      <Checkbox
        checked={isSelected}
        onSelect={() => addItem(id)}
        onClear={() => removeItem(id)}
      />
    )
  };

  const utility = !bulkActionsActive ? (
    <button
      className="entity-row__utility-button"
      title={t("actions.delete")}
      onClick={() => onDelete(id)}
    >
      <Utility.IconComposer icon="delete32" size={26} />
    </button>
  ) : (
    undefined
  );

  return <EntityRow utility={utility} {...props} {...additionalProps} />;
}

ReadingGroupRow.propTypes = {
  entity: PropTypes.object,
  active: PropTypes.bool,
  bulkActionsActive: PropTypes.bool,
  bulkSelection: PropTypes.object,
  addItem: PropTypes.func,
  removeItem: PropTypes.func,
  onDelete: PropTypes.func
};

export default ReadingGroupRow;

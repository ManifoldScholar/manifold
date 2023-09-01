import React from "react";
import PropTypes from "prop-types";
import EntityThumbnail from "global/components/entity-thumbnail";
import Utility from "global/components/utility";
import EntityRow from "./Row";
import FormattedDate from "global/components/FormattedDate";
import { useTranslation } from "react-i18next";
import { useFromStore } from "hooks";

export default function PendingEntitlementRow({
  entity: entitlement,
  onDelete,
  onEdit,
  ...rest
}) {
  const { t } = useTranslation();

  const { email, subjectId, expiresOn } = entitlement?.attributes ?? {};

  const project = useFromStore(`entityStore.entities.projects["${subjectId}"]`);
  const journal = useFromStore(`entityStore.entities.journals["${subjectId}"]`);
  const target = project ?? journal;

  const subtitle = target ? target.attributes?.titlePlaintext : "";

  const figure = target ? (
    <EntityThumbnail.Project mode="responsive" entity={target} />
  ) : (
    undefined
  );

  const meta = expiresOn && (
    <FormattedDate
      prefix={t("dates.expires_title_case")}
      date={new Date(expiresOn)}
    />
  );

  const utility = (
    <div>
      <button
        className="entity-row__utility-button"
        onClick={() => onDelete(entitlement.id)}
        title={t("backend.actions.publish_feature")}
      >
        <Utility.IconComposer icon="delete32" size={26} />
      </button>
    </div>
  );

  const rowProps = {
    title: email,
    subtitle,
    meta,
    figure,
    figureSize: "small",
    ...rest
  };

  return <EntityRow utility={utility} {...rowProps} />;
}

PendingEntitlementRow.displayName = "EntitiesList.Entity.PendingEntitlementRow";

PendingEntitlementRow.propTypes = {
  entity: PropTypes.object,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

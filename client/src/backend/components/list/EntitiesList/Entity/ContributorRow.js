import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";
import Utility from "global/components/utility";
import { useFromStore } from "hooks";
import Authorization from "helpers/authorization";
import capitalize from "lodash/capitalize";

function ContributorRow({ entity, onDelete, onEdit, ...props }) {
  const { t } = useTranslation();

  const { id, attributes, relationships } = entity;

  const makerId = relationships?.maker?.id;

  const { roles } = attributes ?? {};

  const authentication = useFromStore({ path: "authentication" });
  const auth = new Authorization();
  const canAccessMakers = auth.authorizeAbility({
    entity: "maker",
    ability: "update",
    currentUser: authentication.currentUser
  });

  const additionalProps = {
    title: attributes.makerName,
    subtitle: roles.map(r => capitalize(r).replaceAll("_", " ")).join(", "),
    figure: <EntityThumbnail.Maker entity={entity} />,
    figureSize: "small",
    figureShape: "circle",
    ...(canAccessMakers
      ? {
          onRowClick: lh.link("backendRecordsMaker", makerId),
          rowClickMode: "inline"
        }
      : {})
  };

  const utility = (
    <>
      <button
        className="entity-row__utility-button"
        onClick={e => {
          e.preventDefault();
          onEdit(id);
        }}
        title={t("actions.edit")}
      >
        <Utility.IconComposer icon="annotate24" size={26} />
      </button>
      <button
        className="entity-row__utility-button"
        style={{ marginInline: "4px" }}
        onClick={e => {
          e.preventDefault();
          onDelete(makerId);
        }}
        title={t("actions.delete")}
      >
        <Utility.IconComposer icon="delete32" size={26} />
      </button>
    </>
  );

  return <EntityRow {...props} {...additionalProps} utility={utility} />;
}

ContributorRow.displayName = "EntitiesList.Entity.ContributorRow";

ContributorRow.propTypes = {
  entity: PropTypes.object,
  onDelete: PropTypes.func
};

export default ContributorRow;

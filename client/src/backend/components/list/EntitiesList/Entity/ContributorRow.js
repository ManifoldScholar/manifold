import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";
import Utility from "global/components/utility";
import { useFromStore } from "hooks";
import capitalize from "lodash/capitalize";

function ContributorRow({ entity, onDelete, ...props }) {
  const { t } = useTranslation();

  const { attributes, relationships } = entity;

  const makerId = relationships?.maker?.id;
  const maker = useFromStore(`entityStore.entities.makers[${makerId}]`);

  const { roles } = attributes ?? {};

  const additionalProps = {
    title: attributes.makerName,
    subtitle: roles.map(r => capitalize(r).replaceAll("_", " ")).join(", "),
    figure: <EntityThumbnail.Maker entity={maker} />,
    figureSize: "small",
    figureShape: "circle",
    onRowClick: lh.link("backendRecordsMaker", makerId),
    rowClickMode: "inline"
  };

  const utility = (
    <span className="entity-row__utility">
      <button
        className="entity-row__utility-button"
        onClick={e => {
          e.preventDefault();
          onDelete(makerId);
        }}
        title={t("actions.delete")}
      >
        <Utility.IconComposer icon="delete32" size={26} />
      </button>
    </span>
  );

  return <EntityRow {...props} {...additionalProps} utility={utility} />;
}

ContributorRow.displayName = "EntitiesList.Entity.ContributorRow";

ContributorRow.propTypes = {
  entity: PropTypes.object,
  onDelete: PropTypes.func
};

export default ContributorRow;

import PropTypes from "prop-types";
import EntityThumbnail from "global/components/entity-thumbnail";
import Utility from "global/components/utility";
import EntityRow from "./Row";
import FormattedDate from "global/components/FormattedDate";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export default function PendingEntitlementRow({
  entity: entitlement,
  onDelete,
  userGroupId,
  ...rest
}) {
  const { t } = useTranslation();

  const { attributes, relationships } = entitlement ?? {};
  const entitleable = relationships?.entitleable;

  if (!entitleable) return null;

  const { titlePlaintext } = entitleable?.attributes ?? {};

  const figure = entitlement ? (
    <EntityThumbnail.Project mode="responsive" entity={entitleable} />
  ) : (
    undefined
  );

  const meta = (attributes?.createdAt || attributes?.expiration) && (
    <>
      {attributes.createdAt && (
        <div>
          <FormattedDate
            prefix={t("dates.added_title_case")}
            date={new Date(attributes.createdAt)}
          />
        </div>
      )}
      {attributes.expiration && (
        <div>
          <FormattedDate
            prefix={t("dates.expires_title_case")}
            date={attributes.expiration}
          />
        </div>
      )}
    </>
  );

  const utility = (
    <>
      <Link
        className="entity-row__utility-button"
        to={lh.link(
          "backendRecordsUserGroupEntitlementsEdit",
          userGroupId,
          entitlement.id
        )}
        title={t("actions.edit")}
        aria-label={t("actions.edit")}
      >
        <Utility.IconComposer icon="annotate32" size={26} />
      </Link>
      <button
        data-id="destroy"
        className="entity-row__utility-button"
        onClick={() => onDelete(entitlement.id)}
        title={t("actions.delete")}
      >
        <Utility.IconComposer icon="delete32" size={26} />
      </button>
    </>
  );

  const onRowClick =
    entitleable.type === "journals"
      ? lh.link("backendJournal", entitleable.id)
      : lh.link("backendProject", entitleable.id);

  const rowProps = {
    title: titlePlaintext,
    meta,
    figure,
    figureSize: "normal",
    rowClickMode: "inline",
    onRowClick,
    label: [
      {
        text: entitleable.type.slice(0, -1),
        level: ""
      }
    ],
    ...rest
  };

  return <EntityRow utility={utility} {...rowProps} />;
}

PendingEntitlementRow.displayName = "EntitiesList.Entity.PendingEntitlementRow";

PendingEntitlementRow.propTypes = {
  entity: PropTypes.object,
  onDelete: PropTypes.func,
  userGroupId: PropTypes.string
};

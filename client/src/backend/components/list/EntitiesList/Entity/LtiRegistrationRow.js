import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import Utility from "global/components/utility";
import EntityRow from "./Row";

function LtiRegistrationRow({ entity, onToggleEnabled, onDelete, ...props }) {
  const { t } = useTranslation();

  const { attributes } = entity;
  const {
    name,
    issuer,
    clientId,
    enabled,
    ltiDeploymentsCount,
    createdAt
  } = attributes;

  const utility = (
    <>
      <button
        type="button"
        data-id="toggle-enabled"
        className="entity-row__utility-button"
        title={
          enabled
            ? t("settings.lti.registrations.disable")
            : t("settings.lti.registrations.enable")
        }
        onClick={() => onToggleEnabled(entity)}
      >
        <Utility.IconComposer
          icon={enabled ? "circleMinus32" : "circlePlus32"}
          size={26}
        />
      </button>
      <button
        type="button"
        data-id="destroy"
        className="entity-row__utility-button"
        title={t("actions.delete")}
        onClick={() => onDelete(entity)}
      >
        <Utility.IconComposer icon="delete32" size={26} />
      </button>
    </>
  );

  return (
    <EntityRow
      {...props}
      title={name || issuer}
      titlePlainText={name || issuer}
      subtitle={issuer}
      meta={
        <>
          {t("settings.lti.registrations.client_id", { clientId })}
          {" · "}
          {t("settings.lti.registrations.deployment_count", {
            count: ltiDeploymentsCount ?? 0
          })}
          {" · "}
          <FormattedDate
            prefix={t("dates.added_title_case")}
            format="MMMM d, yyyy"
            date={createdAt}
          />
        </>
      }
      label={
        enabled
          ? null
          : { text: t("settings.lti.registrations.disabled"), level: "warning" }
      }
      utility={utility}
    />
  );
}

LtiRegistrationRow.displayName = "EntitiesList.Entity.LtiRegistrationRow";

LtiRegistrationRow.propTypes = {
  entity: PropTypes.object.isRequired,
  onToggleEnabled: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default LtiRegistrationRow;

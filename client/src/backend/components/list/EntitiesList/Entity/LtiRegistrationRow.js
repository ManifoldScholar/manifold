import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import Utility from "global/components/utility";
import EntityRow from "./Row";

// Transitions available from each state. Keep in sync with the API state
// machine: api/app/services/lti_registrations/state_machine.rb
const VALID_TRANSITIONS = {
  pending: ["approve", "deny", "block"],
  approved: ["deny", "block"],
  denied: ["approve", "block"],
  blocked: ["approve", "deny"]
};

const TRANSITION_ICONS = {
  approve: "circlePlus32",
  deny: "circleMinus32",
  block: "circleSlash32"
};

// Only approved registrations can launch, so they need no label.
const STATE_LABEL_LEVELS = {
  pending: "notice",
  denied: "warning",
  blocked: "error"
};

function LtiRegistrationRow({
  entity,
  onApprove,
  onDeny,
  onBlock,
  onDelete,
  ...props
}) {
  const { t } = useTranslation();
  const handlers = { approve: onApprove, deny: onDeny, block: onBlock };

  const { attributes } = entity;
  const {
    name,
    issuer,
    clientId,
    currentState,
    ltiDeploymentsCount,
    createdAt
  } = attributes;

  const transitionButtons = (VALID_TRANSITIONS[currentState] ?? []).map(
    transition => {
      const label = t(`settings.lti.registrations.actions.${transition}`);

      return (
        <button
          key={transition}
          type="button"
          data-id={transition}
          className="entity-row__utility-button"
          title={label}
          aria-label={label}
          onClick={() => handlers[transition](entity)}
        >
          <Utility.IconComposer icon={TRANSITION_ICONS[transition]} size={26} />
        </button>
      );
    }
  );

  const utility = (
    <>
      {transitionButtons}
      <button
        type="button"
        data-id="destroy"
        className="entity-row__utility-button"
        title={t("actions.delete")}
        aria-label={t("actions.delete")}
        onClick={() => onDelete(entity)}
      >
        <Utility.IconComposer icon="delete32" size={26} />
      </button>
    </>
  );

  const level = STATE_LABEL_LEVELS[currentState];

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
        level
          ? {
              text: t(`settings.lti.registrations.states.${currentState}`),
              level
            }
          : null
      }
      utility={utility}
    />
  );
}

LtiRegistrationRow.displayName = "EntitiesList.Entity.LtiRegistrationRow";

LtiRegistrationRow.propTypes = {
  entity: PropTypes.object.isRequired,
  onApprove: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
  onBlock: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default LtiRegistrationRow;

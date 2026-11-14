import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ltiRegistrationsAPI } from "api";
import {
  useFetch,
  useApiCallback,
  useFocusAfterRemoval,
  useNotification
} from "hooks";
import withConfirmation from "hoc/withConfirmation";
import EntitiesList, {
  LtiRegistrationRow
} from "backend/components/list/EntitiesList";

function Registrations({ confirm }) {
  const { t } = useTranslation();

  const { data: registrations, refresh } = useFetch({
    request: [ltiRegistrationsAPI.index]
  });

  const approveRegistration = useApiCallback(ltiRegistrationsAPI.approve);
  const denyRegistration = useApiCallback(ltiRegistrationsAPI.deny);
  const blockRegistration = useApiCallback(ltiRegistrationsAPI.block);
  const destroyRegistration = useApiCallback(ltiRegistrationsAPI.destroy);

  const { listRef, rememberRemoval } = useFocusAfterRemoval(registrations);

  const notifyTransitionError = useNotification(detail => ({
    id: "LTI_REGISTRATION_TRANSITION_ERROR",
    level: 2,
    heading: t("settings.lti.registrations.transition_error_heading"),
    body: detail || t("settings.lti.registrations.transition_error"),
    expiration: 5000
  }));

  // Failed requests reject with the parsed response in `body`. The API
  // explains invalid transitions in `errors[0].detail`.
  const transition = callback => async registration => {
    try {
      await callback(registration.id);
    } catch (error) {
      notifyTransitionError(error?.body?.errors?.[0]?.detail);
    } finally {
      // Refresh on failure too, in case the state changed elsewhere.
      refresh();
    }
  };

  const onApprove = transition(approveRegistration);
  const onDeny = transition(denyRegistration);
  const onBlock = transition(blockRegistration);

  const onDelete = registration => {
    const { name, issuer } = registration.attributes;
    const heading = t("modals.delete_lti_registration", {
      name: name || issuer
    });
    // Blocks are stored on the registration, so deleting it lifts the block.
    const message =
      registration.attributes.currentState === "blocked"
        ? t("modals.delete_lti_registration_blocked_body")
        : t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        rememberRemoval(registration.id);
        await destroyRegistration(registration.id);
        refresh();
      });
  };

  if (!registrations) return null;

  return (
    <EntitiesList
      wrapperRef={listRef}
      aria-label={t("settings.lti.registrations.header")}
      instructions={t("settings.lti.registrations.instructions")}
      title={t("settings.lti.registrations.header")}
      titleStyle="section"
      entityComponent={LtiRegistrationRow}
      entityComponentProps={{ onApprove, onDeny, onBlock, onDelete }}
      entities={registrations}
      emptyMessage={t("settings.lti.registrations.empty")}
    />
  );
}

Registrations.displayName = "Settings.Lti.Registrations";

Registrations.propTypes = {
  confirm: PropTypes.func.isRequired
};

export default withConfirmation(Registrations);

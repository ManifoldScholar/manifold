import { useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import { ltiRegistrationsAPI, settingsAPI, requests } from "api";
import { useFetch, useApiCallback, useFocusAfterRemoval } from "hooks";
import withConfirmation from "hoc/withConfirmation";
import EntitiesList, {
  LtiRegistrationRow
} from "backend/components/list/EntitiesList";
import BlocklistOption from "./BlocklistOption";

function Registrations({ confirm }) {
  const { t } = useTranslation();

  const { data: registrations, refresh } = useFetch({
    request: [ltiRegistrationsAPI.index]
  });

  const updateRegistration = useApiCallback(ltiRegistrationsAPI.update);
  const destroyRegistration = useApiCallback(ltiRegistrationsAPI.destroy);

  const { listRef, rememberRemoval } = useFocusAfterRemoval(registrations);

  const dispatch = useDispatch();
  const refreshSettings = () =>
    dispatch(entityStoreActions.request(settingsAPI.show(), requests.settings));

  const onToggleEnabled = async registration => {
    await updateRegistration(registration.id, {
      attributes: { enabled: !registration.attributes.enabled }
    });
    refresh();
  };

  const blocklistRef = useRef(false);

  const onDelete = registration => {
    const heading = t("modals.delete_lti_registration", {
      name: registration.attributes.name || registration.attributes.issuer
    });
    const message = t("modals.confirm_body");
    blocklistRef.current = false;
    if (confirm)
      confirm(
        heading,
        message,
        async () => {
          const blocklist = blocklistRef.current;
          rememberRemoval(registration.id);
          await destroyRegistration(registration.id, blocklist);
          refresh();
          if (blocklist) refreshSettings();
        },
        {
          slot: (
            <BlocklistOption
              onChange={checked => {
                blocklistRef.current = checked;
              }}
            />
          )
        }
      );
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
      entityComponentProps={{ onToggleEnabled, onDelete }}
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

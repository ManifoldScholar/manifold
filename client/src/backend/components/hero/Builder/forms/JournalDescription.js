import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";
import { useTranslation } from "react-i18next";

function JournalDescription({
  modelLabel,
  failureRedirectRoute,
  api,
  headerId,
  withDarkMode = true,
  model,
  closeDrawer
}) {
  const maybeCloseDrawer = useCallback(() => {
    if (!closeDrawer) return;
    closeDrawer();
  }, [closeDrawer]);
  const { t } = useTranslation();

  return (
    <Authorize
      entity={model}
      ability="update"
      failureNotification
      failureRedirect={lh.link(failureRedirectRoute, model.id)}
    >
      <section>
        <Navigation.DrawerHeader
          icon="journals64"
          title={t("backend.layout.description_and_images")}
          headerId={headerId}
        />
        <FormContainer.Form
          model={model}
          name="backend-hero-update"
          update={api.update}
          create={api.create}
          className="form-secondary"
          onSuccess={maybeCloseDrawer}
        >
          {withDarkMode && (
            <Form.Switch
              label={t("backend.forms.dark_mode")}
              name="attributes[darkMode]"
            />
          )}
          <Form.TextArea
            wide
            focusOnMount
            height={250}
            label={t("backend.forms.description")}
            name="attributes[description]"
            placeholder={t("backend.forms.description_placeholder", {
              entity: modelLabel
            })}
            instructions={t("backend.forms.description_instructions", {
              entity: modelLabel
            })}
          />
          <Form.Upload
            layout="landscape"
            accepts="images"
            label={t("backend.forms.image_label")}
            readFrom="attributes[heroStyles][small]"
            name="attributes[hero]"
            remove="attributes[removeHero]"
            instructions={t("backend.forms.image_instructions")}
          />
          <Form.Select
            name="attributes[heroLayout]"
            label={t("backend.forms.hero_layout")}
            options={[
              { label: t("backend.forms.square_inset"), value: "square_inset" },
              { label: t("backend.forms.wide_inset"), value: "wide_inset" },
              { label: t("backend.forms.full_bleed"), value: "full_bleed" }
            ]}
          />
          <Form.Upload
            layout="portrait"
            label={t("backend.forms.logo")}
            accepts="images"
            readFrom="attributes[logoStyles][small]"
            name="attributes[logo]"
            remove="attributes[removeLog]"
            instructions={t("backend.forms.logo_instructions", {
              entity: modelLabel
            })}
          />
          <Form.TextInput
            label={t("backend.forms.background_color")}
            name="attributes[heroBackgroundColor]"
            placeholder="#52e3ac"
            instructions={t("backend.forms.background_color_instructions")}
            wide
          />
          <Form.TextArea
            label={t("backend.forms.image_credits")}
            name="attributes[imageCredits]"
            placeholder={t("backend.forms.image_credits_placeholder")}
            instructions={t("backend.forms.image_credits_instructions")}
            height={250}
            wide
          />
          <Form.Save text={t("actions.save")} />
        </FormContainer.Form>
      </section>
    </Authorize>
  );
}

JournalDescription.propTypes = {
  model: PropTypes.object.isRequired,
  modelLabel: PropTypes.string.isRequired,
  api: PropTypes.object.isRequired,
  failureRedirectRoute: PropTypes.string.isRequired,
  closeDrawer: PropTypes.func,
  withDarkMode: PropTypes.bool,
  headerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default JournalDescription;

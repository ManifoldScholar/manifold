import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";
import { useTranslation } from "react-i18next";

function ProjectDescription({
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
          icon="projects64"
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
          <Form.Upload
            layout="portrait"
            label={t("backend.forms.cover_image")}
            accepts="images"
            readFrom="attributes[coverStyles][small]"
            name="attributes[cover]"
            remove="attributes[removeCover]"
            instructions={t("backend.forms.cover_image_instructions", {
              entity: modelLabel
            })}
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

ProjectDescription.propTypes = {
  model: PropTypes.object.isRequired,
  modelLabel: PropTypes.string.isRequired,
  api: PropTypes.object.isRequired,
  failureRedirectRoute: PropTypes.string.isRequired,
  closeDrawer: PropTypes.func,
  withDarkMode: PropTypes.bool,
  headerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ProjectDescription;

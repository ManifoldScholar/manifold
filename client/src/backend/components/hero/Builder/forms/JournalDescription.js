import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import { useTranslation } from "react-i18next";

function JournalDescription({
  modelLabel,
  failureRedirectRoute,
  api,
  headerId,
  withDarkMode = true,
  model,
  closeDrawer,
  setDirty
}) {
  const maybeCloseDrawer = useCallback(() => {
    if (!closeDrawer) return;
    closeDrawer();
  }, [closeDrawer]);
  const { t } = useTranslation();

  const onDirty = session => {
    const dirtyAttrs = Object.keys(session.attributes).length;
    const dirtyRels = Object.keys(session.relationships).length;
    setDirty(dirtyAttrs || dirtyRels);
  };

  const formatData = data => {
    const { logoAltText, logo, heroAltText, hero, ...rest } =
      data?.attributes ?? {};

    const finalLogoData =
      typeof logoAltText === "string"
        ? { ...logo, altText: logoAltText }
        : logo;

    const finalHeroData =
      typeof heroAltText === "string"
        ? { ...hero, altText: heroAltText }
        : hero;

    return {
      ...data,
      attributes: { logo: finalLogoData, hero: finalHeroData, ...rest }
    };
  };

  return (
    <Authorize
      entity={model}
      ability="update"
      failureNotification
      failureRedirect={lh.link(failureRedirectRoute, model.id)}
    >
      <section>
        <Layout.DrawerHeader
          icon="journals64"
          title={t("layout.description_and_images")}
          headerId={headerId}
        />
        <FormContainer.Form
          model={model}
          name="backend-hero-update"
          update={api.update}
          create={api.create}
          className="form-secondary"
          onSuccess={maybeCloseDrawer}
          onDirty={onDirty}
          formatData={formatData}
        >
          {withDarkMode && (
            <Form.Switch
              label={t("hero.dark_mode")}
              name="attributes[darkMode]"
            />
          )}
          <Form.TextArea
            wide
            focusOnMount
            height={250}
            label={t("common.description")}
            name="attributes[description]"
            placeholder={t("hero.description_placeholder", {
              entity: modelLabel
            })}
            instructions={t("hero.description_instructions", {
              entity: modelLabel
            })}
          />
          <Form.Upload
            layout="landscape"
            accepts="images"
            label={t("hero.image_label")}
            readFrom="attributes[heroStyles][small]"
            name="attributes[hero]"
            remove="attributes[removeHero]"
            instructions={t("hero.image_instructions")}
            altTextName="attributes[heroAltText]"
            altTextLabel={t("hero.image_alt_label")}
          />
          <Form.Select
            name="attributes[heroLayout]"
            label={t("hero.layout")}
            options={[
              { label: t("hero.square_inset"), value: "square_inset" },
              { label: t("hero.wide_inset"), value: "wide_inset" },
              { label: t("hero.full_bleed"), value: "full_bleed" }
            ]}
          />
          <Form.Upload
            layout="portrait"
            label={t("journals.forms.logo")}
            accepts="images"
            readFrom="attributes[logoStyles][small]"
            name="attributes[logo]"
            remove="attributes[removeLogo]"
            instructions={t("journals.forms.logo_instructions", {
              entity: modelLabel
            })}
            altTextName="attributes[logoAltText]"
            altTextLabel={t("journals.forms.logo_alt_label")}
          />
          <Form.TextInput
            label={t("hero.background_color")}
            name="attributes[heroBackgroundColor]"
            placeholder="#52e3ac"
            instructions={t("hero.background_color_instructions")}
            wide
          />
          <Form.TextArea
            label={t("hero.image_credits")}
            name="attributes[imageCredits]"
            placeholder={t("hero.image_credits_placeholder")}
            instructions={t("hero.image_credits_instructions")}
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
  headerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setDirty: PropTypes.func
};

export default JournalDescription;

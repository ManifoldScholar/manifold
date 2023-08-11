import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import { useTranslation } from "react-i18next";

function ProjectDescription({
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
    const { coverAltText, cover, heroAltText, hero, ...rest } =
      data?.attributes ?? {};

    const finalCoverData =
      typeof coverAltText === "string"
        ? { ...cover, altText: coverAltText }
        : cover;

    const finalHeroData =
      typeof heroAltText === "string"
        ? { ...hero, altText: heroAltText }
        : hero;

    return {
      ...data,
      attributes: { cover: finalCoverData, hero: finalHeroData, ...rest }
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
          icon="projects64"
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
          <>
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
              altTextName={"attributes[heroAltText]"}
              altTextLabel={t("hero.image_alt_label")}
              wide
            />
            <Form.Upload
              layout="portrait"
              label={t("hero.cover_image")}
              accepts="images"
              readFrom="attributes[coverStyles][small]"
              name="attributes[cover]"
              remove="attributes[removeCover]"
              instructions={t("hero.cover_image_instructions", {
                entity: modelLabel
              })}
              altTextName={"attributes[coverAltText]"}
              altTextLabel={t("hero.cover_image_alt_label")}
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
          </>
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
  headerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setDirty: PropTypes.func
};

export default ProjectDescription;

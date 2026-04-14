import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import { projectsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import mergeImageAltText from "app/routes/utility/helpers/mergeImageAltText";
import FormContainer from "components/global/form/Container";
import Form from "components/global/form";
import Layout from "components/backend/layout";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) => projectsAPI.update(params.id, data),
  redirectTo: ({ params }) => `/backend/projects/${params.id}/layout`
});

function formatData(dirty, source) {
  const merged = {
    attributes: { ...source.attributes, ...dirty.attributes },
    relationships: { ...dirty.relationships }
  };

  return {
    ...merged,
    attributes: mergeImageAltText(merged.attributes, "cover", "hero")
  };
}

export default function ProjectHeroEdit() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const { project } = useOutletContext() ?? {};

  return (
    <section>
      <Layout.DrawerHeader
        icon="projects64"
        title={t("layout.description_and_images")}
      />
      <FormContainer.Form
        model={project}
        fetcher={fetcher}
        formatData={formatData}
        className="form-secondary"
        notifyOnSuccess
      >
        {!project.attributes.isJournalIssue && (
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
            entity: t("glossary.project_one")
          })}
          instructions={t("hero.description_instructions", {
            entity: t("glossary.project_one")
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
            entity: t("glossary.project_one")
          })}
          altTextName="attributes[coverAltText]"
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
        <Form.Save text={t("actions.save")} />
      </FormContainer.Form>
    </section>
  );
}

import { useTranslation, Trans } from "react-i18next";
import { useFetcher } from "react-router";
import { projectsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import authorize from "app/routes/utility/loaders/authorize";
import Form from "components/global/form";
import FormContainer from "global/containers/form";
import PageHeader from "components/backend/layout/PageHeader";
import Layout from "components/backend/layout";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";

const DEFAULT_PROJECT = {
  attributes: {
    configuration: {
      multipleTexts: true,
      resources: true,
      markdown: true,
      recentActivity: true
    }
  }
};

export const loader = ({ request, context }) => {
  return authorize({
    request,
    context,
    ability: "create",
    entity: "project"
  });
};

export const action = formAction({
  mutation: ({ data }) => projectsAPI.create(data),
  redirectTo: ({ result }) => `/backend/projects/${result.data.id}`
});

export default function ProjectsNewRoute() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  const layoutInstructions = (
    <Trans
      i18nKey="projects.forms.new.layout_instructions"
      components={[
        <a
          href="https://manifoldscholar.github.io/manifold-docusaurus/docs/backend/projects#creating-projects"
          target="_blank"
          rel="noopener noreferrer"
        >
          #
        </a>
      ]}
    />
  );

  const breadcrumbs = [
    {
      to: "/backend/projects",
      label: t("glossary.project_title_case_other")
    },
    {
      to: "/backend/projects/new",
      label: t("common.new")
    }
  ];

  return (
    <>
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <PageHeader
        type="project"
        backUrl="/backend/projects"
        backLabel={t("glossary.project_title_case_other")}
        title={t("projects.forms.new.title")}
        note={t("projects.forms.new.instructions")}
      />
      <Layout.BackendPanel>
        <FormContainer.Form
          fetcher={fetcher}
          model={DEFAULT_PROJECT}
          className="form-secondary"
        >
          <Form.FieldGroup
            label={t("projects.forms.new.title_descript_header")}
          >
            <Form.TextInput
              validation={["required"]}
              focusOnMount
              label={t("projects.forms.title_label")}
              name="attributes[title]"
              placeholder={t("projects.forms.title_placeholder")}
            />
            <Form.TextInput
              label={t("projects.forms.subtitle_label")}
              name="attributes[subtitle]"
              placeholder={t("projects.forms.subtitle_placeholder")}
            />
            <Form.TextArea
              label={t("projects.forms.new.descript_label")}
              name="attributes[description]"
              height={100}
              wide
            />
          </Form.FieldGroup>
          <Form.FieldGroup
            label={t("projects.forms.new.layout_header")}
            instructions={layoutInstructions}
          >
            <Form.Radios
              label={t("glossary.text_title_case_other")}
              prompt={t("projects.forms.new.texts_prompt")}
              name="attributes[configuration][multipleTexts]"
              instructions={t("projects.forms.new.texts_instructions")}
              options={[
                { label: t("common.yes"), value: true },
                { label: t("common.no"), value: false }
              ]}
              inline
              wide
            />
            <Form.Radios
              label={t("glossary.resource_title_case_other")}
              prompt={t("projects.forms.new.resources_prompt")}
              name="attributes[configuration][resources]"
              instructions={t("projects.forms.new.resources_instructions")}
              options={[
                { label: t("common.yes"), value: true },
                { label: t("common.no"), value: false }
              ]}
              inline
              wide
            />
            <Form.Radios
              label={t("projects.forms.new.extended_descript_label")}
              prompt={t("projects.forms.new.extended_descript_prompt")}
              name="attributes[configuration][markdown]"
              instructions={t(
                "projects.forms.new.extended_descript_instructions"
              )}
              options={[
                { label: t("common.yes"), value: true },
                { label: t("common.no"), value: false }
              ]}
              inline
              wide
            />
            <Form.Radios
              label={t("projects.activity")}
              prompt={t("projects.forms.new.activity_prompt")}
              name="attributes[configuration][recentActivity]"
              instructions={t("projects.forms.new.activity_instructions")}
              options={[
                { label: t("common.yes"), value: true },
                { label: t("common.no"), value: false }
              ]}
              inline
              wide
            />
          </Form.FieldGroup>
          <Form.Save
            text={t("projects.forms.new.save")}
            cancelRoute="/backend/projects"
          />
        </FormContainer.Form>
      </Layout.BackendPanel>
    </>
  );
}

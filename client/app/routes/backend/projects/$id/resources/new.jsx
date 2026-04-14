import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import FormContainer from "components/global/form/Container";
import Layout from "components/backend/layout";
import Form from "components/global/form";
import PageHeader from "components/backend/layout/PageHeader";
import Resource from "components/backend/resource";
import { resourcesAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import { getResourceBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";
import mergeImageAltText from "app/routes/utility/helpers/mergeImageAltText";

const DEFAULT_RESOURCE = { attributes: { kind: "image" } };

const formatData = data => {
  const { attributes, relationships } = data ?? {};
  const merged = mergeImageAltText(attributes, "attachment");

  return {
    relationships,
    attributes: merged
  };
};

export const action = formAction({
  mutation: ({ data, params }) => resourcesAPI.create(params.id, data),
  redirectTo: ({ result }) => `/backend/projects/resource/${result.data.id}`
});

export default function ResourceNew() {
  const project = useOutletContext();
  const { t } = useTranslation();
  const fetcher = useFetcher();

  const belongsToJournalIssue = project.attributes.isJournalIssue;
  const breadcrumbs = getResourceBreadcrumbs(
    null,
    project,
    belongsToJournalIssue,
    t
  );

  return (
    <>
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
      <PageHeader
        type="list"
        title={t("resources.new.title")}
        titleTag="h2"
        hideBreadcrumbs
      />
      <Layout.BackendPanel>
        <FormContainer.Form
          model={DEFAULT_RESOURCE}
          fetcher={fetcher}
          formatData={formatData}
          className="form-secondary"
        >
          <Resource.Form.KindPicker name="attributes[kind]" includeButtons />
          <Form.TextInput
            label={t("resources.title_label")}
            name="attributes[title]"
            placeholder={t("resources.title_placeholder")}
            wide
          />
          <Form.TextArea
            label={t("resources.descript_label")}
            name="attributes[description]"
            placeholder={t("resources.descript_placeholder")}
            wide
          />
          <Resource.Form.KindAttributes />
          <Form.Errorable name="attributes[fingerprint]" />
          <Form.Save
            text={t("resources.new.save")}
            cancelRoute={`/backend/projects/${project.id}/resources`}
          />
        </FormContainer.Form>
      </Layout.BackendPanel>
    </>
  );
}

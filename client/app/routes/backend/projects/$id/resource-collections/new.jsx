import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import FormContainer from "components/global/form/Container";
import Layout from "components/backend/layout";
import Form from "components/global/form";
import PageHeader from "components/backend/layout/PageHeader";
import { resourceCollectionsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import { getResourceCollectionBreadcrumbs } from "helpers/breadcrumbs";
import mergeImageAltText from "lib/react-router/helpers/mergeImageAltText";

const formatData = data => ({
  ...data,
  attributes: mergeImageAltText(data?.attributes, "thumbnail")
});

export const action = formAction({
  mutation: ({ data, params }) =>
    resourceCollectionsAPI.create(params.id, data),
  redirectTo: ({ result }) =>
    `/backend/projects/resource-collection/${result.data.id}/properties`
});

export default function ResourceCollectionNew() {
  const project = useOutletContext();
  const { t } = useTranslation();
  const fetcher = useFetcher();

  const belongsToJournalIssue = project.attributes.isJournalIssue;
  const breadcrumbs = getResourceCollectionBreadcrumbs(
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
        title={t("resource_collections.forms.new_title")}
        titleTag="h2"
        hideBreadcrumbs
      />
      <Layout.BackendPanel>
        <FormContainer.Form
          fetcher={fetcher}
          formatData={formatData}
          className="form-secondary"
        >
          <Form.TextInput
            label={t("resource_collections.forms.title_label")}
            name="attributes[title]"
            focusOnMount
            wide
            placeholder={t("resource_collections.forms.title_placeholder")}
          />
          <Form.TextArea
            label={t("resource_collections.forms.descript_label")}
            name="attributes[description]"
            placeholder={t("resource_collections.forms.descript_placeholder")}
            wide
          />
          <Form.Upload
            layout="landscape"
            accepts="images"
            label={t("resource_collections.forms.image_label")}
            readFrom="attributes[thumbnailStyles][small]"
            name="attributes[thumbnail]"
            remove="attributes[removeThumbnail]"
            altTextName="attributes[thumbnailAltText]"
            altTextLabel={t("hero.cover_image_alt_label")}
          />
          <Form.Save
            text={t("resource_collections.forms.new_save")}
            cancelRoute={`/backend/projects/${project.id}/resources`}
          />
        </FormContainer.Form>
      </Layout.BackendPanel>
    </>
  );
}

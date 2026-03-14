import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import FormContainer from "global/containers/form";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import PageHeader from "backend/components/layout/PageHeader";
import { resourceCollectionsAPI, projectsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getResourceCollectionBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";
import authorize from "app/routes/utility/loaders/authorize";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import mergeImageAltText from "app/routes/utility/helpers/mergeImageAltText";

const formatData = data => ({
  ...data,
  attributes: mergeImageAltText(data?.attributes, "thumbnail")
});

export const loader = async ({ params, context, request }) => {
  const project = await loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.id),
    request
  });
  await authorize({
    request,
    context,
    entity: project,
    ability: "createResourceCollections"
  });
  return project;
};

export async function action({ request, context, params }) {
  const data = await request.json();
  try {
    const result = await queryApi(
      resourceCollectionsAPI.create(params.id, data),
      context
    );
    if (result?.errors) return { errors: result.errors };
    throw redirect(
      `/backend/projects/resource-collection/${result.data.id}/properties`
    );
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ResourceCollectionNew({ loaderData: project }) {
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

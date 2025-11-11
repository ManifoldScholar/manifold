import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import FormContainer from "global/containers/form";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import PageHeader from "backend/components/layout/PageHeader";
import { requests, resourceCollectionsAPI, projectsAPI } from "api";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "./breadcrumbs";
import { useFetch } from "hooks";

import Authorize from "hoc/Authorize";

const formatData = data => {
  const { thumbnailAltText, thumbnail, ...rest } = data?.attributes ?? {};

  const finalThumbnailData =
    typeof thumbnailAltText === "string"
      ? { ...thumbnail, altText: thumbnailAltText }
      : thumbnail;

  return {
    ...data,
    attributes: { thumbnail: finalThumbnailData, ...rest }
  };
};

function ResourceCollectionNewContainer() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data: project } = useFetch({
    request: [projectsAPI.show, projectId]
  });

  const redirectToCollection = resourceCollection => {
    const path = lh.link("backendResourceCollection", resourceCollection.id);
    navigate(path);
  };

  const handleSuccess = resourceCollection => {
    redirectToCollection(resourceCollection);
  };

  if (!project) return null;

  const belongsToJournalIssue = project.attributes.isJournalIssue;

  const breadcrumbs = getBreadcrumbs(null, project, belongsToJournalIssue, t);

  const parentProps = {
    parentTitle: project.attributes.titleFormatted,
    parentSubtitle: project.attributes.subtitle,
    parentId: project.id
  };

  return (
    <Authorize
      entity={project}
      ability={"createResourceCollections"}
      failureNotification
      failureRedirect={lh.link("backendProject", project.id)}
    >
      <HeadContent
        title={`${t(`titles.resource_collection_new`)} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <div>
        <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
        <PageHeader
          type="resourceCollection"
          backUrl={lh.link("backendProjectResourceCollections", project.id)}
          backLabel={project.attributes.titlePlaintext}
          title={t("resource_collections.forms.new_title")}
          note={t("resource_collections.forms.new_instructions")}
          icon="ResourceCollection64"
          {...parentProps}
        />
        <Layout.BackendPanel>
          <FormContainer.Form
            model={null}
            name={requests.beResourceCollectionCreate}
            update={resourceCollectionsAPI.update}
            create={model => resourceCollectionsAPI.create(project.id, model)}
            onSuccess={handleSuccess}
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
              cancelRoute={lh.link("backendProjectResources", project.id)}
            />
          </FormContainer.Form>
        </Layout.BackendPanel>
      </div>
    </Authorize>
  );
}

ResourceCollectionNewContainer.displayName = "ResourceCollection.New";

export default ResourceCollectionNewContainer;

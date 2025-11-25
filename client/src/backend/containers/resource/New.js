import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import FormContainer from "global/containers/form";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import PageHeader from "backend/components/layout/PageHeader";
import Resource from "backend/components/resource";
import GlobalForm from "global/components/form";
import { projectsAPI, resourcesAPI } from "api";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "./breadcrumbs";
import { useFetch } from "hooks";

import Authorize from "hoc/Authorize";

const DEFAULT_RESOURCE = { attributes: { kind: "image" } };

const formatData = data => {
  const { attributes, relationships } = data ?? {};
  const { attachment: attachmentData, attachmentAltText, ...rest } = attributes;

  return {
    relationships,
    attributes: {
      ...rest,
      attachment: {
        ...attachmentData,
        altText: attributes.kind === "image" ? attachmentAltText : null
      }
    }
  };
};

function ResourceNewContainer() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data: project } = useFetch({
    request: [projectsAPI.show, projectId]
  });

  const redirectToResource = resource => {
    const path = lh.link("backendResource", resource.id);
    navigate(path);
  };

  const handleSuccess = resource => {
    redirectToResource(resource);
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
      ability={"createResources"}
      failureNotification
      failureRedirect={lh.link("backendProject", project.id)}
    >
      <HeadContent
        title={`${t(`titles.resource_new`)} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <div>
        <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
        <PageHeader
          type="resource"
          backUrl={lh.link("backendProjectResources", project.id)}
          backLabel={project.attributes.titlePlaintext}
          title={t("resources.new.title")}
          note={t("resources.new.instructions")}
          icon="BEResourcesBox64"
          {...parentProps}
        />
        <Layout.BackendPanel>
          <FormContainer.Form
            model={DEFAULT_RESOURCE}
            name="backend-resource-create"
            update={resourcesAPI.update}
            create={model => resourcesAPI.create(project.id, formatData(model))}
            onSuccess={handleSuccess}
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
            <GlobalForm.Errorable name="attributes[fingerprint]" />
            <Form.Save
              text={t("resources.new.save")}
              cancelRoute={lh.link("backendProjectResources", project.id)}
            />
          </FormContainer.Form>
        </Layout.BackendPanel>
      </div>
    </Authorize>
  );
}

ResourceNewContainer.displayName = "Resource.New";

export default ResourceNewContainer;

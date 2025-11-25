import { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { projectsAPI, contentBlocksAPI, requests } from "api";
import { useApiCallback } from "hooks";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import ContentBlock from "backend/components/content-block";
import lh from "helpers/linkHandler";

export default function ProjectContentFormContainer({
  contentBlock: contentBlockProp,
  project
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isPendingBlock = contentBlockProp?.id === "pending";

  const contentBlock = useMemo(() => {
    if (isPendingBlock) {
      return { ...contentBlockProp, id: null };
    }
    return contentBlockProp;
  }, [contentBlockProp, isPendingBlock]);

  const requestName = isPendingBlock
    ? requests.beContentBlockCreate
    : requests.beContentBlockUpdate;

  const fetchContentBlocks = useApiCallback(projectsAPI.contentBlocks, {
    requestKey: requests.beProjectContentBlocks
  });

  const closeDrawer = useCallback(() => {
    if (project?.id) {
      fetchContentBlocks(project.id);
    }
    navigate(lh.link("backendProjectLayout", project?.id), {
      state: { noScroll: true }
    });
  }, [fetchContentBlocks, navigate, project?.id]);

  // We manually assign these values because they come from the pending block, which acts as the
  // source model. Since those values aren't changed, they are not passed to the update request
  // on their own.
  const create = useCallback(
    model => {
      const adjusted = { ...model };
      adjusted.attributes.position = contentBlock.attributes.position;
      adjusted.attributes.type = contentBlock.attributes.type;

      return contentBlocksAPI.create(project.id, adjusted);
    },
    [contentBlock, project]
  );

  if (!contentBlock || !project) return null;

  return (
    <FormContainer.Form
      model={contentBlock}
      name={requestName}
      update={contentBlocksAPI.update}
      create={create}
      onSuccess={closeDrawer}
      className="form-secondary"
      notificationScope="drawer"
    >
      <ContentBlock.TypeForm
        contentBlock={contentBlockProp}
        project={project}
      />
      <Form.Save text={t("actions.save")} />
    </FormContainer.Form>
  );
}

ProjectContentFormContainer.displayName = "Project.Content.Form";

ProjectContentFormContainer.propTypes = {
  contentBlock: PropTypes.object,
  project: PropTypes.object
};

import { useCallback } from "react";
import Form from "global/components/form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { projectsAPI } from "api";

function ProjectContentTypeFormResources({ project, getModelValue }) {
  const { t } = useTranslation();

  const showAllCollections = getModelValue("attributes[showAllCollections]");
  const showResources = getModelValue("attributes[showResources]");
  const collections = project.relationships.resourceCollections;

  const fetchResources = useCallback(() => projectsAPI.resources(project.id), [
    project.id
  ]);

  return (
    <>
      <Form.TextInput
        label={t("common.title")}
        name="attributes[title]"
        instructions={t("content_blocks.resources.default_title_message")}
        focusOnMount
        wide
      />
      <Form.TextArea
        label={t("common.description")}
        name="attributes[description]"
        wide
      />
      <Form.Switch
        label={t("content_blocks.resources.collections_switch")}
        instructions={t("content_blocks.resources.collections_switch_info")}
        name="attributes[showAllCollections]"
        wide
        isPrimary
      />
      {!showAllCollections ? (
        <>
          <Form.Picker
            placeholder={t(
              "content_blocks.resources.select_collection_placeholder"
            )}
            label={t("content_blocks.resources.select_collection")}
            optionToLabel={rc => rc.attributes.title}
            name="relationships[featuredCollections]"
            options={collections}
            listStyle="rows"
            showAddRemoveAll
            reorderable
            listRowComponent="FormOptionRow"
          />
        </>
      ) : null}
      <Form.Switch
        label={t("content_blocks.resources.resources_switch")}
        instructions={t("content_blocks.resources.resources_switch_info")}
        name="attributes[showResources]"
        wide
        isPrimary
      />
      {showResources ? (
        <>
          <Form.Picker
            placeholder={t(
              "content_blocks.resources.select_resource_placeholder"
            )}
            label={t("content_blocks.resources.select_resources")}
            instructions={t("content_blocks.resources.select_resources_info")}
            optionToLabel={r => r.attributes.title}
            name="relationships[featuredResources]"
            options={fetchResources}
            listStyle="rows"
            reorderable
            predictive
            listRowComponent="FormOptionRow"
          />
        </>
      ) : null}
    </>
  );
}

ProjectContentTypeFormResources.displayName =
  "Project.Content.TypeForm.Types.Resources";

ProjectContentTypeFormResources.propTypes = {
  project: PropTypes.object.isRequired,
  getModelValue: PropTypes.func.isRequired
};

export default ProjectContentTypeFormResources;

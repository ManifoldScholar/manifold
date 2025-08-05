import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Utility from "frontend/components/utility";
import { projectsAPI } from "api";
import { useFetch, usePaginationState } from "hooks";
import {
  Search,
  ResourceRow,
  ResourceCollectionRow
} from "backend/components/list/EntitiesList";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import withFilteredLists, { keywordFilter } from "hoc/withFilteredLists";
import * as Styled from "./styles";

const EMBEDDABLE_KINDS = ["video", "audio", "interactive"];

function AddResourceAnnotationForm({
  projectId,
  pendingAnnotation,
  createAnnotation,
  entitiesListSearchProps,
  closeDrawer
}) {
  const { t } = useTranslation();

  const [visible, setVisible] = useState("resources");
  const [selected, setSelected] = useState(null);

  const [resourcesPagination, setResourcesPage] = usePaginationState(1, 5);
  const [collectionsPagination, setCollectionsPage] = usePaginationState(1, 5);

  const { data: resources, meta: resourcesMeta } = useFetch({
    request: [projectsAPI.resources, projectId, null, resourcesPagination]
  });

  const { data: collections, meta: collectionsMeta } = useFetch({
    request: [
      projectsAPI.resourceCollections,
      projectId,
      null,
      collectionsPagination
    ]
  });

  const onPageChange = page => () => {
    return visible === "resources"
      ? setResourcesPage(page)
      : setCollectionsPage(page);
  };

  const toggleActive = () => {
    const next = visible === "resources" ? "collections" : "resources";
    setVisible(next);
  };

  const listProps =
    visible === "resources"
      ? {
          entityComponent: ResourceRow,
          entities: resources || [],
          pagination: resourcesPagination,
          unit: t("glossary.resource", {
            count: resourcesMeta?.pagination?.totalCount || 0
          })
        }
      : {
          entityComponent: ResourceCollectionRow,
          entities: collections || [],
          pagination: collectionsPagination,
          unit: t("glossary.resource_collection", {
            count: collectionsMeta?.pagination?.totalCount || 0
          })
        };

  const handleSubmit = data => {
    /* eslint-disable-next-line no-nested-ternary */
    const readerDisplayFormat = data.block
      ? data.embed
        ? "embed"
        : "block"
      : "inline";

    const format = visible === "resources" ? "resource" : "resource_collection";
    const annotation = {
      attributes: { ...pendingAnnotation, format, readerDisplayFormat }
    };
    return createAnnotation(annotation, { notation: selected });
  };

  return (
    <FormContainer.Form
      handleSubmitOverride={handleSubmit}
      name="reader-create-resource-annotation"
    >
      {getModelValue => (
        <>
          <div>
            <Utility.Toggle
              handleToggle={toggleActive}
              selected={visible}
              label=""
              optionOne={{
                translatedLabel: t("glossary.resource_other"),
                label: "resources",
                icon: "resource24"
              }}
              optionTwo={{
                translatedLabel: t("glossary.collection_other"),
                label: "collections",
                icon: "resourceCollection64"
              }}
            />
            <Styled.List
              {...listProps}
              callbacks={{
                onPageClick: onPageChange
              }}
              entityComponentProps={{
                onRowClick: entity => setSelected(entity),
                rowClickMode: "block",
                active: selected?.id
              }}
              search={<Search {...entitiesListSearchProps("notations")} />}
            />
          </div>
          <Form.Switch
            label="Display as block?"
            instructions="Add some instructions here"
            name="block"
          />
          {getModelValue("block") && (
            <Form.Switch
              label="Interactive?"
              instructions="Add some instructions here"
              name="embed"
              disabled={!EMBEDDABLE_KINDS.includes(selected?.attributes.kind)}
            />
          )}
          <Form.DrawerButtons
            showCancel
            submitLabel="actions.save"
            onCancelClick={closeDrawer}
          />
        </>
      )}
    </FormContainer.Form>
  );
}

AddResourceAnnotationForm.displayName =
  "ReaderContainer.ResourceAnnotation.AddForm";

AddResourceAnnotationForm.propTypes = {
  projectId: PropTypes.string,
  resources: PropTypes.array,
  resourcesMeta: PropTypes.object,
  resourceCollections: PropTypes.array,
  resourceCollectionsMeta: PropTypes.object,
  dispatch: PropTypes.func,
  selectionHandler: PropTypes.func
};

export default withFilteredLists(AddResourceAnnotationForm, {
  notations: keywordFilter()
});

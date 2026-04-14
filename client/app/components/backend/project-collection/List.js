import PropTypes from "prop-types";
import { useNavigate, useRevalidator } from "react-router";
import { useTranslation } from "react-i18next";
import ListItem from "./ListItem";
import EntitiesList from "components/backend/list/EntitiesList";
import { useParams } from "react-router";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { projectCollectionsAPI } from "api";
import { useApiCallback } from "hooks";

function ProjectCollectionList(props) {
  const { projectCollections, setScreenReaderStatus } = props ?? {};

  const { id } = useParams();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const onCollectionSelect = collection => {
    navigate(`/backend/projects/project-collections/${collection.id}`);
  };

  const updateProjectCollection = useApiCallback(projectCollectionsAPI.update);

  const onCollectionOrderChange = async result => {
    const { id: collectionId, title, position, announce, callback } = result;
    const changes = { attributes: { position } };
    const announcement = t("actions.dnd.moved_to_position", {
      title,
      position
    });

    await updateProjectCollection(collectionId, changes);
    revalidate();

    if (announce) {
      setScreenReaderStatus(announcement);
    }

    if (callback && typeof callback === "function") {
      callback();
    }
  };

  const onToggleVisibility = (pc, visible) => {
    const changes = { attributes: { visible } };
    updateProjectCollection(pc.id, changes);
    revalidate();
  };

  return (
    <EntitiesList
      entities={projectCollections}
      entityComponent={ListItem}
      entityComponentProps={{
        active: id,
        clickHandler: onCollectionSelect,
        visibilityToggleHandler: onToggleVisibility,
        onReorder: onCollectionOrderChange,
        itemCount: projectCollections.length
      }}
      useDragHandle
      listStyle="bare"
      callbacks={{
        onReorder: onCollectionOrderChange
      }}
    />
  );
}

export default withScreenReaderStatus(ProjectCollectionList, false);

ProjectCollectionList.displayName = "ProjectCollection.List";

ProjectCollectionList.propTypes = {
  projectCollections: PropTypes.array
};

import PropTypes from "prop-types";
import ListItem from "./ListItem";
import EntitiesList from "backend/components/list/EntitiesList";
import { useParams } from "react-router-dom";

export default function ProjectCollectionList(props) {
  const {
    projectCollections,
    onCollectionSelect,
    onToggleVisibility,
    onCollectionOrderChange
  } = props ?? {};

  const { id } = useParams();

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

ProjectCollectionList.displayName = "ProjectCollection.List";

ProjectCollectionList.propTypes = {
  projectCollection: PropTypes.object,
  projectCollections: PropTypes.array,
  onCollectionSelect: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onCollectionOrderChange: PropTypes.func.isRequired,
  match: PropTypes.object
};

import { useRevalidator } from "react-router";
import EntitiesList, {
  ProjectRow,
  CollectionProjectRow
} from "components/backend/list/EntitiesList";
import { projectCollectionsAPI } from "api";
import { useApiCallback } from "hooks";

export default function Manual({ projectCollection, collectionProjects }) {
  const { revalidate } = useRevalidator();

  const isManuallySorted = projectCollection.attributes.manuallySorted;

  const entities = isManuallySorted
    ? collectionProjects
    : collectionProjects.map(cp => cp.relationships.project);

  const linkState = {
    id: projectCollection.id,
    label: projectCollection.attributes.title
  };

  const updateCollectionProject = useApiCallback(
    projectCollectionsAPI.updateCollectionProject
  );

  const handleProjectOrderChange = async result => {
    if (!projectCollection) return;
    const changes = { attributes: { position: result.position } };
    await updateCollectionProject(projectCollection.id, result.id, changes);
    revalidate();
  };

  const callbacks = isManuallySorted
    ? { onReorder: handleProjectOrderChange }
    : {};

  return (
    <EntitiesList
      entityComponent={isManuallySorted ? CollectionProjectRow : ProjectRow}
      entityComponentProps={{ linkState }}
      entities={entities}
      listStyle="rows"
      sortableStyle="tight"
      callbacks={callbacks}
    />
  );
}

Manual.displayName = "ProjectCollectionDetail.Manual";

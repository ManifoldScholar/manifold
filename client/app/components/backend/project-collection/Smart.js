import EntitiesList, { ProjectRow } from "components/backend/list/EntitiesList";

export default function Smart({ projectCollection, collectionProjects }) {
  const linkState = {
    id: projectCollection.id,
    label: projectCollection.attributes.title
  };

  const projects = collectionProjects.map(cp => cp.relationships.project);

  return (
    <EntitiesList
      entityComponent={ProjectRow}
      entityComponentProps={{ linkState }}
      entities={projects}
      listStyle="grid"
    />
  );
}

Smart.displayName = "ProjectCollectionDetail.Smart";

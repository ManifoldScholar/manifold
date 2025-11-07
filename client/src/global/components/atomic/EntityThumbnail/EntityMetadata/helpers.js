export function getGenericMetadataProps({ entity }) {
  const data = entity?.attributes;
  const title = data.titleFormatted ?? data.title;
  const subtitle = data.subtitle;
  const description = data.description;
  const draft = data.draft;
  const recentlyUpdated = data.recentlyUpdated;

  return {
    title,
    subtitle,
    draft,
    description,
    recentlyUpdated
  };
}

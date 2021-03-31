export function reorderCategories(categories, sortedCollection) {
  if (categories?.length < 1 || sortedCollection?.length < 1) return [];
  const sorted = categories.sort(function(a, b) {
    const sortedA = sortedCollection.find(category => (category.id = a.id));
    const sortedB = sortedCollection.find(category => (category.id = b.id));
    return sortedA.position - sortedB.position;
  });
  return sorted;
}

export function getResponse(id, responses) {
  return responses.find(res => res.id === id);
}

export function idInResponses(id, responses) {
  if (responses?.length < 1) return false;
  return responses.map(res => res.id).includes(id);
}

export function getCollectableTitle(response) {
  const { attributes, type } = response;
  if (type === "textSections")
    return `${attributes.name} <i>in ${attributes.textTitle}</i>`;
  return attributes.title;
}

export function getCollectableIcon(type) {
  switch (type) {
    case "projects":
      return "projects64";
    case "texts":
      return "textsLoosePages64";
    case "textSections":
      return "toc64";
    case "resourceCollections":
      return "resourceCollection64";
    case "resources":
      return "resources64";
    default:
      return "resources64";
  }
}

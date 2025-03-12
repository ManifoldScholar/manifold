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
    case "journalIssues":
      return "journals64";
    default:
      return "resources64";
  }
}

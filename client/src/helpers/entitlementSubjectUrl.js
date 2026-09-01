import capitalize from "lodash/capitalize";

export default function entitlementSubjectUrlFromSearchResult(result) {
  return `gid://entitlements/${capitalize(result.attributes.searchableType)}/${
    result.attributes.searchableId
  }`;
}

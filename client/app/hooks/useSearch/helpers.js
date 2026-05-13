import queryString from "query-string";

export const hasSearchableQuery = queryState => {
  if (!queryState) return false;
  return queryState.keyword?.trim();
};

export const parseQueryFromUrl = search => {
  const params = queryString.parse(search);
  const query = {
    keyword: params.keyword || "",
    scope: params.scope || null,
    /* eslint-disable no-nested-ternary */
    facets: params.facets
      ? Array.isArray(params.facets)
        ? params.facets
        : params.facets.split(",")
      : [],
    page: params.page ? parseInt(params.page, 10) : 1,
    perPage: params.perPage ? parseInt(params.perPage, 10) : 20,
    project: params.project || null,
    text: params.text || null,
    textSection: params.textSection || null,
    sort: params.sort || "updated"
  };
  return query;
};

export const scopeToPatch = (scope, scopes) => {
  const cleared = scopes.reduce((acc, s) => {
    if (s.paramName) acc[s.paramName] = null;
    return acc;
  }, {});
  const selected = scopes.find(s => s.value === scope);
  const set =
    selected?.paramName && selected?.paramValue
      ? { [selected.paramName]: selected.paramValue }
      : {};
  return { scope, ...cleared, ...set };
};

export const serializeQueryToUrl = query => {
  const params = {};
  if (query.keyword) params.keyword = query.keyword;
  if (query.scope) params.scope = query.scope;
  if (query.facets && query.facets.length > 0) {
    params.facets = query.facets.join(",");
  }
  if (query.page && query.page > 1) params.page = query.page;
  if (query.perPage && query.perPage !== 20) params.perPage = query.perPage;
  if (query.project) params.project = query.project;
  if (query.text) params.text = query.text;
  if (query.textSection) params.textSection = query.textSection;
  if (query.sort && query.sort !== "updated") params.sort = query.sort;
  return queryString.stringify(params);
};

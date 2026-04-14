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
    project: params.project || null,
    text: params.text || null,
    textSection: params.textSection || null
  };
  return query;
};

export const serializeQueryToUrl = query => {
  const params = {};
  if (query.keyword) params.keyword = query.keyword;
  if (query.scope) params.scope = query.scope;
  if (query.facets && query.facets.length > 0) {
    params.facets = query.facets.join(",");
  }
  if (query.page && query.page > 1) params.page = query.page;
  if (query.project) params.project = query.project;
  if (query.text) params.text = query.text;
  if (query.textSection) params.textSection = query.textSection;
  return queryString.stringify(params);
};

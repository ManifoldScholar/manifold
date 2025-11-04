export const getAdminModeLabel = ({ currentUser, mode, t }) => {
  if (!currentUser) return null;

  if (mode === "backend") {
    switch (currentUser.attributes.kind) {
      case "project_editor":
      case "project_property_manager":
      case "journal_editor":
        return t("navigation.backend.exit_editor");
      case "project_author":
        return t("navigation.backend.exit_author");
      default:
        return t("navigation.backend.exit_admin");
    }
  } else {
    switch (currentUser.attributes.kind) {
      case "admin":
      case "editor":
      case "project_creator":
      case "marketeer":
        return t("navigation.backend.enter_admin");
      case "project_editor":
      case "project_property_manager":
      case "journal_editor":
        return t("navigation.backend.enter_editor");
      case "project_author": // For now authors will not have access to the backend
      default:
        return null;
    }
  }
};

const FE_ROUTE_MAP = {
  resourceCollectionResource: {
    regex: /^\/projects\/([A-Za-z0-9-]+)\/resource-collection\/([A-Za-z0-9-]+)\/resource/,
    link: `/backend/projects/resource`
  },
  resourceCollection: {
    regex: /^\/projects\/([A-Za-z0-9-]+)\/resource-collection/,
    link: `/backend/projects/resource-collection`
  },
  resource: {
    regex: /^\/projects\/([A-Za-z0-9-]+)\/resource/,
    link: `/backend/projects/resource`
  },
  project: {
    regex: /^\/projects/,
    link: `/backend/projects`,
    hasAdminList: true
  },
  projectCollection: {
    regex: /^\/project-collections/,
    link: `/backend/projects/project-collections`,
    hasAdminList: true
  },
  journal: {
    regex: /^\/journals/,
    link: `/backend/journals`,
    hasAdminList: true
  },
  page: { regex: /^\/page/, link: `/backend/records/pages` },
  readingGroup: {
    regex: /^\/groups/,
    link: `/backend/groups`,
    hasAdminList: true
  }
};

const BE_ROUTE_MAP = {
  resourceCollection: {
    regex: /^\/backend\/projects\/resource-collection/,
    link: `/projects/[pId]/resource-collection/[id]`
  },
  resource: {
    regex: /^\/backend\/projects\/resource/,
    link: `/projects/[pId]/resource/[id]`
  },
  projectCollection: {
    regex: /^\/backend\/projects\/project-collections/,
    link: `/project-collections`,
    hasList: `/project-collections`
  },
  text: {
    regex: /^\/backend\/projects\/text/,
    link: `/projects/[pId]`,
    hasList: true
  },
  project: {
    regex: /^\/backend\/projects/,
    link: `/projects`,
    hasList: true
  },
  journal: {
    regex: /^\/backend\/journals/,
    link: `/journals`,
    hasList: true
  },
  page: { regex: /^\/backend\/records\/pages/, link: `/page` },
  readingGroup: {
    regex: /^\/backend\/groups/,
    link: `/groups`,
    hasList: true
  }
};

const extractIdentifier = (pathname, basePath) => {
  const identifier = pathname.replace(basePath, "").split("/")[1];
  return identifier === "all" ? null : identifier;
};

const getAdminPath = (pathname, fatalError) => {
  if (fatalError && fatalError.type === "AUTHORIZATION")
    return "/backend/dashboard";

  const routeKey = Object.keys(FE_ROUTE_MAP).find(key => {
    return FE_ROUTE_MAP[key]?.regex.test(pathname);
  });
  const route = FE_ROUTE_MAP[routeKey];

  if (!route) return `/backend/dashboard`;

  const identifier = extractIdentifier(pathname, route.regex);

  if (!identifier)
    return route.hasAdminList ? route.link : `/backend/dashboard`;

  return `${route.link}/${identifier}`;
};

const getPageSlug = (id, pages) => {
  return pages?.[id]?.attributes?.slug;
};

const getProjectId = (id, records) => {
  return records?.[id]?.relationships?.project?.data?.id;
};

const handlePageRoute = (id, pages) => {
  if (!id) return `/`;

  const slug = getPageSlug(id, pages);

  return slug ? `${BE_ROUTE_MAP.page.link}/${slug}` : `/`;
};

const handleRouteWithProjectId = (id, entities, routeKey) => {
  if (!id) return `/`;

  const records = entities[`${routeKey}s`];

  const projectId = getProjectId(id, records);

  return projectId
    ? `${BE_ROUTE_MAP[routeKey].link
        .replace("[pId]", projectId)
        .replace("[id]", id)}`
    : `/`;
};

const getFrontendPath = (pathname, entities) => {
  const routeKey = Object.keys(BE_ROUTE_MAP).find(key => {
    return BE_ROUTE_MAP[key]?.regex.test(pathname);
  });

  const route = BE_ROUTE_MAP[routeKey];

  if (!route) return `/`;

  const identifier = extractIdentifier(pathname, route.regex);

  if (routeKey === "page") return handlePageRoute(identifier, entities.pages);
  if (
    routeKey === "resource" ||
    routeKey === "resourceCollection" ||
    routeKey === "text"
  )
    return handleRouteWithProjectId(identifier, entities, routeKey);

  /* eslint-disable no-nested-ternary */
  if (!identifier)
    return route.hasList
      ? typeof route.hasList === "string"
        ? route.hasList
        : route.link
      : `/`;

  return `${route.link}/${identifier}`;
};

export const getDestinationPath = ({
  mode,
  pathname,
  entities,
  fatalError
}) => {
  if (mode === "frontend") return getAdminPath(pathname, fatalError);
  return getFrontendPath(pathname, entities);
};

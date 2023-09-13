export const getAdminModeLabel = ({ currentUser, mode, t }) => {
  if (!currentUser) return null;

  if (mode === "backend") {
    switch (currentUser.attributes.kind) {
      case "project_editor":
      case "project_resource_editor":
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
      case "project_resource_editor":
        return t("navigation.backend.enter_editor");
      case "project_author": // For now authors will not have access to the backend
      default:
        return null;
    }
  }
};

const FE_ROUTE_REGEXES = {
  project: /^\/projects\/(?!(all))([A-Za-z0-9-]+)$/,
  journal: /^\/journals\/(?!(all))([A-Za-z0-9-]+)$/,
  resource: /^\/projects\/([A-Za-z0-9-]+)\/resource\/([A-Za-z0-9-]+)$/,
  resourceCollection: /^\/projects\/([A-Za-z0-9-]+)\/resource-collection\/([A-Za-z0-9-]+)$/,
  projectCollection: /^\/projects\/project-collection\/([A-Za-z0-9?=-]+)$/,
  page: /^\/page\/([A-Za-z0-9-]+)$/
};

const idPattern =
  "[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}";
const idRegex = new RegExp(idPattern, "g");

const BE_ROUTE_REGEXES = {
  project: new RegExp(`^/backend/projects/${idPattern}/`),
  journal: new RegExp(`^/backend/journals/${idPattern}/`),
  resource: new RegExp(`^/backend/projects/resource/${idPattern}/`),
  resourceCollection: new RegExp(
    `^/backend/projects/resource-collection/${idPattern}/`
  ),
  projectCollection: new RegExp(
    `^/backend/projects/project-collections/(${idPattern}|[A-Za-z0-9-]+)`
  ),
  page: /^\/backend\/records\/pages\/([0-9]+)\//
};

const getAdminPath = pathname => {
  if (FE_ROUTE_REGEXES.project.test(pathname)) return `/backend${pathname}`;
  if (FE_ROUTE_REGEXES.journal.test(pathname)) return `/backend${pathname}`;
  if (FE_ROUTE_REGEXES.projectCollection.test(pathname)) {
    const noParams = pathname.split("?").filter(Boolean)[0];
    const slug = noParams.split("/").pop();
    return `/backend/projects/project-collections/${slug}`;
  }
  if (FE_ROUTE_REGEXES.resource.test(pathname)) {
    const slug = pathname.split("/").pop();
    return `/backend/projects/resource/${slug}`;
  }
  if (FE_ROUTE_REGEXES.resourceCollection.test(pathname)) {
    const slug = pathname.split("/").pop();
    return `/backend/projects/resource-collection/${slug}`;
  }
  if (FE_ROUTE_REGEXES.page.test(pathname)) {
    const slug = pathname.split("/").pop();
    return `/backend/records/pages/${slug}`;
  }

  return `/backend/dashboard`;
};

const getFrontendPath = (pathname, entities) => {
  const match = pathname.match(idRegex);
  const id = match?.length ? match[0] : null;

  if (BE_ROUTE_REGEXES.project.test(pathname)) return `/projects/${id}`;
  if (BE_ROUTE_REGEXES.journal.test(pathname)) return `/journals/${id}`;
  if (BE_ROUTE_REGEXES.projectCollection.test(pathname))
    return id
      ? `/projects/project-collection/${id}`
      : `/projects/project-collection/${pathname.split("/").pop()}`;
  if (BE_ROUTE_REGEXES.resource.test(pathname)) {
    const projectId = entities.resources
      ? entities.resources[id].relationships?.project?.data?.id
      : "";
    return projectId ? `/projects/${projectId}/resource/${id}` : "/";
  }
  if (BE_ROUTE_REGEXES.resourceCollection.test(pathname)) {
    const projectId = entities.resourceCollections
      ? entities.resourceCollections[id].relationships?.project?.data?.id
      : "";
    return projectId ? `/projects/${projectId}/resource-collection/${id}` : "/";
  }
  if (BE_ROUTE_REGEXES.page.test(pathname)) {
    const pageId = pathname.split("/").find(part => !isNaN(parseInt(part, 10)));
    const slug = entities.pages[pageId].attributes?.slug;
    return `/page/${slug}`;
  }

  return "/";
};

export const getDestinationPath = ({ mode, pathname, entities }) => {
  if (mode === "frontend") return getAdminPath(pathname);
  return getFrontendPath(pathname, entities);
};

import queryString from "query-string";

/**
 * LinkHandler - provides URL generation helpers for the application.
 *
 * For framework mode, we define helpers directly rather than extracting
 * from route definitions to avoid circular dependencies.
 */
class LinkHandler {
  constructor() {
    this.handlers = {
      // Frontend routes
      frontend: (params = {}) => {
        const query = queryString.stringify(params);
        return query ? `/?${query}` : "/";
      },
      frontendProjects: () => "/projects",
      frontendProjectsAll: (params = {}) => {
        const query = queryString.stringify(params);
        return query ? `/projects?${query}` : "/projects";
      },
      frontendProject: id => `/projects/${id}`,
      frontendProjectDetail: id => `/projects/${id}`,
      frontendProjectSearch: (id, params = {}) => {
        const query = queryString.stringify(params);
        return query
          ? `/projects/${id}/search?${query}`
          : `/projects/${id}/search`;
      },
      frontendProjectResources: (id, params = {}) => {
        const query = queryString.stringify(params);
        return query
          ? `/projects/${id}/resources?${query}`
          : `/projects/${id}/resources`;
      },
      frontendProjectResourceCollections: id =>
        `/projects/${id}/resource-collections`,
      frontendProjectResourceCollection: (projectId, collectionId) =>
        `/projects/${projectId}/resource-collection/${collectionId}`,
      frontendProjectEvents: id => `/projects/${id}/events`,
      frontendResource: (projectId, resourceId) =>
        `/projects/${projectId}/resource/${resourceId}`,
      frontendLogin: () => "/login",
      frontendContact: () => "/contact",
      frontendPasswordReset: () => "/reset-password",
      frontendPage: slug => `/page/${slug}`,
      frontendSearch: (params = {}) => {
        const query = queryString.stringify(params);
        return query ? `/search?${query}` : "/search";
      },
      frontendFollowing: () => "/following",
      frontendSubscriptions: () => "/subscriptions",
      subscriptions: () => "/subscriptions",
      frontendUnsubscribe: () => "/unsubscribe",
      frontendStarred: () => "/my-starred",
      frontendAnnotations: () => "/my-annotations",
      frontendPrivacy: () => "/privacy",
      privacy: () => "/privacy",
      frontendDataUse: () => "/data-use",
      frontendApiDocs: () => "/docs/api",
      frontendSignUp: () => "/signup",
      frontendJournalsList: () => "/journals",
      frontendIssuesList: () => "/issues",

      // Collections
      frontendProjectCollection: id => `/project-collection/${id}`,
      frontendProjectCollections: () => "/project-collections",

      // Reading groups
      frontendPublicReadingGroups: () => "/reading-groups",
      frontendMyReadingGroups: () => "/my-reading-groups",
      frontendMyReadingGroupsNew: () => "/my-reading-groups/new",
      frontendReadingGroup: id => `/reading-groups/${id}`,
      frontendReadingGroupDetail: id => `/reading-groups/${id}`,
      frontendReadingGroupMembers: id => `/reading-groups/${id}/members`,
      frontendReadingGroupAnnotations: (id, params = {}) => {
        const query = queryString.stringify(params);
        return query
          ? `/reading-groups/${id}/annotations?${query}`
          : `/reading-groups/${id}/annotations`;
      },
      frontendReadingGroupHomepage: id => `/reading-groups/${id}/homepage`,

      // Journals
      frontendJournals: () => "/journals",
      frontendJournal: id => `/journals/${id}`,
      frontendJournalDetail: id => `/journals/${id}`,
      frontendJournalIssuesList: id => `/journals/${id}/issues`,
      frontendJournalVolumesList: id => `/journals/${id}/volumes`,
      frontendJournalVolume: (journalId, volumeId) =>
        `/journals/${journalId}/volume/${volumeId}`,
      frontendIssue: (journalId, issueId) =>
        `/journals/${journalId}/issue/${issueId}`,

      // Backend routes
      backend: () => "/backend",
      backendDashboard: () => "/backend/dashboard",
      backendProjects: () => "/backend/projects",
      backendProjectsAll: () => "/backend/projects/all",
      backendProject: id => `/backend/projects/${id}`,
      backendProjectTexts: id => `/backend/projects/${id}/texts`,
      backendProjectResources: id => `/backend/projects/${id}/resources`,
      backendProjectResourceCollections: id =>
        `/backend/projects/${id}/resource-collections`,
      backendProjectCollaborators: id =>
        `/backend/projects/${id}/collaborators`,
      backendProjectMetadata: id => `/backend/projects/${id}/metadata`,
      backendProjectProperties: id => `/backend/projects/${id}/properties`,
      backendProjectLayout: id => `/backend/projects/${id}/layout`,
      backendProjectLog: id => `/backend/projects/${id}/log`,
      backendProjectAccess: id => `/backend/projects/${id}/access`,
      backendProjectNew: () => "/backend/projects/new",
      backendProjectsNew: () => "/backend/projects/new",
      backendProjectCollections: () => "/backend/project-collections",

      // Backend settings
      backendSettings: () => "/backend/settings",
      backendSettingsGeneral: () => "/backend/settings/general",
      backendSettingsTheme: () => "/backend/settings/theme",
      backendSettingsIntegrations: () => "/backend/settings/integrations",
      backendSettingsSubjects: () => "/backend/settings/subjects",
      backendSettingsEmail: () => "/backend/settings/email",
      backendSettingsIngestion: () => "/backend/settings/ingestion",
      backendSettingsProperties: () => "/backend/settings/properties",
      backendSettingsExportTargets: () => "/backend/settings/export-targets",

      // Backend records
      backendRecords: () => "/backend/records",
      backendRecordsUsers: () => "/backend/records/users",
      backendRecordsEntitlements: () => "/backend/records/entitlements",
      backendRecordsMakers: () => "/backend/records/makers",
      backendRecordsPages: () => "/backend/records/pages",
      backendRecordsFeatures: () => "/backend/records/features",

      // Reader routes
      reader: (textId, params = {}) => {
        const query = queryString.stringify(params);
        return query ? `/read/${textId}?${query}` : `/read/${textId}`;
      },
      readerSection: (textId, sectionId, params = {}) => {
        const query = queryString.stringify(params);
        const base = `/read/${textId}/section/${sectionId}`;
        return query ? `${base}?${query}` : base;
      }
    };
    this.routes = {};
  }

  link(name, ...args) {
    const handler = this.handlers[name];
    if (!handler) {
      throw new TypeError(`"${name}" is not a valid link handler.`);
    }
    return handler(...args);
  }

  // Legacy methods for compatibility
  registerRoutes(routes) {
    // No-op in framework mode - handlers are defined directly
  }

  routeFromName(name) {
    return this.routes[name];
  }

  nameFromType(prefix, suffix, entity) {
    const adjustedType = `${entity.type
      .charAt(0)
      .toUpperCase()}${entity.type.slice(1, -1)}`;
    return `${prefix}${adjustedType}${suffix}`;
  }
}

export default new LinkHandler();

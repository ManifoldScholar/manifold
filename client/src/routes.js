import * as Frontend from "containers/frontend";
import * as Reader from "containers/reader";
import * as Backend from "containers/backend";
import NotFound from "containers/global/NotFound";
import queryString from "query-string";

/* eslint-disable max-len */
export default () => {
  return [
    {
      name: "reader",
      component: Reader.Reader,
      path: "/read/:textId/:ignore(section|search)?/:sectionId?",
      helper: t => `/read/${t}`,
      routes: [
        {
          name: "readerSearchResults",
          component: Reader.Search,
          path: "/read/:textId/search",
          helper: t => `/read/${t}/search`
        },
        {
          name: "readerSectionSearchResults",
          component: Reader.Search,
          transition: "overlay-full",
          path: "/read/:textId/section/:sectionId/search",
          helper: (t, ts) => `/read/${t}/section/${ts}/search`
        },
        {
          name: "readerSection",
          component: Reader.Section,
          exact: false,
          path: "/read/:textId/section/:sectionId",
          helper: (t, s, anchor = "") => `/read/${t}/section/${s}${anchor}`,
          routes: [
            {
              name: "readerSectionResource",
              component: Reader.Notation.Resource.Detail,
              path: "/read/:textId/section/:sectionId/resource/:resourceId",
              helper: (t, s, r) => `/read/${t}/section/${s}/resource/${r}`
            },
            {
              name: "readerSectionCollection",
              component: Reader.Notation.Collection.Detail,
              path: "/read/:textId/section/:sectionId/collection/:collectionId",
              helper: (t, s, c) => `/read/${t}/section/${s}/collection/${c}`
            }
          ]
        }
      ]
    },
    {
      name: "backend",
      component: Backend.Backend,
      path: "/backend",
      helper: () => "/backend",
      routes: [
        {
          exact: true,
          name: "backendDashboard",
          component: Backend.Dashboard,
          path: "/backend/dashboard",
          helper: () => "/backend/dashboard"
        },
        {
          name: "backendProjects",
          exact: false,
          component: Backend.Projects.Wrapper,
          path: "/backend/projects",
          helper: () => "/backend/projects",
          routes: [
            {
              name: "backendProjectsAll",
              exact: true,
              component: Backend.Projects.ProjectsList,
              path: "/backend/projects/all",
              helper: () => "/backend/projects/all"
            },
            {
              name: "backendProjectResourcesNew",
              exact: true,
              component: Backend.Resource.New,
              path: "/backend/projects/:projectId/resources/new",
              helper: p => `/backend/projects/${p}/resources/new`
            },
            {
              name: "backendResourceImport",
              exact: false,
              component: Backend.ResourceImport.Wrapper,
              path: "/backend/projects/:projectId/resource-import/:id?",
              helper: p => `/backend/projects/${p}/resource-import`,
              routes: [
                {
                  name: "backendResourceImportNew",
                  exact: true,
                  component: Backend.ResourceImport.New,
                  path: "/backend/projects/:projectId/resource-import",
                  helper: p => `/backend/projects/${p}/resource-import`
                },
                {
                  name: "backendResourceImportEdit",
                  exact: true,
                  component: Backend.ResourceImport.New,
                  path: "/backend/projects/:projectId/resource-import/:id",
                  helper: (p, id) =>
                    `/backend/projects/${p}/resource-import/${id}`
                },
                {
                  name: "backendResourceImportMap",
                  exact: true,
                  component: Backend.ResourceImport.Map,
                  path: "/backend/projects/:projectId/resource-import/:id/map",
                  helper: (p, id) =>
                    `/backend/projects/${p}/resource-import/${id}/map`
                },
                {
                  name: "backendResourceImportResults",
                  exact: true,
                  component: Backend.ResourceImport.Results,
                  path:
                    "/backend/projects/:projectId/resource-import/:id/results",
                  helper: (p, id) =>
                    `/backend/projects/${p}/resource-import/${id}/results`
                }
              ]
            },
            {
              name: "backendProjectResourceCollectionsNew",
              exact: true,
              component: Backend.Collection.New,
              path: "/backend/projects/:projectId/collections/new",
              helper: p => `/backend/projects/${p}/collections/new`
            },
            {
              name: "backendProjectsNew",
              exact: true,
              component: Backend.Project.New,
              path: "/backend/projects/new",
              helper: () => "/backend/projects/new"
            },
            {
              exact: false,
              name: "backendResource",
              component: Backend.Resource.Wrapper,
              helper: r => `/backend/projects/resource/${r}`,
              path: "/backend/projects/resource/:id",
              routes: [
                {
                  name: "backendResourceVariants",
                  exact: true,
                  component: Backend.Resource.Variants,
                  path: "/backend/projects/resource/:id/variants",
                  helper: r => `/backend/projects/resource/${r}/variants`
                },
                {
                  name: "backendResourceMetadata",
                  exact: true,
                  component: Backend.Resource.Metadata,
                  path: "/backend/projects/resource/:id/metadata",
                  helper: r => `/backend/projects/resource/${r}/metadata`
                },
                {
                  name: "backendResourceGeneral",
                  exact: true,
                  component: Backend.Resource.General,
                  path: "/backend/projects/resource/:id/general",
                  helper: r => `/backend/projects/resource/${r}/general`
                }
              ]
            },
            {
              name: "backendCollection",
              exact: false,
              component: Backend.Collection.Wrapper,
              path: "/backend/projects/collection/:id",
              helper: r => `/backend/projects/collection/${r}`,
              routes: [
                {
                  name: "backendCollectionGeneral",
                  exact: true,
                  component: Backend.Collection.General,
                  path: "/backend/projects/collection/:id/general",
                  helper: r => `/backend/projects/collection/${r}/general`
                },
                {
                  name: "backendCollectionResources",
                  exact: true,
                  component: Backend.Collection.Resources,
                  path: "/backend/projects/collection/:id/resources",
                  helper: r => `/backend/projects/collection/${r}/resources`
                }
              ]
            },
            {
              name: "backendText",
              exact: false,
              component: Backend.Text.Wrapper,
              path: "/backend/projects/text/:id",
              helper: t => `/backend/projects/text/${t}`,
              routes: [
                {
                  name: "backendTextStyles",
                  component: Backend.Text.Styles,
                  exact: true,
                  path: "/backend/projects/text/:id/styles",
                  helper: t => `/backend/projects/text/${t}/styles`
                },
                {
                  name: "BackendTextStylesheetNew",
                  component: Backend.Stylesheet.Edit,
                  exact: true,
                  path: "/backend/projects/text/:id/styles/new",
                  helper: t => `/backend/projects/text/${t}/styles/new`
                },
                {
                  name: "BackendTextStylesheetEdit",
                  component: Backend.Stylesheet.Edit,
                  exact: true,
                  path: "/backend/projects/text/:id/styles/:stylesheet",
                  helper: (t, ss) => `/backend/projects/text/${t}/styles/${ss}`
                },
                {
                  name: "backendTextMetadata",
                  exact: true,
                  component: Backend.Text.Metadata,
                  path: "/backend/projects/text/:id/metadata",
                  helper: t => `/backend/projects/text/${t}/metadata`
                },
                {
                  name: "backendTextCollaborators",
                  exact: false,
                  component: Backend.Text.Collaborators,
                  path: "/backend/projects/text/:id/collaborators",
                  helper: t => `/backend/projects/text/${t}/collaborators`,
                  routes: [
                    {
                      name: "backendTextCollaborator",
                      component: Backend.Makers.Edit,
                      path: "/backend/projects/text/:tId/collaborators/:id",
                      helper: (tId, id) =>
                        `/backend/projects/text/${tId}/collaborators/${id}`
                    }
                  ]
                },
                {
                  name: "backendTextIngestionsNew",
                  exact: true,
                  component: Backend.Text.Ingestion.New,
                  path: "/backend/projects/text/:id/ingestions/new",
                  helper: t => `/backend/projects/text/${t}/ingestions/new`,
                  modal: false
                },
                {
                  name: "backendTextIngestionEdit",
                  exact: false,
                  component: Backend.Text.Ingestion.Edit,
                  path:
                    "/backend/projects/text/:id/ingestion/:ingestionId/edit",
                  helper: (t, i) =>
                    `/backend/projects/text/${t}/ingestion/${i}/edit`,
                  modal: false
                },
                {
                  name: "backendTextIngestionIngest",
                  exact: false,
                  component: Backend.Ingestion.Ingest,
                  path:
                    "/backend/projects/text/:id/ingestion/:ingestionId/ingest",
                  helper: (t, i) =>
                    `/backend/projects/text/${t}/ingestion/${i}/ingest`,
                  modal: false
                },
                {
                  name: "backendTextGeneral",
                  exact: true,
                  component: Backend.Text.General,
                  path: "/backend/projects/text/:id/general",
                  helper: t => `/backend/projects/text/${t}/general`
                }
              ]
            },
            {
              name: "backendProjectCollections",
              exact: false,
              component: Backend.ProjectCollection.Wrapper,
              path: "/backend/projects/project-collections/:id?",
              helper: () => "/backend/projects/project-collections",
              routes: [
                {
                  name: "backendProjectCollection",
                  exact: false,
                  component: Backend.ProjectCollection.Detail,
                  path: "/backend/projects/project-collections/:id",
                  helper: pc => `/backend/projects/project-collections/${pc}`,
                  routes: [
                    {
                      name: "backendProjectCollectionManageProjects",
                      exact: true,
                      component: Backend.ProjectCollection.ManageProjects,
                      path:
                        "/backend/projects/project-collections/:id/manage-projects",
                      helper: pc =>
                        `/backend/projects/project-collections/${pc}/manage-projects`
                    },
                    {
                      name: "backendProjectCollectionSettings",
                      exact: true,
                      component: Backend.ProjectCollection.Settings,
                      path:
                        "/backend/projects/project-collections/:id/settings",
                      helper: pc =>
                        `/backend/projects/project-collections/${pc}/settings`
                    }
                  ]
                }
              ]
            },
            {
              name: "backendProject",
              exact: false,
              component: Backend.Project.Wrapper,
              path: "/backend/projects/:id",
              helper: p => `/backend/projects/${p}`,
              routes: [
                {
                  name: "backendProjectTexts",
                  exact: false,
                  component: Backend.Project.Texts,
                  path: "/backend/projects/:id/texts",
                  helper: p => `/backend/projects/${p}/texts`,
                  routes: [
                    {
                      name: "backendProjectTextsIngestionsNew",
                      exact: false,
                      component: Backend.Project.Text.Ingestion.New,
                      path: "/backend/projects/:id/texts/ingestions/new",
                      helper: p =>
                        `/backend/projects/${p}/texts/ingestions/new`,
                      modal: true
                    },
                    {
                      name: "backendProjectTextsIngestionEdit",
                      exact: false,
                      component: Backend.Project.Text.Ingestion.Edit,
                      path:
                        "/backend/projects/:id/texts/ingestion/:ingestionId/edit",
                      helper: (p, i) =>
                        `/backend/projects/${p}/texts/ingestion/${i}/edit`,
                      modal: true
                    },
                    {
                      name: "backendProjectTextsIngestionIngest",
                      exact: false,
                      component: Backend.Ingestion.Ingest,
                      path:
                        "/backend/projects/:id/texts/ingestion/:ingestionId/ingest",
                      helper: (p, i) =>
                        `/backend/projects/${p}/texts/ingestion/${i}/ingest`,
                      modal: true
                    },
                    {
                      exact: false,
                      component: Backend.Project.Category.Wrapper,
                      path: "/backend/projects/:id/texts/category",
                      routes: [
                        {
                          name: "backendProjectCategoriesNew",
                          exact: true,
                          component: Backend.Project.Category.New,
                          path: "/backend/projects/:id/texts/category/new",
                          helper: p =>
                            `/backend/projects/${p}/texts/category/new`
                        },
                        {
                          name: "backendProjectCategory",
                          exact: true,
                          component: Backend.Project.Category.Edit,
                          path:
                            "/backend/projects/:id/texts/category/:catId/edit",
                          helper: (p, c) =>
                            `/backend/projects/${p}/texts/category/${c}/edit`
                        }
                      ]
                    }
                  ]
                },
                {
                  name: "backendProjectResources",
                  exact: true,
                  component: Backend.Project.Resources,
                  path: "/backend/projects/:id/resources",
                  helper: p => `/backend/projects/${p}/resources`
                },
                {
                  name: "backendProjectResourceCollections",
                  exact: true,
                  component: Backend.Project.Collections,
                  path: "/backend/projects/:id/collections",
                  helper: p => `/backend/projects/${p}/collections`
                },
                {
                  name: "backendProjectPermissions",
                  component: Backend.Project.Permissions,
                  path: "/backend/projects/:projectId/permissions/:id?",
                  helper: p => `/backend/projects/${p}/permissions`,
                  routes: [
                    {
                      name: "backendProjectPermissionsNew",
                      component: Backend.Permission.New,
                      path: "/backend/projects/:pId/permissions/new",
                      helper: pId => `/backend/projects/${pId}/permissions/new`
                    },
                    {
                      name: "backendProjectPermission",
                      component: Backend.Permission.Edit,
                      path: "/backend/projects/:pId/permissions/:id",
                      helper: (pId, id) =>
                        `/backend/projects/${pId}/permissions/${id}`
                    }
                  ]
                },
                {
                  name: "backendProjectCollaborators",
                  component: Backend.Project.Collaborators,
                  path: "/backend/projects/:id/collaborators",
                  helper: p => `/backend/projects/${p}/collaborators`,
                  routes: [
                    {
                      name: "backendProjectCollaborator",
                      component: Backend.Makers.Edit,
                      path: "/backend/projects/:pId/collaborators/:id",
                      helper: (pId, id) =>
                        `/backend/projects/${pId}/collaborators/${id}`
                    }
                  ]
                },
                {
                  name: "backendProjectEvents",
                  exact: true,
                  component: Backend.Project.Events,
                  path: "/backend/projects/:id/events",
                  helper: p => `/backend/projects/${p}/events`
                },
                {
                  name: "backendProjectMetadata",
                  exact: true,
                  component: Backend.Project.Metadata,
                  path: "/backend/projects/:id/metadata",
                  helper: p => `/backend/projects/${p}/metadata`
                },
                {
                  name: "backendProjectSocial",
                  exact: false,
                  component: Backend.Project.Social.Wrapper,
                  path:
                    "/backend/projects/:pId/social/:type(twitter-query)?/:qId?",
                  helper: p => `/backend/projects/${p}/social`,
                  routes: [
                    {
                      name: "backendProjectSocialTwitterQueryNew",
                      component: Backend.TwitterQuery.New,
                      path: "/backend/projects/:pId/social/twitter-query/new",
                      helper: pId =>
                        `/backend/projects/${pId}/social/twitter-query/new`
                    },
                    {
                      name: "backendProjectSocialTwitterQuery",
                      component: Backend.TwitterQuery.Edit,
                      path: "/backend/projects/:pId/social/twitter-query/:id",
                      helper: (pId, id) =>
                        `/backend/projects/${pId}/social/twitter-query/${id}`
                    }
                  ]
                },
                {
                  name: "backendProjectProjectPage",
                  exact: true,
                  component: Backend.Project.ProjectPage,
                  path: "/backend/projects/:id/project-page",
                  helper: p => `/backend/projects/${p}/project-page`
                },
                {
                  name: "backendProjectLog",
                  exact: true,
                  component: Backend.Project.Log,
                  path: "/backend/projects/:id/log",
                  helper: p => `/backend/projects/${p}/log`
                },
                {
                  name: "backendProjectGeneral",
                  exact: true,
                  component: Backend.Project.General,
                  path: "/backend/projects/:id/general",
                  helper: p => `/backend/projects/${p}/general`
                }
              ]
            }
          ]
        },
        {
          name: "backendRecords",
          exact: false,
          component: Backend.Records,
          path: "/backend/records/:type?/:id?",
          helper: () => "/backend/records",
          routes: [
            {
              name: "backendRecordsUsers",
              exact: true,
              component: Backend.Users.List,
              path: "/backend/records/users/:id?",
              helper: () => "/backend/records/users",
              routes: [
                {
                  name: "backendRecordsUsersNew",
                  exact: true,
                  component: Backend.Users.New,
                  path: "/backend/records/users/new",
                  helper: () => "/backend/records/users/new"
                },
                {
                  name: "backendRecordsUser",
                  component: Backend.Users.Edit,
                  path: "/backend/records/users/:id",
                  helper: u => `/backend/records/users/${u}`
                }
              ]
            },
            {
              name: "backendRecordsMakers",
              component: Backend.Makers.List,
              exact: true,
              path: "/backend/records/makers/:id?",
              helper: () => `/backend/records/makers`,
              routes: [
                {
                  name: "backendRecordsMakersNew",
                  exact: true,
                  component: Backend.Makers.New,
                  path: "/backend/records/makers/new",
                  helper: () => "/backend/records/makers/new"
                },
                {
                  name: "backendRecordsMaker",
                  component: Backend.Makers.Edit,
                  exact: true,
                  path: "/backend/records/makers/:id",
                  helper: m => `/backend/records/makers/${m}`
                }
              ]
            },
            {
              name: "backendRecordsPage",
              component: Backend.Pages.Detail,
              path: "/backend/records/pages/:id",
              exact: false,
              helper: p => `/backend/records/pages/${p}`,
              routes: [
                {
                  name: "backendRecordsPageNew",
                  component: Backend.Pages.New,
                  path: "/backend/records/pages/new",
                  helper: () => `/backend/records/pages/new`
                },
                {
                  name: "backendRecordsPageBody",
                  component: Backend.Pages.Body,
                  path: "/backend/records/pages/:id/body",
                  helper: p => `/backend/records/pages/${p}/body`
                },
                {
                  name: "backendRecordsPageGeneral",
                  component: Backend.Pages.General,
                  path: "/backend/records/pages/:id/general",
                  helper: p => `/backend/records/pages/${p}/general`
                }
              ]
            },
            {
              name: "backendRecordsFeature",
              component: Backend.Features.Detail,
              path: "/backend/records/features/:id",
              exact: false,
              helper: f => `/backend/records/features/${f}`,
              routes: [
                {
                  name: "backendRecordsFeatureNew",
                  component: Backend.Features.New,
                  path: "/backend/records/features/new",
                  helper: () => `/backend/records/features/new`
                },
                {
                  name: "backendRecordsFeatureGeneral",
                  component: Backend.Features.General,
                  path: "/backend/records/features/:id",
                  helper: p => `/backend/records/features/${p}`
                }
              ]
            },
            {
              name: "backendRecordsPages",
              component: Backend.Pages.List,
              path: "/backend/records/pages",
              exact: true,
              helper: () => `/backend/records/pages`
            },
            {
              name: "backendRecordsFeatures",
              component: Backend.Features.List,
              exact: true,
              path: "/backend/records/features",
              helper: () => `/backend/records/features`
            }
          ]
        },
        {
          name: "backendSettings",
          exact: false,
          component: Backend.Settings.Wrapper,
          path: "/backend/settings",
          helper: () => "/backend/settings",
          routes: [
            {
              name: "backendSettingsTheme",
              exact: true,
              component: Backend.Settings.Theme,
              path: "/backend/settings/theme",
              helper: () => "/backend/settings/theme"
            },
            {
              name: "backendSettingsIntegrations",
              exact: true,
              component: Backend.Settings.Integrations,
              path: "/backend/settings/integrations",
              helper: () => "/backend/settings/integrations"
            },
            {
              name: "backendSettingsSubjects",
              exact: true,
              component: Backend.Settings.Subjects.List,
              path: "/backend/settings/subjects/:id?",
              helper: () => "/backend/settings/subjects",
              routes: [
                {
                  name: "backendSettingsSubjectsNew",
                  exact: true,
                  component: Backend.Settings.Subjects.New,
                  path: "/backend/settings/subjects/new",
                  helper: () => "/backend/settings/subjects/new"
                },
                {
                  name: "backendSettingsSubject",
                  component: Backend.Settings.Subjects.Edit,
                  path: "/backend/settings/subjects/:id",
                  helper: s => `/backend/settings/subjects/${s}`
                }
              ]
            },
            {
              name: "backendSettingsEmail",
              exact: true,
              component: Backend.Settings.Email,
              path: "/backend/settings/email",
              helper: () => "/backend/settings/email"
            },
            {
              name: "backendSettingsGeneral",
              exact: true,
              component: Backend.Settings.General,
              path: "/backend/settings/general",
              helper: () => "/backend/settings/general"
            }
          ]
        },
        {
          component: NotFound
        }
      ]
    },
    {
      component: Frontend.Frontend,
      path: "/",
      routes: [
        {
          name: "frontendProjects",
          exact: false,
          component: Frontend.ProjectsWrapper,
          path: "/projects",
          helper: () => "/projects",
          routes: [
            {
              name: "frontendProjectsAll",
              exact: true,
              component: Frontend.Projects,
              path: "/projects/all",
              helper: (params = {}) => {
                const query = queryString.stringify(params);
                if (!query) return "/projects/all";
                return `/projects/all?${query}`;
              }
            },
            {
              name: "frontendProjectCollections",
              exact: true,
              component: Frontend.ProjectCollections,
              path: "/projects/project-collections",
              helper: (params = {}) => {
                const query = queryString.stringify(params);
                if (!query) return "/projects/project-collections";
                return `/projects/project-collections?${query}`;
              }
            },
            {
              name: "frontendProjectCollection",
              exact: true,
              component: Frontend.ProjectCollectionDetail,
              path: "/projects/project-collection/:id",
              helper: (pc, params = {}) => {
                const query = queryString.stringify(params);
                if (!query) return `/projects/project-collection/${pc}`;
                return `/projects/project-collection/${pc}?${query}`;
              }
            },
            {
              name: "frontendProject",
              exact: true,
              component: Frontend.ProjectDetail,
              path: "/projects/:id",
              helper: p => `/projects/${p}`
            },
            {
              name: "frontendProjectEvents",
              exact: true,
              component: Frontend.EventList,
              path: "/projects/:id/events/:page?",
              helpers: {
                frontendProjectEvents: p => `/projects/${p}/events`,
                frontendProjectEventsPage: (pr, pg) =>
                  `/projects/${pr}/events/${pg}`
              }
            },
            {
              name: "frontendResourceCollection",
              exact: true,
              component: Frontend.CollectionDetail,
              path: "/projects/:id/collection/:collectionId",
              helpers: {
                frontendResourceCollection: (p, c, params = {}) => {
                  const query = queryString.stringify(params);
                  if (!query) return `/projects/${p}/collection/${c}`;
                  return `/projects/${p}/collection/${c}?${query}`;
                },
                frontendProjectCollectionRelative: c => `collection/${c}`
              }
            },
            {
              name: "frontendProjectResources",
              exact: true,
              component: Frontend.ProjectResources,
              path: "/projects/:id/resources",
              helper: (p, params = {}) => {
                const query = queryString.stringify(params);
                if (!query) return `/projects/${p}/resources`;
                return `/projects/${p}/resources/?${query}`;
              }
            },
            {
              name: "frontendProjectCollectionResource",
              exact: true,
              component: Frontend.ResourceDetail,
              path: "/projects/:id/collection/:collectionId/resource/:resourceId",
              helper: (p, c, r) => `/projects/${p}/collection/${c}/resource/${r}`
            },
            {
              name: "frontendProjectResource",
              exact: true,
              component: Frontend.ResourceDetail,
              path: "/projects/:id/resource/:resourceId",
              helpers: {
                frontendProjectResource: (p, r) => `/projects/${p}/resource/${r}`,
                frontendProjectResourceRelative: r => `resource/${r}`
              }
            }
          ]
        },
        {
          name: "frontendFollowing",
          exact: true,
          component: Frontend.Following,
          path: "/following",
          helper: () => "/following"
        },
        {
          name: "frontendFeatured",
          exact: true,
          component: Frontend.Featured,
          path: "/featured",
          helper: () => "/featured"
        },
        {
          name: "frontendSearch",
          exact: true,
          component: Frontend.Search,
          path: "/search",
          helper: () => `/search`
        },
        {
          name: "frontendContact",
          exact: true,
          component: Frontend.Contact,
          path: "/contact",
          helper: () => "/contact"
        },
        {
          exact: true,
          component: Frontend.PasswordReset,
          path: "/reset-password/:resetToken"
        },
        {
          name: "frontendPage",
          exact: true,
          component: Frontend.Page,
          path: "/page/:slug",
          helper: p => `/page/${p}`
        },
        {
          name: "subscriptions",
          exact: true,
          component: Frontend.Subscriptions,
          path: "/subscriptions",
          helper: () => "/subscriptions"
        },
        {
          name: "unsubscribe",
          exact: true,
          component: Frontend.Unsubscribe,
          path: "/unsubscribe/:token",
          helper: token => `/unsubscribe/${token}`
        },
        {
          name: "frontend",
          exact: true,
          component: Frontend.Home,
          path: "/",
          helper: (params = {}) => {
            const query = queryString.stringify(params);
            if (!query) return "/";
            return `/?${query}`;
          }
        },
        {
          component: NotFound
        }
      ]
    },
    {
      component: NotFound
    }
  ];
};
/* eslint-enable max-len */

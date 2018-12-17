import NotFound from "../global/containers/NotFound";

const routes = {
  name: "backend",
  exact: false,
  component: "Backend",
  path: "/backend",
  helper: () => "/backend",
  routes: [
    {
      exact: true,
      name: "backendDashboard",
      component: "Dashboard",
      path: "/backend/dashboard",
      helper: () => "/backend/dashboard"
    },
    {
      name: "backendProjects",
      exact: false,
      component: "ProjectsWrapper",
      path: "/backend/projects",
      helper: () => "/backend/projects",
      routes: [
        {
          name: "backendProjectsAll",
          exact: true,
          component: "ProjectsList",
          path: "/backend/projects/all",
          helper: () => "/backend/projects/all"
        },
        {
          name: "backendProjectResourcesNew",
          exact: true,
          component: "ResourceNew",
          path: "/backend/projects/:projectId/resources/new",
          helper: p => `/backend/projects/${p}/resources/new`
        },
        {
          name: "backendResourceImport",
          exact: false,
          component: "ResourceImportWrapper",
          path: "/backend/projects/:projectId/resource-import/:id?",
          helper: p => `/backend/projects/${p}/resource-import`,
          routes: [
            {
              name: "backendResourceImportNew",
              exact: true,
              component: "ResourceImportNew",
              path: "/backend/projects/:projectId/resource-import",
              helper: p => `/backend/projects/${p}/resource-import`
            },
            {
              name: "backendResourceImportEdit",
              exact: true,
              component: "ResourceImportNew",
              path: "/backend/projects/:projectId/resource-import/:id",
              helper: (p, id) => `/backend/projects/${p}/resource-import/${id}`
            },
            {
              name: "backendResourceImportMap",
              exact: true,
              component: "ResourceImportMap",
              path: "/backend/projects/:projectId/resource-import/:id/map",
              helper: (p, id) =>
                `/backend/projects/${p}/resource-import/${id}/map`
            },
            {
              name: "backendResourceImportResults",
              exact: true,
              component: "ResourceImportResults",
              path: "/backend/projects/:projectId/resource-import/:id/results",
              helper: (p, id) =>
                `/backend/projects/${p}/resource-import/${id}/results`
            }
          ]
        },
        {
          name: "backendProjectResourceCollectionsNew",
          exact: true,
          component: "CollectionNew",
          path: "/backend/projects/:projectId/collections/new",
          helper: p => `/backend/projects/${p}/collections/new`
        },
        {
          name: "backendProjectsNew",
          exact: true,
          component: "ProjectNew",
          path: "/backend/projects/new",
          helper: () => "/backend/projects/new"
        },
        {
          exact: false,
          name: "backendResource",
          component: "ResourceWrapper",
          helper: r => `/backend/projects/resource/${r}`,
          path: "/backend/projects/resource/:id",
          routes: [
            {
              name: "backendResourceVariants",
              exact: true,
              component: "ResourceVariants",
              path: "/backend/projects/resource/:id/variants",
              helper: r => `/backend/projects/resource/${r}/variants`
            },
            {
              name: "backendResourceMetadata",
              exact: true,
              component: "ResourceMetadata",
              path: "/backend/projects/resource/:id/metadata",
              helper: r => `/backend/projects/resource/${r}/metadata`
            },
            {
              name: "backendResourceGeneral",
              exact: true,
              component: "ResourceGeneral",
              path: "/backend/projects/resource/:id/general",
              helper: r => `/backend/projects/resource/${r}/general`
            }
          ]
        },
        {
          name: "backendCollection",
          exact: false,
          component: "CollectionWrapper",
          path: "/backend/projects/collection/:id",
          helper: r => `/backend/projects/collection/${r}`,
          routes: [
            {
              name: "backendCollectionGeneral",
              exact: true,
              component: "CollectionGeneral",
              path: "/backend/projects/collection/:id/general",
              helper: r => `/backend/projects/collection/${r}/general`
            },
            {
              name: "backendCollectionResources",
              exact: true,
              component: "CollectionResources",
              path: "/backend/projects/collection/:id/resources",
              helper: r => `/backend/projects/collection/${r}/resources`
            }
          ]
        },
        {
          name: "backendText",
          exact: false,
          component: "TextWrapper",
          path: "/backend/projects/text/:id",
          helper: t => `/backend/projects/text/${t}`,
          routes: [
            {
              name: "backendTextStyles",
              component: "TextStyles",
              exact: true,
              path: "/backend/projects/text/:id/styles",
              helper: t => `/backend/projects/text/${t}/styles`
            },
            {
              name: "BackendTextStylesheetNew",
              exact: true,
              component: "StylesheetEdit",
              path: "/backend/projects/text/:id/styles/new",
              helper: t => `/backend/projects/text/${t}/styles/new`
            },
            {
              name: "BackendTextStylesheetEdit",
              exact: true,
              component: "StylesheetEdit",
              path: "/backend/projects/text/:id/styles/:stylesheet",
              helper: (t, ss) => `/backend/projects/text/${t}/styles/${ss}`
            },
            {
              name: "backendTextMetadata",
              exact: true,
              component: "TextMetadata",
              path: "/backend/projects/text/:id/metadata",
              helper: t => `/backend/projects/text/${t}/metadata`
            },
            {
              name: "backendTextCollaborators",
              exact: false,
              component: "TextCollaborators",
              path: "/backend/projects/text/:id/collaborators",
              helper: t => `/backend/projects/text/${t}/collaborators`,
              routes: [
                {
                  name: "backendTextCollaborator",
                  exact: true,
                  component: "MakersEdit",
                  path: "/backend/projects/text/:tId/collaborators/:id",
                  helper: (tId, id) =>
                    `/backend/projects/text/${tId}/collaborators/${id}`
                }
              ]
            },
            {
              name: "backendTextIngestionsNew",
              exact: true,
              component: "TextIngestionNew",
              path: "/backend/projects/text/:id/ingestions/new",
              helper: t => `/backend/projects/text/${t}/ingestions/new`,
              modal: false
            },
            {
              name: "backendTextIngestionEdit",
              exact: true,
              component: "TextIngestionEdit",
              path: "/backend/projects/text/:id/ingestion/:ingestionId/edit",
              helper: (t, i) =>
                `/backend/projects/text/${t}/ingestion/${i}/edit`,
              modal: false
            },
            {
              name: "backendTextIngestionIngest",
              exact: true,
              component: "IngestionIngest",
              path: "/backend/projects/text/:id/ingestion/:ingestionId/ingest",
              helper: (t, i) =>
                `/backend/projects/text/${t}/ingestion/${i}/ingest`,
              modal: false
            },
            {
              name: "backendTextGeneral",
              exact: true,
              component: "TextGeneral",
              path: "/backend/projects/text/:id/general",
              helper: t => `/backend/projects/text/${t}/general`
            }
          ]
        },
        {
          name: "backendProjectCollections",
          exact: false,
          component: "ProjectCollectionWrapper",
          path: "/backend/projects/project-collections/:id?",
          helper: () => "/backend/projects/project-collections",
          routes: [
            {
              name: "backendProjectCollection",
              exact: false,
              component: "ProjectCollectionDetail",
              path: "/backend/projects/project-collections/:id",
              helper: pc => `/backend/projects/project-collections/${pc}`,
              routes: [
                {
                  name: "backendProjectCollectionManageProjects",
                  exact: true,
                  component: "ProjectCollectionManageProjects",
                  path:
                    "/backend/projects/project-collections/:id/manage-projects",
                  helper: pc =>
                    `/backend/projects/project-collections/${pc}/manage-projects`
                },
                {
                  name: "backendProjectCollectionSettings",
                  exact: true,
                  component: "ProjectCollectionSettings",
                  path: "/backend/projects/project-collections/:id/settings",
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
          component: "ProjectWrapper",
          path: "/backend/projects/:id",
          helper: p => `/backend/projects/${p}`,
          routes: [
            {
              name: "backendProjectTexts",
              exact: false,
              component: "ProjectTexts",
              path: "/backend/projects/:id/texts",
              helper: p => `/backend/projects/${p}/texts`,
              routes: [
                {
                  name: "backendProjectTextsIngestionsNew",
                  exact: true,
                  component: "ProjectTextIngestionNew",
                  path: "/backend/projects/:id/texts/ingestions/new",
                  helper: p => `/backend/projects/${p}/texts/ingestions/new`,
                  modal: true
                },
                {
                  name: "backendProjectTextsIngestionEdit",
                  exact: true,
                  component: "ProjectTextIngestionEdit",
                  path:
                    "/backend/projects/:id/texts/ingestion/:ingestionId/edit",
                  helper: (p, i) =>
                    `/backend/projects/${p}/texts/ingestion/${i}/edit`,
                  modal: true
                },
                {
                  name: "backendProjectTextsIngestionIngest",
                  exact: true,
                  component: "IngestionIngest",
                  path:
                    "/backend/projects/:id/texts/ingestion/:ingestionId/ingest",
                  helper: (p, i) =>
                    `/backend/projects/${p}/texts/ingestion/${i}/ingest`,
                  modal: true
                },
                {
                  exact: false,
                  component: "ProjectCategoryWrapper",
                  path: "/backend/projects/:id/texts/category",
                  routes: [
                    {
                      name: "backendProjectCategoriesNew",
                      exact: true,
                      component: "ProjectCategoryNew",
                      path: "/backend/projects/:id/texts/category/new",
                      helper: p => `/backend/projects/${p}/texts/category/new`
                    },
                    {
                      name: "backendProjectCategory",
                      exact: true,
                      component: "ProjectCategoryEdit",
                      path: "/backend/projects/:id/texts/category/:catId/edit",
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
              component: "ProjectResources",
              path: "/backend/projects/:id/resources",
              helper: p => `/backend/projects/${p}/resources`
            },
            {
              name: "backendProjectResourceCollections",
              exact: true,
              component: "ProjectCollections",
              path: "/backend/projects/:id/collections",
              helper: p => `/backend/projects/${p}/collections`
            },
            {
              name: "backendProjectPermissions",
              exact: false,
              component: "ProjectPermissions",
              path: "/backend/projects/:projectId/permissions/:id?",
              helper: p => `/backend/projects/${p}/permissions`,
              routes: [
                {
                  name: "backendProjectPermissionsNew",
                  exact: true,
                  component: "PermissionNew",
                  path: "/backend/projects/:pId/permissions/new",
                  helper: pId => `/backend/projects/${pId}/permissions/new`
                },
                {
                  name: "backendProjectPermission",
                  exact: true,
                  component: "PermissionEdit",
                  path: "/backend/projects/:pId/permissions/:id",
                  helper: (pId, id) =>
                    `/backend/projects/${pId}/permissions/${id}`
                }
              ]
            },
            {
              name: "backendProjectCollaborators",
              exact: false,
              component: "ProjectCollaborators",
              path: "/backend/projects/:id/collaborators",
              helper: p => `/backend/projects/${p}/collaborators`,
              routes: [
                {
                  name: "backendProjectCollaborator",
                  exact: true,
                  component: "MakersEdit",
                  path: "/backend/projects/:pId/collaborators/:id",
                  helper: (pId, id) =>
                    `/backend/projects/${pId}/collaborators/${id}`
                }
              ]
            },
            {
              name: "backendProjectEvents",
              exact: true,
              component: "ProjectEvents",
              path: "/backend/projects/:id/events",
              helper: p => `/backend/projects/${p}/events`
            },
            {
              name: "backendProjectMetadata",
              exact: true,
              component: "ProjectMetadata",
              path: "/backend/projects/:id/metadata",
              helper: p => `/backend/projects/${p}/metadata`
            },
            {
              name: "backendProjectSocial",
              exact: false,
              component: "ProjectSocialWrapper",
              path: "/backend/projects/:pId/social/:type(twitter-query)?/:qId?",
              helper: p => `/backend/projects/${p}/social`,
              routes: [
                {
                  name: "backendProjectSocialTwitterQueryNew",
                  exact: true,
                  component: "TwitterQueryNew",
                  path: "/backend/projects/:pId/social/twitter-query/new",
                  helper: pId =>
                    `/backend/projects/${pId}/social/twitter-query/new`
                },
                {
                  name: "backendProjectSocialTwitterQuery",
                  exact: true,
                  component: "TwitterQueryEdit",
                  path: "/backend/projects/:pId/social/twitter-query/:id",
                  helper: (pId, id) =>
                    `/backend/projects/${pId}/social/twitter-query/${id}`
                }
              ]
            },
            {
              name: "backendProjectProjectPage",
              exact: true,
              component: "ProjectContent",
              path: "/backend/projects/:id/project-page",
              helper: p => `/backend/projects/${p}/project-page`
            },
            {
              name: "backendProjectLog",
              exact: true,
              component: "ProjectLog",
              path: "/backend/projects/:id/log",
              helper: p => `/backend/projects/${p}/log`
            },
            {
              name: "backendProjectGeneral",
              exact: true,
              component: "ProjectGeneral",
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
      component: "Records",
      path: "/backend/records/:type?/:id?",
      helper: () => "/backend/records",
      routes: [
        {
          name: "backendRecordsUsers",
          exact: true,
          component: "UsersList",
          path: "/backend/records/users/:id?",
          helper: () => "/backend/records/users",
          routes: [
            {
              name: "backendRecordsUsersNew",
              exact: true,
              component: "UsersNew",
              path: "/backend/records/users/new",
              helper: () => "/backend/records/users/new"
            },
            {
              name: "backendRecordsUser",
              exact: true,
              component: "UsersEdit",
              path: "/backend/records/users/:id",
              helper: u => `/backend/records/users/${u}`
            }
          ]
        },
        {
          name: "backendRecordsMakers",
          component: "MakersList",
          exact: true,
          path: "/backend/records/makers/:id?",
          helper: () => `/backend/records/makers`,
          routes: [
            {
              name: "backendRecordsMakersNew",
              exact: true,
              component: "MakersNew",
              path: "/backend/records/makers/new",
              helper: () => "/backend/records/makers/new"
            },
            {
              name: "backendRecordsMaker",
              component: "MakersEdit",
              exact: true,
              path: "/backend/records/makers/:id",
              helper: m => `/backend/records/makers/${m}`
            }
          ]
        },
        {
          name: "backendRecordsPage",
          component: "PagesDetail",
          path: "/backend/records/pages/:id",
          exact: false,
          helper: p => `/backend/records/pages/${p}`,
          routes: [
            {
              name: "backendRecordsPageNew",
              exact: true,
              component: "PagesNew",
              path: "/backend/records/pages/new",
              helper: () => `/backend/records/pages/new`
            },
            {
              name: "backendRecordsPageBody",
              exact: true,
              component: "PagesBody",
              path: "/backend/records/pages/:id/body",
              helper: p => `/backend/records/pages/${p}/body`
            },
            {
              name: "backendRecordsPageGeneral",
              exact: true,
              component: "PagesGeneral",
              path: "/backend/records/pages/:id/general",
              helper: p => `/backend/records/pages/${p}/general`
            }
          ]
        },
        {
          name: "backendRecordsFeature",
          component: "FeaturesDetail",
          path: "/backend/records/features/:id",
          exact: false,
          helper: f => `/backend/records/features/${f}`,
          routes: [
            {
              name: "backendRecordsFeatureNew",
              exact: true,
              component: "FeaturesNew",
              path: "/backend/records/features/new",
              helper: () => `/backend/records/features/new`
            },
            {
              name: "backendRecordsFeatureGeneral",
              exact: true,
              component: "FeaturesGeneral",
              path: "/backend/records/features/:id",
              helper: p => `/backend/records/features/${p}`
            }
          ]
        },
        {
          name: "backendRecordsPages",
          exact: true,
          component: "PagesList",
          path: "/backend/records/pages",
          helper: () => `/backend/records/pages`
        },
        {
          name: "backendRecordsFeatures",
          exact: true,
          component: "FeaturesList",
          path: "/backend/records/features",
          helper: () => `/backend/records/features`
        }
      ]
    },
    {
      name: "backendSettings",
      exact: false,
      component: "SettingsWrapper",
      path: "/backend/settings",
      helper: () => "/backend/settings",
      routes: [
        {
          name: "backendSettingsTheme",
          exact: true,
          component: "SettingsTheme",
          path: "/backend/settings/theme",
          helper: () => "/backend/settings/theme"
        },
        {
          name: "backendSettingsIntegrations",
          exact: true,
          component: "SettingsIntegrations",
          path: "/backend/settings/integrations",
          helper: () => "/backend/settings/integrations"
        },
        {
          name: "backendSettingsSubjects",
          exact: true,
          component: "SettingsSubjectsList",
          path: "/backend/settings/subjects/:id?",
          helper: () => "/backend/settings/subjects",
          routes: [
            {
              name: "backendSettingsSubjectsNew",
              exact: true,
              component: "SettingsSubjectsNew",
              path: "/backend/settings/subjects/new",
              helper: () => "/backend/settings/subjects/new"
            },
            {
              name: "backendSettingsSubject",
              exact: true,
              component: "SettingsSubjectsEdit",
              path: "/backend/settings/subjects/:id",
              helper: s => `/backend/settings/subjects/${s}`
            }
          ]
        },
        {
          name: "backendSettingsEmail",
          exact: true,
          component: "SettingsEmail",
          path: "/backend/settings/email",
          helper: () => "/backend/settings/email"
        },
        {
          name: "backendSettingsGeneral",
          exact: true,
          component: "SettingsGeneral",
          path: "/backend/settings/general",
          helper: () => "/backend/settings/general"
        }
      ]
    },
    {
      component: NotFound
    }
  ]
};

export default routes;

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
          component: "ResourceCollectionNew",
          path: "/backend/projects/:projectId/resource-collections/new",
          helper: p => `/backend/projects/${p}/resource-collections/new`
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
              name: "backendResourceProperties",
              exact: true,
              component: "ResourceProperties",
              path: "/backend/projects/resource/:id/properties",
              helper: r => `/backend/projects/resource/${r}/properties`
            }
          ]
        },
        {
          name: "backendResourceCollection",
          exact: false,
          component: "ResourceCollectionWrapper",
          path: "/backend/projects/resource-collection/:id",
          helper: r => `/backend/projects/resource-collection/${r}`,
          routes: [
            {
              name: "backendResourceCollectionProperties",
              exact: true,
              component: "ResourceCollectionProperties",
              path: "/backend/projects/resource-collection/:id/properties",
              helper: r =>
                `/backend/projects/resource-collection/${r}/properties`
            },
            {
              name: "backendResourceCollectionResources",
              exact: true,
              component: "ResourceCollectionResources",
              path: "/backend/projects/resource-collection/:id/resources",
              helper: r =>
                `/backend/projects/resource-collection/${r}/resources`
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
              name: "backendTextAnalytics",
              exact: true,
              component: "TextAnalytics",
              path: "/backend/projects/text/:id/analytics",
              helper: t => `/backend/projects/text/${t}/analytics`
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
              name: "backendTextProperties",
              exact: true,
              component: "TextProperties",
              path: "/backend/projects/text/:id/properties",
              helper: t => `/backend/projects/text/${t}/properties`
            },
            {
              name: "backendTextSections",
              exact: false,
              component: "TextSections",
              path: "/backend/projects/text/:id/sections",
              helper: t => `/backend/projects/text/${t}/sections`,
              routes: [
                {
                  name: "backendTextSectionNew",
                  exact: true,
                  component: "TextSectionNew",
                  path: "/backend/projects/text/:id/sections/new",
                  helper: t => `/backend/projects/text/${t}/sections/new`,
                  modal: true
                },
                {
                  name: "backendTextSectionEdit",
                  exact: true,
                  component: "TextSectionEdit",
                  path: "/backend/projects/text/:id/sections/:sectionId/edit",
                  helper: (t, s) =>
                    `/backend/projects/text/${t}/sections/${s}/edit`,
                  modal: true,
                  editor: true
                },
                {
                  name: "backendTextSectionIngest",
                  exact: true,
                  component: "TextSectionIngest",
                  path: "/backend/projects/text/:id/sections/ingestions/new",
                  helper: t =>
                    `/backend/projects/text/${t}/sections/ingestions/new`,
                  modal: false
                },
                {
                  name: "backendTextSectionIngestEdit",
                  exact: true,
                  component: "TextSectionIngestEdit",
                  path:
                    "/backend/projects/text/:id/sections/:sectionId/ingestion",
                  helper: (t, s) =>
                    `/backend/projects/text/${t}/sections/${s}/ingestion`,
                  modal: false
                },
                {
                  name: "backendTextSectionIngestIngest",
                  exact: true,
                  component: "TextSectionIngestIngest",
                  path:
                    "/backend/projects/text/:id/sections/ingestion/:ingestionId/ingest",
                  helper: (t, i) =>
                    `/backend/projects/text/${t}/sections/ingestion/${i}/ingest`,
                  modal: false
                },
                {
                  name: "backendTextSectionProperties",
                  exact: true,
                  component: "TextSectionProperties",
                  path:
                    "/backend/projects/text/:id/sections/:sectionId/properties",
                  helper: (t, s) =>
                    `/backend/projects/text/${t}/sections/${s}/properties`,
                  modal: false
                }
              ]
            },
            {
              name: "backendTextTOC",
              exact: false,
              component: "TextTOC",
              path: "/backend/projects/text/:id/contents",
              helper: t => `/backend/projects/text/${t}/contents`,
              routes: [
                {
                  name: "backendTextTOCEntryNew",
                  exact: true,
                  component: "TextTOCEntryNew",
                  path: "/backend/projects/text/:id/contents/new",
                  helper: t => `/backend/projects/text/${t}/contents/new`,
                  modal: true
                },
                {
                  name: "backendTextTOCEntryEdit",
                  exact: true,
                  component: "TextTOCEntryEdit",
                  path: "/backend/projects/text/:id/contents/:entryId/edit",
                  helper: (t, e) =>
                    `/backend/projects/text/${t}/contents/${e}/edit`,
                  modal: true
                }
              ]
            },
            {
              name: "backendTextAssets",
              exact: false,
              component: "TextAssets",
              path: "/backend/projects/text/:id/assets",
              helper: t => `/backend/projects/text/${t}/assets`,
              routes: [
                {
                  name: "backendTextAssetNew",
                  exact: true,
                  component: "TextAssetAddEdit",
                  path: "/backend/projects/text/:id/assets/new",
                  helper: t => `/backend/projects/text/${t}/assets/new`,
                  modal: true
                },
                {
                  name: "backendTextAssetEdit",
                  exact: true,
                  component: "TextAssetAddEdit",
                  path: "/backend/projects/text/:id/assets/:assetId/edit",
                  helper: (t, a) =>
                    `/backend/projects/text/${t}/assets/${a}/edit`,
                  modal: true
                }
              ]
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
                  name: "backendProjectTextsCreate",
                  exact: true,
                  component: "ProjectTextCreate",
                  path: "/backend/projects/:id/texts/create",
                  helper: p => `/backend/projects/${p}/texts/create`,
                  modal: true
                },
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
              component: "ProjectResourceCollections",
              path: "/backend/projects/:id/resource-collections",
              helper: p => `/backend/projects/${p}/resource-collections`
            },
            {
              name: "backendProjectAccess",
              exact: false,
              component: "ProjectAccessWrapper",
              path: "/backend/projects/:projectId/access",
              helper: p => `/backend/projects/${p}/access`,
              routes: [
                {
                  name: "backendProjectPermissionsNew",
                  exact: true,
                  component: "PermissionNew",
                  path: "/backend/projects/:pId/access/permissions/new",
                  helper: pId =>
                    `/backend/projects/${pId}/access/permissions/new`
                },
                {
                  name: "backendProjectPermission",
                  exact: true,
                  component: "PermissionEdit",
                  path: "/backend/projects/:pId/access/permissions/:id",
                  helper: (pId, id) =>
                    `/backend/projects/${pId}/access/permissions/${id}`
                },
                {
                  name: "backendProjectEntitlementsNew",
                  exact: true,
                  component: "EntitlementsNew",
                  path: "/backend/projects/:projectId/access/entitlements/new",
                  helper: projectId =>
                    `/backend/projects/${projectId}/access/entitlements/new`
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
              name: "backendProjectExportations",
              exact: false,
              component: "ProjectExportations",
              path: "/backend/projects/:pId/exports",
              helper: p => `/backend/projects/${p}/exports`
            },
            {
              name: "backendProjectLayout",
              exact: false,
              component: "ProjectLayout",
              path: "/backend/projects/:id/layout",
              helper: p => `/backend/projects/${p}/layout`,
              routes: [
                {
                  name: "backendProjectActionCalloutNew",
                  exact: true,
                  component: "ActionCalloutNew",
                  path: "/backend/projects/:pId/layout/action-callout/new",
                  helper: p =>
                    `/backend/projects/${p}/layout/action-callout/new`
                },
                {
                  name: "backendProjectActionCalloutEdit",
                  exact: true,
                  component: "ActionCalloutEdit",
                  path: "/backend/projects/:pId/layout/action-callout/:id",
                  helper: (p, id) =>
                    `/backend/projects/${p}/layout/action-callout/${id}`
                },

                {
                  name: "backendProjectContentBlockNew",
                  exact: true,
                  component: "ContentBlockNew",
                  path: "/backend/projects/:pId/layout/content-blocks/new",
                  helper: p =>
                    `/backend/projects/${p}/layout/content-blocks/new`
                },
                {
                  name: "backendProjectContentBlock",
                  exact: true,
                  component: "ContentBlockEdit",
                  path: "/backend/projects/:pId/layout/content-blocks/:id",
                  helper: (p, id) =>
                    `/backend/projects/${p}/layout/content-blocks/${id}`
                }
              ]
            },
            {
              name: "backendProjectLog",
              exact: true,
              component: "ProjectLog",
              path: "/backend/projects/:id/log",
              helper: p => `/backend/projects/${p}/log`
            },
            {
              name: "backendProjectAnalytics",
              exact: true,
              component: "ProjectAnalytics",
              path: "/backend/projects/:id/analytics",
              helper: p => `/backend/projects/${p}/analytics`
            },
            {
              name: "backendProjectProperties",
              exact: true,
              component: "ProjectProperties",
              path: "/backend/projects/:id/properties",
              helper: p => `/backend/projects/${p}/properties`
            }
          ]
        }
      ]
    },
    {
      name: "backendJournals",
      exact: false,
      component: "JournalsWrapper",
      path: "/backend/journals/:id?",
      helper: () => "/backend/journals",
      routes: [
        {
          name: "backendJournalsList",
          exact: true,
          component: "JournalsList",
          path: "/backend/journals",
          helper: () => "/backend/journals"
        },
        {
          name: "backendJournalsNew",
          exact: true,
          component: "JournalsNew",
          path: "/backend/journals/new",
          helper: () => "/backend/journals/new"
        },
        {
          name: "backendJournal",
          exact: false,
          component: "JournalWrapper",
          path: "/backend/journals/:id",
          helper: j => `/backend/journals/${j}`,
          routes: [
            {
              name: "backendJournalProperties",
              exact: true,
              component: "JournalProperties",
              path: "/backend/journals/:id/properties",
              helper: j => `/backend/journals/${j}/properties`
            },
            {
              name: "backendJournalLayout",
              exact: false,
              component: "JournalLayout",
              path: "/backend/journals/:id/layout",
              helper: j => `/backend/journals/${j}/layout`,
              routes: [
                {
                  name: "backendJournalActionCalloutNew",
                  exact: true,
                  component: "ActionCalloutNew",
                  path: "/backend/journals/:id/layout/action-callout/new",
                  helper: j =>
                    `/backend/journals/${j}/layout/action-callout/new`
                },
                {
                  name: "backendJournalActionCalloutEdit",
                  exact: true,
                  component: "ActionCalloutEdit",
                  path: "/backend/journals/:jId/layout/action-callout/:id",
                  helper: (j, id) =>
                    `/backend/journals/${j}/layout/action-callout/${id}`
                }
              ]
            },
            {
              name: "backendJournalAccess",
              exact: false,
              component: "JournalAccessWrapper",
              path: "/backend/journals/:id/access",
              helper: j => `/backend/journals/${j}/access`,
              routes: [
                {
                  name: "backendJournalEntitlementsNew",
                  exact: true,
                  component: "EntitlementsNew",
                  path: "/backend/journals/:id/access/entitlements/new",
                  helper: j => `/backend/journals/${j}/access/entitlements/new`
                }
              ]
            },
            {
              name: "backendJournalVolumes",
              exact: false,
              component: "JournalVolumes",
              path: "/backend/journals/:id/volumes/",
              helper: j => `/backend/journals/${j}/volumes`,
              routes: [
                {
                  exact: false,
                  component: "JournalVolumeWrapper",
                  path: "/backend/journals/:id/volumes/:vId",
                  routes: [
                    {
                      name: "backendJournalVolumeNew",
                      exact: true,
                      component: "JournalVolumeNew",
                      path: "/backend/journals/:id/volumes/new",
                      helper: j => `/backend/journals/${j}/volumes/new`
                    },
                    {
                      name: "backendJournalVolumeEdit",
                      exact: true,
                      component: "JournalVolumeEdit",
                      path: "/backend/journals/:id/volumes/:vId",
                      helper: (j, v) => `/backend/journals/${j}/volumes/${v}`
                    }
                  ]
                }
              ]
            },
            {
              name: "backendJournalIssues",
              exact: false,
              component: "JournalIssues",
              path: "/backend/journals/:id/issues/",
              helper: j => `/backend/journals/${j}/issues`,
              routes: [
                {
                  exact: false,
                  component: "JournalIssueWrapper",
                  path: "/backend/journals/:id/issues/:iId",
                  routes: [
                    {
                      name: "backendJournalIssueNew",
                      exact: true,
                      component: "JournalIssueNew",
                      path: "/backend/journals/:id/issues/new",
                      helper: j => `/backend/journals/${j}/issues/new`
                    },
                    {
                      name: "backendJournalIssueEdit",
                      exact: true,
                      component: "JournalIssueEdit",
                      path: "/backend/journals/:id/issues/:iId",
                      helper: (j, i) => `/backend/journals/${j}/issues/${i}`
                    }
                  ]
                }
              ]
            },
            {
              name: "backendJournalMetadata",
              exact: true,
              component: "JournalMetadata",
              path: "/backend/journals/:id/metadata",
              helper: p => `/backend/journals/${p}/metadata`
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
              name: "backendRecordsPageProperties",
              exact: true,
              component: "PagesProperties",
              path: "/backend/records/pages/:id/properties",
              helper: p => `/backend/records/pages/${p}/properties`
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
              name: "backendRecordsFeatureProperties",
              exact: true,
              component: "FeaturesProperties",
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
        },
        {
          name: "backendRecordsEntitlements",
          exact: false,
          component: "EntitlementsPending",
          path: "/backend/records/entitlements",
          helper: () => `/backend/records/entitlements`,
          routes: [
            {
              name: "backendRecordsEntitlementsNew",
              exact: true,
              component: "EntitlementsPendingNew",
              path: "/backend/records/entitlements/new",
              helper: () => `/backend/records/entitlements/new`
            },
            {
              name: "backendRecordsEntitlementsEdit",
              exact: true,
              component: "EntitlementsPendingEdit",
              path: "/backend/records/entitlements/edit/:id",
              helper: e => `/backend/records/entitlements/edit/${e}`
            },
            {
              name: "backendRecordsEntitlementsImport",
              exact: true,
              component: "EntitlementsPendingImport",
              path: "/backend/records/entitlements/import",
              helper: () => `/backend/records/entitlements/import`
            }
          ]
        },
        {
          name: "backendRecordsEntitlementImports",
          exact: true,
          component: "CSVEntitlementImports",
          path: "/backend/records/entitlement-imports",
          helper: () => `/backend/records/entitlement-imports`
        }
      ]
    },
    {
      name: "backendAnalytics",
      exact: false,
      component: "AnalyticsWrapper",
      path: "/backend/analytics",
      helper: () => "/backend/analytics",
      routes: [
        {
          name: "backendAnalyticsGlobal",
          exact: true,
          component: "AnalyticsGlobal",
          path: "/backend/analytics",
          helper: () => "/backend/analytics",
          routes: []
        },
        {
          name: "backendAnalyticsTopProjects",
          exact: true,
          component: "AnalyticsTopProjects",
          path: "/backend/analytics/top-projects",
          helper: () => "/backend/analytics/top-projects",
          routes: []
        },
        {
          name: "backendAnalyticsTopSearches",
          exact: true,
          component: "AnalyticsTopSearches",
          path: "/backend/analytics/top-searches",
          helper: () => "/backend/analytics/top-searches",
          routes: []
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
          name: "backendSettingsExportTargets",
          exact: false,
          component: "ExportTargetsList",
          path: "/backend/settings/export-targets",
          helper: () => "/backend/settings/export-targets",
          routes: [
            {
              name: "backendSettingsExportTargetsNew",
              exact: true,
              component: "ExportTargetsNew",
              path: "/backend/settings/export-targets/new",
              helper: () => "/backend/settings/export-targets/new"
            },
            {
              name: "backendSettingsExportTargetEdit",
              exact: true,
              component: "ExportTargetsEdit",
              path: "/backend/settings/export-targets/:id",
              helper: et => `/backend/settings/export-targets/${et}`
            }
          ]
        },
        {
          name: "backendSettingsIngestion",
          exact: true,
          component: "SettingsIngestion",
          path: "/backend/settings/ingestion",
          helper: () => "/backend/settings/ingestion"
        },
        {
          name: "backendSettingsEmail",
          exact: true,
          component: "SettingsEmail",
          path: "/backend/settings/email",
          helper: () => "/backend/settings/email"
        },
        {
          name: "backendSettingsProperties",
          exact: true,
          component: "SettingsProperties",
          path: "/backend/settings/properties",
          helper: () => "/backend/settings/properties"
        }
      ]
    },
    {
      component: NotFound
    }
  ]
};

export default routes;

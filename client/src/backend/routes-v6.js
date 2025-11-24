import { Navigate } from "react-router-dom";
import NotFound from "../global/containers/NotFound";
import routeContainers from "backend/containers/route-containers";

const {
  Backend,
  Dashboard,
  ProjectsWrapper,
  ProjectsList,
  ResourceNew,
  ResourceImportWrapper,
  ResourceImportNew,
  ResourceImportMap,
  ResourceImportResults,
  ResourceCollectionNew,
  ProjectNew,
  ResourceWrapper,
  ResourceVariants,
  ResourceMetadata,
  ResourceProperties,
  ResourceTracksList,
  ResourceTrackAdd,
  ResourceCollectionWrapper,
  ResourceCollectionProperties,
  ResourceCollectionResources,
  TextWrapper,
  TextAnalytics,
  TextStyles,
  StylesheetEdit,
  TextMetadata,
  TextCollaborators,
  TextAddCollaborator,
  TextIngestionNew,
  TextIngestionEdit,
  TextProperties,
  TextSections,
  TextSectionNew,
  TextSectionEdit,
  TextSectionIngest,
  TextSectionIngestEdit,
  TextSectionIngestIngest,
  TextSectionProperties,
  TextTOC,
  TextTOCEntryNew,
  TextTOCEntryEdit,
  TextAssets,
  TextAssetAddEdit,
  ProjectCollectionWrapper,
  ProjectCollectionDetail,
  ProjectCollectionManageProjects,
  ProjectCollectionSettings,
  ProjectCollectionNew,
  ProjectWrapper,
  ProjectTexts,
  ProjectTextIngestionNew,
  ProjectTextIngestionEdit,
  IngestionIngest,
  ProjectTextCreate,
  ProjectCategoryWrapper,
  ProjectCategoryNew,
  ProjectCategoryEdit,
  ProjectResources,
  ProjectResourceCollections,
  ProjectAccessWrapper,
  PermissionNew,
  PermissionEdit,
  ProjectCollaborators,
  ProjectAddCollaborator,
  ProjectEvents,
  ProjectMetadata,
  ProjectExportations,
  ProjectLayout,
  ContentBlockNew,
  ContentBlockEdit,
  ProjectLog,
  ProjectAnalytics,
  ProjectProperties,
  JournalsWrapper,
  JournalsList,
  JournalsNew,
  JournalWrapper,
  JournalProperties,
  JournalMetadata,
  JournalLayout,
  JournalIssues,
  JournalIssueEdit,
  JournalIssueNew,
  JournalIssueWrapper,
  JournalVolumes,
  JournalVolumeEdit,
  JournalVolumeNew,
  JournalVolumeWrapper,
  JournalAccessWrapper,
  ReadingGroupsWrapper,
  ReadingGroupsList,
  ReadingGroupWrapper,
  ReadingGroupMembers,
  ReadingGroupAnnotations,
  ReadingGroupDetails,
  Records,
  UsersList,
  UserWrapper,
  UserProperties,
  UserActivity,
  MakersList,
  MakersNew,
  MakersEdit,
  PagesDetail,
  PagesNew,
  PagesBody,
  PagesProperties,
  FeaturesDetail,
  FeaturesNew,
  FeaturesProperties,
  PagesList,
  FeaturesList,
  EntitlementsPending,
  EntitlementsPendingNew,
  EntitlementsPendingEdit,
  EntitlementsPendingImport,
  CSVEntitlementImports,
  AnnotationsList,
  AnnotationDetail,
  CommentsList,
  CommentDetail,
  AnalyticsWrapper,
  AnalyticsGlobal,
  AnalyticsTopProjects,
  AnalyticsTopSearches,
  SettingsWrapper,
  SettingsTheme,
  SettingsIntegrations,
  SettingsSubjectsList,
  SettingsSubjectsNew,
  SettingsSubjectsEdit,
  SettingsEmail,
  SettingsIngestion,
  SettingsProperties,
  ExportTargetsList,
  ExportTargetsNew,
  ExportTargetsEdit,
  ActionCalloutNew,
  ActionCalloutEdit,
  EntitlementsNew
} = routeContainers;

const routes = [
  {
    element: <Backend />,
    path: "/backend",
    handle: {
      name: "backend",
      helper: () => "/backend"
    },
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />
      },
      {
        element: <Dashboard />,
        path: "dashboard",
        handle: {
          name: "backendDashboard",
          helper: () => "/backend/dashboard"
        }
      },
      {
        element: <ProjectsWrapper />,
        path: "projects",
        handle: {
          name: "backendProjects",
          helper: () => "/backend/projects"
        },
        children: [
          {
            index: true,
            element: <Navigate to="all" replace />
          },
          {
            element: <ProjectsList />,
            path: "all",
            handle: {
              name: "backendProjectsAll",
              helper: () => "/backend/projects/all"
            }
          },
          {
            element: <ResourceNew />,
            path: ":projectId/resources/new",
            handle: {
              name: "backendProjectResourcesNew",
              helper: p => `/backend/projects/${p}/resources/new`
            }
          },
          {
            element: <ResourceImportWrapper />,
            path: ":projectId/resource-import",
            handle: {
              name: "backendResourceImport",
              helper: p => `/backend/projects/${p}/resource-import`
            },
            children: [
              {
                element: <ResourceImportNew />,
                index: true,
                handle: {
                  name: "backendResourceImportNew",
                  helper: p => `/backend/projects/${p}/resource-import`
                }
              },
              {
                element: <ResourceImportNew />,
                path: ":id",
                handle: {
                  name: "backendResourceImportEdit",
                  helper: (p, id) =>
                    `/backend/projects/${p}/resource-import/${id}`
                }
              },
              {
                element: <ResourceImportMap />,
                path: ":id/map",
                handle: {
                  name: "backendResourceImportMap",
                  helper: (p, id) =>
                    `/backend/projects/${p}/resource-import/${id}/map`
                }
              },
              {
                element: <ResourceImportResults />,
                path: ":id/results",
                handle: {
                  name: "backendResourceImportResults",
                  helper: (p, id) =>
                    `/backend/projects/${p}/resource-import/${id}/results`
                }
              }
            ]
          },
          {
            element: <ResourceCollectionNew />,
            path: ":projectId/resource-collections/new",
            handle: {
              name: "backendProjectResourceCollectionsNew",
              helper: p => `/backend/projects/${p}/resource-collections/new`
            }
          },
          {
            element: <ProjectNew />,
            path: "new",
            handle: {
              name: "backendProjectsNew",
              helper: () => "/backend/projects/new"
            }
          },
          {
            element: <ResourceWrapper />,
            path: "resource/:id",
            handle: {
              name: "backendResource",
              helper: r => `/backend/projects/resource/${r}`
            },
            children: [
              {
                index: true,
                element: <Navigate to="properties" replace />
              },
              {
                element: <ResourceVariants />,
                path: "variants",
                handle: {
                  name: "backendResourceVariants",
                  helper: r => `/backend/projects/resource/${r}/variants`
                }
              },
              {
                element: <ResourceMetadata />,
                path: "metadata",
                handle: {
                  name: "backendResourceMetadata",
                  helper: r => `/backend/projects/resource/${r}/metadata`
                }
              },
              {
                element: <ResourceProperties />,
                path: "properties",
                handle: {
                  name: "backendResourceProperties",
                  helper: r => `/backend/projects/resource/${r}/properties`
                }
              },
              {
                element: <ResourceTracksList />,
                path: "tracks",
                handle: {
                  name: "backendResourceTracks",
                  helper: r => `/backend/projects/resource/${r}/tracks`
                },
                children: [
                  {
                    element: <ResourceTrackAdd />,
                    path: "new",
                    handle: {
                      name: "backendResourceTrackNew",
                      helper: r => `/backend/projects/resource/${r}/tracks/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <ResourceTrackAdd />,
                    path: ":trackId",
                    handle: {
                      name: "backendResourceTrackEdit",
                      helper: (r, trackId) =>
                        `/backend/projects/resource/${r}/tracks/${trackId}`,
                      drawer: true
                    }
                  }
                ]
              }
            ]
          },
          {
            element: <ResourceCollectionWrapper />,
            path: "resource-collection/:id",
            handle: {
              name: "backendResourceCollection",
              helper: r => `/backend/projects/resource-collection/${r}`
            },
            children: [
              {
                index: true,
                element: <Navigate to="properties" replace />
              },
              {
                element: <ResourceCollectionProperties />,
                path: "properties",
                handle: {
                  name: "backendResourceCollectionProperties",
                  helper: r =>
                    `/backend/projects/resource-collection/${r}/properties`
                }
              },
              {
                element: <ResourceCollectionResources />,
                path: "resources",
                handle: {
                  name: "backendResourceCollectionResources",
                  helper: r =>
                    `/backend/projects/resource-collection/${r}/resources`
                }
              }
            ]
          },
          {
            element: <TextWrapper />,
            path: "text/:id",
            handle: {
              name: "backendText",
              helper: t => `/backend/projects/text/${t}`
            },
            children: [
              {
                index: true,
                element: <Navigate to="analytics" replace />
              },
              {
                element: <TextStyles />,
                path: "styles",
                handle: {
                  name: "backendTextStyles",
                  helper: t => `/backend/projects/text/${t}/styles`
                }
              },
              {
                element: <StylesheetEdit />,
                path: "styles/new",
                handle: {
                  name: "BackendTextStylesheetNew",
                  helper: t => `/backend/projects/text/${t}/styles/new`
                }
              },
              {
                element: <StylesheetEdit />,
                path: "styles/:stylesheet",
                handle: {
                  name: "BackendTextStylesheetEdit",
                  helper: (t, ss) => `/backend/projects/text/${t}/styles/${ss}`
                }
              },
              {
                element: <TextAnalytics />,
                path: "analytics",
                handle: {
                  name: "backendTextAnalytics",
                  helper: t => `/backend/projects/text/${t}/analytics`
                }
              },
              {
                element: <TextMetadata />,
                path: "metadata",
                handle: {
                  name: "backendTextMetadata",
                  helper: t => `/backend/projects/text/${t}/metadata`
                }
              },
              {
                element: <TextCollaborators />,
                path: "collaborators",
                handle: {
                  name: "backendTextCollaborators",
                  helper: t => `/backend/projects/text/${t}/collaborators`
                },
                children: [
                  {
                    element: <TextAddCollaborator />,
                    path: "new",
                    handle: {
                      name: "backendTextCollaboratorNew",
                      helper: tId =>
                        `/backend/projects/text/${tId}/collaborators/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <TextAddCollaborator />,
                    path: ":id",
                    handle: {
                      name: "backendTextCollaboratorEdit",
                      helper: (tId, id) =>
                        `/backend/projects/text/${tId}/collaborators/${id}`,
                      drawer: true
                    }
                  }
                ]
              },
              {
                element: <TextIngestionNew />,
                path: "ingestions/new",
                handle: {
                  name: "backendTextIngestionsNew",
                  helper: t => `/backend/projects/text/${t}/ingestions/new`
                }
              },
              {
                element: <TextIngestionEdit />,
                path: "ingestion/:ingestionId/edit",
                handle: {
                  name: "backendTextIngestionEdit",
                  helper: (t, i) =>
                    `/backend/projects/text/${t}/ingestion/${i}/edit`
                }
              },
              {
                element: <IngestionIngest />,
                path: "ingestion/:ingestionId/ingest",
                handle: {
                  name: "backendTextIngestionIngest",
                  helper: (t, i) =>
                    `/backend/projects/text/${t}/ingestion/${i}/ingest`,
                  ingest: true
                }
              },
              {
                element: <TextProperties />,
                path: "properties",
                handle: {
                  name: "backendTextProperties",
                  helper: t => `/backend/projects/text/${t}/properties`
                }
              },
              {
                element: <TextSections />,
                path: "sections",
                handle: {
                  name: "backendTextSections",
                  helper: t => `/backend/projects/text/${t}/sections`
                },
                children: [
                  {
                    element: <TextSectionNew />,
                    path: "new",
                    handle: {
                      name: "backendTextSectionNew",
                      helper: t => `/backend/projects/text/${t}/sections/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <TextSectionEdit />,
                    path: ":sectionId/edit",
                    handle: {
                      name: "backendTextSectionEdit",
                      helper: (t, s) =>
                        `/backend/projects/text/${t}/sections/${s}/edit`,
                      drawer: true,
                      editor: true
                    }
                  },
                  {
                    element: <TextSectionIngest />,
                    path: "ingestions/new",
                    handle: {
                      name: "backendTextSectionIngest",
                      helper: t =>
                        `/backend/projects/text/${t}/sections/ingestions/new`
                    }
                  },
                  {
                    element: <TextSectionIngest />,
                    path: "ingestions/:ingestionId/edit",
                    handle: {
                      name: "backendTextSectionIngestNewEdit",
                      helper: (t, i) =>
                        `/backend/projects/text/${t}/sections/ingestions/${i}/edit`
                    }
                  },
                  {
                    element: <TextSectionIngestEdit />,
                    path: ":sectionId/ingestion",
                    handle: {
                      name: "backendTextSectionIngestEdit",
                      helper: (t, s) =>
                        `/backend/projects/text/${t}/sections/${s}/ingestion`
                    }
                  },
                  {
                    element: <TextSectionIngestIngest />,
                    path: "ingestion/:ingestionId/ingest",
                    handle: {
                      name: "backendTextSectionIngestIngest",
                      helper: (t, i) =>
                        `/backend/projects/text/${t}/sections/ingestion/${i}/ingest`,
                      ingest: true
                    }
                  },
                  {
                    element: <TextSectionProperties />,
                    path: ":sectionId/properties",
                    handle: {
                      name: "backendTextSectionProperties",
                      helper: (t, s) =>
                        `/backend/projects/text/${t}/sections/${s}/properties`
                    }
                  }
                ]
              },
              {
                element: <TextTOC />,
                path: "contents",
                handle: {
                  name: "backendTextTOC",
                  helper: t => `/backend/projects/text/${t}/contents`
                },
                children: [
                  {
                    element: <TextTOCEntryNew />,
                    path: "new",
                    handle: {
                      name: "backendTextTOCEntryNew",
                      helper: t => `/backend/projects/text/${t}/contents/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <TextTOCEntryEdit />,
                    path: ":entryId/edit",
                    handle: {
                      name: "backendTextTOCEntryEdit",
                      helper: (t, e) =>
                        `/backend/projects/text/${t}/contents/${e}/edit`,
                      drawer: true
                    }
                  }
                ]
              },
              {
                element: <TextAssets />,
                path: "assets",
                handle: {
                  name: "backendTextAssets",
                  helper: t => `/backend/projects/text/${t}/assets`
                },
                children: [
                  {
                    element: <TextAssetAddEdit />,
                    path: "new",
                    handle: {
                      name: "backendTextAssetNew",
                      helper: t => `/backend/projects/text/${t}/assets/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <TextAssetAddEdit />,
                    path: ":assetId/edit",
                    handle: {
                      name: "backendTextAssetEdit",
                      helper: (t, a) =>
                        `/backend/projects/text/${t}/assets/${a}/edit`,
                      drawer: true
                    }
                  }
                ]
              }
            ]
          },
          {
            element: <ProjectCollectionWrapper />,
            path: "project-collections",
            handle: {
              name: "backendProjectCollections",
              helper: () => "/backend/projects/project-collections"
            },
            children: [
              {
                element: <ProjectCollectionNew />,
                path: "new",
                handle: {
                  name: "backendProjectCollectionsNew",
                  helper: () => `/backend/projects/project-collections/new`,
                  drawer: true
                }
              },
              {
                element: <ProjectCollectionDetail />,
                path: ":id",
                handle: {
                  name: "backendProjectCollection",
                  helper: pc => `/backend/projects/project-collections/${pc}`
                },
                children: [
                  {
                    element: <ProjectCollectionManageProjects />,
                    path: "manage-projects",
                    handle: {
                      name: "backendProjectCollectionManageProjects",
                      helper: pc =>
                        `/backend/projects/project-collections/${pc}/manage-projects`,
                      drawer: true
                    }
                  },
                  {
                    element: <ProjectCollectionSettings />,
                    path: "settings",
                    handle: {
                      name: "backendProjectCollectionSettings",
                      helper: pc =>
                        `/backend/projects/project-collections/${pc}/settings`,
                      drawer: true
                    }
                  }
                ]
              }
            ]
          },
          {
            element: <ProjectWrapper />,
            path: ":id",
            handle: {
              name: "backendProject",
              helper: p => `/backend/projects/${p}`
            },
            children: [
              {
                index: true,
                element: <Navigate to="analytics" replace />
              },
              {
                element: <ProjectTexts />,
                path: "texts",
                handle: {
                  name: "backendProjectTexts",
                  helper: p => `/backend/projects/${p}/texts`
                },
                children: [
                  {
                    element: <ProjectTextCreate />,
                    path: "create",
                    handle: {
                      name: "backendProjectTextsCreate",
                      helper: p => `/backend/projects/${p}/texts/create`,
                      drawer: true
                    }
                  },
                  {
                    element: <ProjectTextIngestionNew />,
                    path: "ingestions/new",
                    handle: {
                      name: "backendProjectTextsIngestionsNew",
                      helper: p =>
                        `/backend/projects/${p}/texts/ingestions/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <ProjectTextIngestionEdit />,
                    path: "ingestion/:ingestionId/edit",
                    handle: {
                      name: "backendProjectTextsIngestionEdit",
                      helper: (p, i) =>
                        `/backend/projects/${p}/texts/ingestion/${i}/edit`,
                      drawer: true
                    }
                  },
                  {
                    element: <IngestionIngest />,
                    path: "ingestion/:ingestionId/ingest",
                    handle: {
                      name: "backendProjectTextsIngestionIngest",
                      helper: (p, i) =>
                        `/backend/projects/${p}/texts/ingestion/${i}/ingest`,
                      drawer: true,
                      ingest: true
                    }
                  },
                  {
                    element: <ProjectCategoryWrapper />,
                    path: "category",
                    children: [
                      {
                        element: <ProjectCategoryNew />,
                        path: "new",
                        handle: {
                          name: "backendProjectCategoriesNew",
                          helper: p =>
                            `/backend/projects/${p}/texts/category/new`
                        }
                      },
                      {
                        element: <ProjectCategoryEdit />,
                        path: ":catId/edit",
                        handle: {
                          name: "backendProjectCategory",
                          helper: (p, c) =>
                            `/backend/projects/${p}/texts/category/${c}/edit`
                        }
                      }
                    ]
                  }
                ]
              },
              {
                element: <ProjectResources />,
                path: "resources",
                handle: {
                  name: "backendProjectResources",
                  helper: p => `/backend/projects/${p}/resources`
                }
              },
              {
                element: <ProjectResourceCollections />,
                path: "resource-collections",
                handle: {
                  name: "backendProjectResourceCollections",
                  helper: p => `/backend/projects/${p}/resource-collections`
                }
              },
              {
                element: <ProjectAccessWrapper />,
                path: "access",
                handle: {
                  name: "backendProjectAccess",
                  helper: p => `/backend/projects/${p}/access`
                },
                children: [
                  {
                    element: <PermissionNew />,
                    path: "permissions/new",
                    handle: {
                      name: "backendProjectPermissionsNew",
                      helper: pId =>
                        `/backend/projects/${pId}/access/permissions/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <PermissionEdit />,
                    path: "permissions/:id",
                    handle: {
                      name: "backendProjectPermission",
                      helper: (pId, id) =>
                        `/backend/projects/${pId}/access/permissions/${id}`,
                      drawer: true
                    }
                  },
                  {
                    element: <EntitlementsNew />,
                    path: "entitlements/new",
                    handle: {
                      name: "backendProjectEntitlementsNew",
                      helper: projectId =>
                        `/backend/projects/${projectId}/access/entitlements/new`,
                      drawer: true
                    }
                  }
                ]
              },
              {
                element: <ProjectCollaborators />,
                path: "collaborators",
                handle: {
                  name: "backendProjectCollaborators",
                  helper: p => `/backend/projects/${p}/collaborators`
                },
                children: [
                  {
                    element: <ProjectAddCollaborator />,
                    path: "new",
                    handle: {
                      name: "backendProjectCollaboratorNew",
                      helper: projectId =>
                        `/backend/projects/${projectId}/collaborators/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <ProjectAddCollaborator />,
                    path: ":id",
                    handle: {
                      name: "backendProjectCollaboratorEdit",
                      helper: (projectId, id) =>
                        `/backend/projects/${projectId}/collaborators/${id}`,
                      drawer: true
                    }
                  }
                ]
              },
              {
                element: <ProjectEvents />,
                path: "events",
                handle: {
                  name: "backendProjectEvents",
                  helper: p => `/backend/projects/${p}/events`
                }
              },
              {
                element: <ProjectMetadata />,
                path: "metadata",
                handle: {
                  name: "backendProjectMetadata",
                  helper: p => `/backend/projects/${p}/metadata`
                }
              },
              {
                element: <ProjectExportations />,
                path: "exports",
                handle: {
                  name: "backendProjectExportations",
                  helper: p => `/backend/projects/${p}/exports`
                }
              },
              {
                element: <ProjectLayout />,
                path: "layout",
                handle: {
                  name: "backendProjectLayout",
                  helper: p => `/backend/projects/${p}/layout`
                },
                children: [
                  {
                    element: <ActionCalloutNew />,
                    path: "action-callout/new",
                    handle: {
                      name: "backendProjectActionCalloutNew",
                      helper: p =>
                        `/backend/projects/${p}/layout/action-callout/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <ActionCalloutEdit />,
                    path: "action-callout/:id",
                    handle: {
                      name: "backendProjectActionCalloutEdit",
                      helper: (p, id) =>
                        `/backend/projects/${p}/layout/action-callout/${id}`,
                      drawer: true
                    }
                  },
                  {
                    element: <ContentBlockNew />,
                    path: "content-blocks/new",
                    handle: {
                      name: "backendProjectContentBlockNew",
                      helper: p =>
                        `/backend/projects/${p}/layout/content-blocks/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <ContentBlockEdit />,
                    path: "content-blocks/:id",
                    handle: {
                      name: "backendProjectContentBlock",
                      helper: (p, id) =>
                        `/backend/projects/${p}/layout/content-blocks/${id}`,
                      drawer: true
                    }
                  }
                ]
              },
              {
                element: <ProjectLog />,
                path: "log",
                handle: {
                  name: "backendProjectLog",
                  helper: p => `/backend/projects/${p}/log`
                }
              },
              {
                element: <ProjectAnalytics />,
                path: "analytics",
                handle: {
                  name: "backendProjectAnalytics",
                  helper: p => `/backend/projects/${p}/analytics`
                }
              },
              {
                element: <ProjectProperties />,
                path: "properties",
                handle: {
                  name: "backendProjectProperties",
                  helper: p => `/backend/projects/${p}/properties`
                }
              }
            ]
          }
        ]
      },
      {
        element: <JournalsWrapper />,
        path: "journals",
        handle: {
          name: "backendJournals",
          helper: () => "/backend/journals"
        },
        children: [
          {
            element: <JournalsList />,
            index: true,
            handle: {
              name: "backendJournalsList",
              helper: () => "/backend/journals"
            }
          },
          {
            element: <JournalsNew />,
            path: "new",
            handle: {
              name: "backendJournalsNew",
              helper: () => "/backend/journals/new"
            }
          },
          {
            element: <JournalWrapper />,
            path: ":id",
            handle: {
              name: "backendJournal",
              helper: j => `/backend/journals/${j}`
            },
            children: [
              {
                index: true,
                element: <Navigate to="properties" replace />
              },
              {
                element: <JournalProperties />,
                path: "properties",
                handle: {
                  name: "backendJournalProperties",
                  helper: j => `/backend/journals/${j}/properties`
                }
              },
              {
                element: <JournalLayout />,
                path: "layout",
                handle: {
                  name: "backendJournalLayout",
                  helper: j => `/backend/journals/${j}/layout`
                },
                children: [
                  {
                    element: <ActionCalloutNew />,
                    path: "action-callout/new",
                    handle: {
                      name: "backendJournalActionCalloutNew",
                      helper: j =>
                        `/backend/journals/${j}/layout/action-callout/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <ActionCalloutEdit />,
                    path: "action-callout/:id",
                    handle: {
                      name: "backendJournalActionCalloutEdit",
                      helper: (j, id) =>
                        `/backend/journals/${j}/layout/action-callout/${id}`,
                      drawer: true
                    }
                  }
                ]
              },
              {
                element: <JournalAccessWrapper />,
                path: "access",
                handle: {
                  name: "backendJournalAccess",
                  helper: j => `/backend/journals/${j}/access`
                },
                children: [
                  {
                    element: <EntitlementsNew />,
                    path: "entitlements/new",
                    handle: {
                      name: "backendJournalEntitlementsNew",
                      helper: j =>
                        `/backend/journals/${j}/access/entitlements/new`,
                      drawer: true
                    }
                  }
                ]
              },
              {
                element: <JournalVolumes />,
                path: "volumes",
                handle: {
                  name: "backendJournalVolumes",
                  helper: j => `/backend/journals/${j}/volumes`
                },
                children: [
                  {
                    element: <JournalVolumeWrapper />,
                    path: ":vId",
                    children: [
                      {
                        element: <JournalVolumeNew />,
                        path: "new",
                        handle: {
                          name: "backendJournalVolumeNew",
                          helper: j => `/backend/journals/${j}/volumes/new`,
                          drawer: true
                        }
                      },
                      {
                        element: <JournalVolumeEdit />,
                        index: true,
                        handle: {
                          name: "backendJournalVolumeEdit",
                          helper: (j, v) =>
                            `/backend/journals/${j}/volumes/${v}`,
                          drawer: true
                        }
                      }
                    ]
                  }
                ]
              },
              {
                element: <JournalIssues />,
                path: "issues",
                handle: {
                  name: "backendJournalIssues",
                  helper: j => `/backend/journals/${j}/issues`
                },
                children: [
                  {
                    element: <JournalIssueWrapper />,
                    path: ":iId",
                    children: [
                      {
                        element: <JournalIssueNew />,
                        path: "new",
                        handle: {
                          name: "backendJournalIssueNew",
                          helper: j => `/backend/journals/${j}/issues/new`,
                          drawer: true
                        }
                      },
                      {
                        element: <JournalIssueEdit />,
                        index: true,
                        handle: {
                          name: "backendJournalIssueEdit",
                          helper: (j, i) =>
                            `/backend/journals/${j}/issues/${i}`,
                          drawer: true
                        }
                      }
                    ]
                  }
                ]
              },
              {
                element: <JournalMetadata />,
                path: "metadata",
                handle: {
                  name: "backendJournalMetadata",
                  helper: p => `/backend/journals/${p}/metadata`
                }
              }
            ]
          }
        ]
      },
      {
        element: <ReadingGroupsWrapper />,
        path: "groups",
        handle: {
          name: "backendReadingGroups",
          helper: () => `/backend/groups`
        },
        children: [
          {
            element: <ReadingGroupsList />,
            index: true,
            handle: {
              name: "backendReadingGroupsList",
              helper: () => "/backend/groups"
            }
          },
          {
            element: <ReadingGroupWrapper />,
            path: ":id",
            handle: {
              name: "backendReadingGroup",
              helper: g => `/backend/groups/${g}`
            },
            children: [
              {
                element: <ReadingGroupDetails />,
                path: "details",
                handle: {
                  name: "backendReadingGroupDetails",
                  helper: g => `/backend/groups/${g}/details`
                }
              },
              {
                element: <ReadingGroupMembers />,
                path: "members",
                handle: {
                  name: "backendReadingGroupMembers",
                  helper: g => `/backend/groups/${g}/members`
                }
              },
              {
                element: <ReadingGroupAnnotations />,
                path: "annotations",
                handle: {
                  name: "backendReadingGroupAnnotations",
                  helper: g => `/backend/groups/${g}/annotations`
                },
                children: [
                  {
                    element: <AnnotationDetail />,
                    path: ":id",
                    handle: {
                      name: "backendReadingGroupAnnotationDetail",
                      helper: (g, a) => `/backend/groups/${g}/annotations/${a}`,
                      drawer: true
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        element: <Records />,
        path: "records",
        handle: {
          name: "backendRecords",
          helper: () => "/backend/records"
        },
        children: [
          {
            index: true,
            element: <Navigate to="makers" replace />
          },
          {
            element: <UsersList />,
            path: "users",
            handle: {
              name: "backendRecordsUsers",
              helper: () => "/backend/records/users"
            }
          },
          {
            element: <UserWrapper />,
            path: "users/:id",
            handle: {
              name: "backendRecordsUser",
              helper: u => `/backend/records/users/${u}`
            },
            children: [
              {
                element: <UserWrapper />,
                path: "new",
                handle: {
                  name: "backendRecordsUserNew",
                  helper: () => "/backend/records/users/new"
                }
              },
              {
                element: <UserProperties />,
                path: "properties",
                handle: {
                  name: "backendRecordsUserProperties",
                  helper: u => `/backend/records/users/${u}/properties`
                }
              },
              {
                element: <UserActivity />,
                path: "activity",
                handle: {
                  name: "backendRecordsUserActivity",
                  helper: u => `/backend/records/users/${u}/activity`
                }
              }
            ]
          },
          {
            element: <MakersList />,
            path: "makers",
            handle: {
              name: "backendRecordsMakers",
              helper: () => `/backend/records/makers`
            },
            children: [
              {
                element: <MakersNew />,
                path: "new",
                handle: {
                  name: "backendRecordsMakersNew",
                  helper: () => "/backend/records/makers/new",
                  drawer: true
                }
              },
              {
                element: <MakersEdit />,
                path: ":id",
                handle: {
                  name: "backendRecordsMaker",
                  helper: m => `/backend/records/makers/${m}`,
                  drawer: true
                }
              }
            ]
          },
          {
            element: <PagesDetail />,
            path: "pages/:id",
            handle: {
              name: "backendRecordsPage",
              helper: p => `/backend/records/pages/${p}`
            },
            children: [
              {
                element: <PagesNew />,
                path: "new",
                handle: {
                  name: "backendRecordsPageNew",
                  helper: () => `/backend/records/pages/new`
                }
              },
              {
                element: <PagesBody />,
                path: "body",
                handle: {
                  name: "backendRecordsPageBody",
                  helper: p => `/backend/records/pages/${p}/body`
                }
              },
              {
                element: <PagesProperties />,
                path: "properties",
                handle: {
                  name: "backendRecordsPageProperties",
                  helper: p => `/backend/records/pages/${p}/properties`
                }
              }
            ]
          },
          {
            element: <FeaturesDetail />,
            path: "features/:id",
            handle: {
              name: "backendRecordsFeature",
              helper: f => `/backend/records/features/${f}`
            },
            children: [
              {
                element: <FeaturesNew />,
                path: "new",
                handle: {
                  name: "backendRecordsFeatureNew",
                  helper: () => `/backend/records/features/new`
                }
              },
              {
                element: <FeaturesProperties />,
                index: true,
                handle: {
                  name: "backendRecordsFeatureProperties",
                  helper: p => `/backend/records/features/${p}`
                }
              }
            ]
          },
          {
            element: <PagesList />,
            path: "pages",
            handle: {
              name: "backendRecordsPages",
              helper: () => `/backend/records/pages`
            }
          },
          {
            element: <FeaturesList />,
            path: "features",
            handle: {
              name: "backendRecordsFeatures",
              helper: () => `/backend/records/features`
            }
          },
          {
            element: <EntitlementsPending />,
            path: "entitlements",
            handle: {
              name: "backendRecordsEntitlements",
              helper: () => `/backend/records/entitlements`
            },
            children: [
              {
                element: <EntitlementsPendingNew />,
                path: "new",
                handle: {
                  name: "backendRecordsEntitlementsNew",
                  helper: () => `/backend/records/entitlements/new`,
                  drawer: true
                }
              },
              {
                element: <EntitlementsPendingEdit />,
                path: "edit/:id",
                handle: {
                  name: "backendRecordsEntitlementsEdit",
                  helper: e => `/backend/records/entitlements/edit/${e}`,
                  drawer: true
                }
              },
              {
                element: <EntitlementsPendingImport />,
                path: "import",
                handle: {
                  name: "backendRecordsEntitlementsImport",
                  helper: () => `/backend/records/entitlements/import`
                }
              }
            ]
          },
          {
            element: <CSVEntitlementImports />,
            path: "entitlement-imports",
            handle: {
              name: "backendRecordsEntitlementImports",
              helper: () => `/backend/records/entitlement-imports`
            }
          },
          {
            element: <AnnotationsList />,
            path: "annotations",
            handle: {
              name: "backendRecordsAnnotations",
              helper: () => `/backend/records/annotations`
            },
            children: [
              {
                element: <AnnotationDetail />,
                path: ":id",
                handle: {
                  name: "backendRecordsAnnotationsDetail",
                  helper: a => `/backend/records/annotations/${a}`,
                  drawer: true
                }
              }
            ]
          },
          {
            element: <CommentsList />,
            path: "comments",
            handle: {
              name: "backendRecordsComments",
              helper: () => `/backend/records/comments`
            },
            children: [
              {
                element: <CommentDetail />,
                path: ":id",
                handle: {
                  name: "backendRecordsCommentsDetail",
                  helper: c => `/backend/records/comments/${c}`,
                  drawer: true
                }
              }
            ]
          }
        ]
      },
      {
        element: <AnalyticsWrapper />,
        path: "analytics",
        handle: {
          name: "backendAnalytics",
          helper: () => "/backend/analytics"
        },
        children: [
          {
            element: <AnalyticsGlobal />,
            index: true,
            handle: {
              name: "backendAnalyticsGlobal",
              helper: () => "/backend/analytics"
            }
          },
          {
            element: <AnalyticsTopProjects />,
            path: "top-projects",
            handle: {
              name: "backendAnalyticsTopProjects",
              helper: () => "/backend/analytics/top-projects"
            }
          },
          {
            element: <AnalyticsTopSearches />,
            path: "top-searches",
            handle: {
              name: "backendAnalyticsTopSearches",
              helper: () => "/backend/analytics/top-searches"
            }
          }
        ]
      },
      {
        element: <SettingsWrapper />,
        path: "settings",
        handle: {
          name: "backendSettings",
          helper: () => "/backend/settings"
        },
        children: [
          {
            index: true,
            element: <Navigate to="properties" replace />
          },
          {
            element: <SettingsTheme />,
            path: "theme",
            handle: {
              name: "backendSettingsTheme",
              helper: () => "/backend/settings/theme"
            }
          },
          {
            element: <SettingsIntegrations />,
            path: "integrations",
            handle: {
              name: "backendSettingsIntegrations",
              helper: () => "/backend/settings/integrations"
            }
          },
          {
            element: <SettingsSubjectsList />,
            path: "subjects",
            handle: {
              name: "backendSettingsSubjects",
              helper: () => "/backend/settings/subjects"
            },
            children: [
              {
                element: <SettingsSubjectsNew />,
                path: "new",
                handle: {
                  name: "backendSettingsSubjectsNew",
                  helper: () => "/backend/settings/subjects/new",
                  drawer: true
                }
              },
              {
                element: <SettingsSubjectsEdit />,
                path: ":id",
                handle: {
                  name: "backendSettingsSubject",
                  helper: s => `/backend/settings/subjects/${s}`,
                  drawer: true
                }
              }
            ]
          },
          {
            element: <ExportTargetsList />,
            path: "export-targets",
            handle: {
              name: "backendSettingsExportTargets",
              helper: () => "/backend/settings/export-targets"
            },
            children: [
              {
                element: <ExportTargetsNew />,
                path: "new",
                handle: {
                  name: "backendSettingsExportTargetsNew",
                  helper: () => "/backend/settings/export-targets/new",
                  drawer: true
                }
              },
              {
                element: <ExportTargetsEdit />,
                path: ":id",
                handle: {
                  name: "backendSettingsExportTargetEdit",
                  helper: et => `/backend/settings/export-targets/${et}`,
                  drawer: true
                }
              }
            ]
          },
          {
            element: <SettingsIngestion />,
            path: "ingestion",
            handle: {
              name: "backendSettingsIngestion",
              helper: () => "/backend/settings/ingestion"
            }
          },
          {
            element: <SettingsEmail />,
            path: "email",
            handle: {
              name: "backendSettingsEmail",
              helper: () => "/backend/settings/email"
            }
          },
          {
            element: <SettingsProperties />,
            path: "properties",
            handle: {
              name: "backendSettingsProperties",
              helper: () => "/backend/settings/properties"
            }
          }
        ]
      },
      {
        element: <NotFound />,
        path: "*"
      }
    ]
  }
];

export default routes;

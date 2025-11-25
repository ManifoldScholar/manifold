import { Navigate, Outlet } from "react-router-dom";
import NotFound from "../global/containers/NotFound";

import Backend from "backend/containers/Backend";
import Dashboard from "backend/containers/Dashboard";
import Projects from "backend/containers/projects";
import Project from "backend/containers/project";
import ContentBlock from "backend/containers/content-block";
import ActionCallout from "backend/containers/action-callout";
import Text from "backend/containers/text";
import Stylesheet from "backend/containers/stylesheet";
import Journals from "backend/containers/journals";
import Journal from "backend/containers/journal";
import Analytics from "backend/containers/analytics";
import ReadingGroups from "backend/containers/reading-groups";
import ReadingGroup from "backend/containers/reading-group";
import Annotations from "backend/containers/annotations";
import Settings from "backend/containers/settings";
import ExportTargets from "backend/containers/export-targets";
import Records from "backend/containers/Records";
import Users from "backend/containers/users";
import Pages from "backend/containers/pages";
import Features from "backend/containers/features";
import Makers from "backend/containers/makers";
import Entitlements from "backend/containers/entitlements";
import EntitlementsPending from "backend/containers/entitlements-pending";
import User from "backend/containers/user";
import Comments from "backend/containers/comments";
import ProjectCollection from "backend/containers/project-collection";
import Permission from "backend/containers/permission";
import Ingestion from "backend/containers/ingestion";
import Resource from "backend/containers/resource";
import ResourceImport from "backend/containers/resource-import";
import ResourceCollection from "backend/containers/resource-collection";
import TextTracks from "backend/containers/resource/tracks";

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
      // ==========================================
      // Dashboard
      // ==========================================
      {
        element: <Dashboard />,
        path: "dashboard",
        handle: {
          name: "backendDashboard",
          helper: () => "/backend/dashboard"
        }
      },
      // ==========================================
      // Projects
      // ==========================================
      {
        element: <Projects.Wrapper />,
        path: "projects",
        handle: {
          name: "backendProjects",
          helper: () => "/backend/projects"
        },
        children: [
          // ------------------------------------------
          // Project List & New
          // ------------------------------------------
          {
            index: true,
            element: <Navigate to="all" replace />
          },
          {
            element: <Projects.List />,
            path: "all",
            handle: {
              name: "backendProjectsAll",
              helper: () => "/backend/projects/all"
            }
          },
          {
            element: <Project.New />,
            path: "new",
            handle: {
              name: "backendProjectsNew",
              helper: () => "/backend/projects/new"
            }
          },
          // ------------------------------------------
          // Project Detail (/projects/:id/*)
          // ------------------------------------------
          {
            element: <Project.Wrapper />,
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
                element: <Project.Texts />,
                path: "texts",
                handle: {
                  name: "backendProjectTexts",
                  helper: p => `/backend/projects/${p}/texts`
                },
                children: [
                  {
                    element: <Project.Text.Create />,
                    path: "create",
                    handle: {
                      name: "backendProjectTextsCreate",
                      helper: p => `/backend/projects/${p}/texts/create`,
                      drawer: true
                    }
                  },
                  {
                    element: <Project.Text.Ingestion.New />,
                    path: "ingestions/new",
                    handle: {
                      name: "backendProjectTextsIngestionsNew",
                      helper: p =>
                        `/backend/projects/${p}/texts/ingestions/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <Project.Text.Ingestion.Edit />,
                    path: "ingestion/:ingestionId/edit",
                    handle: {
                      name: "backendProjectTextsIngestionEdit",
                      helper: (p, i) =>
                        `/backend/projects/${p}/texts/ingestion/${i}/edit`,
                      drawer: true
                    }
                  },
                  {
                    element: <Ingestion.Ingest />,
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
                    element: <Project.Category.Wrapper />,
                    path: "category",
                    children: [
                      {
                        element: <Project.Category.New />,
                        path: "new",
                        handle: {
                          name: "backendProjectCategoriesNew",
                          helper: p =>
                            `/backend/projects/${p}/texts/category/new`,
                          drawer: true
                        }
                      },
                      {
                        element: <Project.Category.Edit />,
                        path: ":catId/edit",
                        handle: {
                          name: "backendProjectCategory",
                          helper: (p, c) =>
                            `/backend/projects/${p}/texts/category/${c}/edit`,
                          drawer: true
                        }
                      }
                    ]
                  }
                ]
              },
              {
                element: <Project.Resources />,
                path: "resources",
                handle: {
                  name: "backendProjectResources",
                  helper: p => `/backend/projects/${p}/resources`
                }
              },
              {
                element: <Project.ResourceCollections />,
                path: "resource-collections",
                handle: {
                  name: "backendProjectResourceCollections",
                  helper: p => `/backend/projects/${p}/resource-collections`
                }
              },
              {
                element: <Project.Access.Wrapper />,
                path: "access",
                handle: {
                  name: "backendProjectAccess",
                  helper: p => `/backend/projects/${p}/access`
                },
                children: [
                  {
                    element: <Permission.New />,
                    path: "permissions/new",
                    handle: {
                      name: "backendProjectPermissionsNew",
                      helper: pId =>
                        `/backend/projects/${pId}/access/permissions/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <Permission.Edit />,
                    path: "permissions/:permissionId",
                    handle: {
                      name: "backendProjectPermission",
                      helper: (pId, id) =>
                        `/backend/projects/${pId}/access/permissions/${id}`,
                      drawer: true
                    }
                  },
                  {
                    element: <Entitlements.New />,
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
                element: <Project.Collaborators.List />,
                path: "collaborators",
                handle: {
                  name: "backendProjectCollaborators",
                  helper: p => `/backend/projects/${p}/collaborators`
                },
                children: [
                  {
                    element: <Project.Collaborators.Add />,
                    path: "new",
                    handle: {
                      name: "backendProjectCollaboratorNew",
                      helper: projectId =>
                        `/backend/projects/${projectId}/collaborators/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <Project.Collaborators.Add />,
                    path: ":collaboratorId",
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
                element: <Project.Events />,
                path: "events",
                handle: {
                  name: "backendProjectEvents",
                  helper: p => `/backend/projects/${p}/events`
                }
              },
              {
                element: <Project.Metadata />,
                path: "metadata",
                handle: {
                  name: "backendProjectMetadata",
                  helper: p => `/backend/projects/${p}/metadata`
                }
              },
              {
                element: <Project.Exportations />,
                path: "exports",
                handle: {
                  name: "backendProjectExportations",
                  helper: p => `/backend/projects/${p}/exports`
                }
              },
              {
                element: <Project.Layout />,
                path: "layout",
                handle: {
                  name: "backendProjectLayout",
                  helper: p => `/backend/projects/${p}/layout`
                },
                children: [
                  {
                    element: <ActionCallout.New />,
                    path: "action-callout/new",
                    handle: {
                      name: "backendProjectActionCalloutNew",
                      helper: p =>
                        `/backend/projects/${p}/layout/action-callout/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <ActionCallout.Edit />,
                    path: "action-callout/:calloutId",
                    handle: {
                      name: "backendProjectActionCalloutEdit",
                      helper: (p, id) =>
                        `/backend/projects/${p}/layout/action-callout/${id}`,
                      drawer: true
                    }
                  },
                  {
                    element: <ContentBlock.New />,
                    path: "content-blocks/new",
                    handle: {
                      name: "backendProjectContentBlockNew",
                      helper: p =>
                        `/backend/projects/${p}/layout/content-blocks/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <ContentBlock.Edit />,
                    path: "content-blocks/:blockId",
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
                element: <Project.Log />,
                path: "log",
                handle: {
                  name: "backendProjectLog",
                  helper: p => `/backend/projects/${p}/log`
                }
              },
              {
                element: <Project.Analytics />,
                path: "analytics",
                handle: {
                  name: "backendProjectAnalytics",
                  helper: p => `/backend/projects/${p}/analytics`
                }
              },
              {
                element: <Project.Properties />,
                path: "properties",
                handle: {
                  name: "backendProjectProperties",
                  helper: p => `/backend/projects/${p}/properties`
                }
              }
            ]
          },
          // ------------------------------------------
          // Text Detail (/projects/text/:id/*)
          // ------------------------------------------
          {
            element: <Text.Wrapper />,
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
                element: <Text.Styles />,
                path: "styles",
                handle: {
                  name: "backendTextStyles",
                  helper: t => `/backend/projects/text/${t}/styles`
                },
                children: [
                  {
                    element: <Stylesheet.Edit />,
                    path: "new",
                    handle: {
                      name: "BackendTextStylesheetNew",
                      helper: t => `/backend/projects/text/${t}/styles/new`
                    }
                  },
                  {
                    element: <Stylesheet.Edit />,
                    path: ":stylesheet",
                    handle: {
                      name: "BackendTextStylesheetEdit",
                      helper: (t, ss) =>
                        `/backend/projects/text/${t}/styles/${ss}`
                    }
                  }
                ]
              },
              {
                element: <Text.Analytics />,
                path: "analytics",
                handle: {
                  name: "backendTextAnalytics",
                  helper: t => `/backend/projects/text/${t}/analytics`
                }
              },
              {
                element: <Text.Metadata />,
                path: "metadata",
                handle: {
                  name: "backendTextMetadata",
                  helper: t => `/backend/projects/text/${t}/metadata`
                }
              },
              {
                element: <Text.Collaborators.List />,
                path: "collaborators",
                handle: {
                  name: "backendTextCollaborators",
                  helper: t => `/backend/projects/text/${t}/collaborators`
                },
                children: [
                  {
                    element: <Text.Collaborators.Add />,
                    path: "new",
                    handle: {
                      name: "backendTextCollaboratorNew",
                      helper: tId =>
                        `/backend/projects/text/${tId}/collaborators/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <Text.Collaborators.Add />,
                    path: ":collaboratorId",
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
                element: <Text.Ingestion.New />,
                path: "ingestions/new",
                handle: {
                  name: "backendTextIngestionsNew",
                  helper: t => `/backend/projects/text/${t}/ingestions/new`
                }
              },
              {
                element: <Text.Ingestion.Edit />,
                path: "ingestion/:ingestionId/edit",
                handle: {
                  name: "backendTextIngestionEdit",
                  helper: (t, i) =>
                    `/backend/projects/text/${t}/ingestion/${i}/edit`
                }
              },
              {
                element: <Ingestion.Ingest />,
                path: "ingestion/:ingestionId/ingest",
                handle: {
                  name: "backendTextIngestionIngest",
                  helper: (t, i) =>
                    `/backend/projects/text/${t}/ingestion/${i}/ingest`,
                  ingest: true
                }
              },
              {
                element: <Text.Properties />,
                path: "properties",
                handle: {
                  name: "backendTextProperties",
                  helper: t => `/backend/projects/text/${t}/properties`
                }
              },
              {
                element: <Text.Sections />,
                path: "sections",
                handle: {
                  name: "backendTextSections",
                  helper: t => `/backend/projects/text/${t}/sections`
                },
                children: [
                  {
                    element: <Text.Section.Author />,
                    path: "new",
                    handle: {
                      name: "backendTextSectionNew",
                      helper: t => `/backend/projects/text/${t}/sections/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <Text.Section.Author />,
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
                    element: <Text.Section.Ingest />,
                    path: "ingestions/new",
                    handle: {
                      name: "backendTextSectionIngest",
                      helper: t =>
                        `/backend/projects/text/${t}/sections/ingestions/new`,
                      drawer: true,
                      ingest: true
                    }
                  },
                  {
                    element: <Text.Section.Ingest />,
                    path: "ingestions/:ingestionId/edit",
                    handle: {
                      name: "backendTextSectionIngestNewEdit",
                      helper: (t, i) =>
                        `/backend/projects/text/${t}/sections/ingestions/${i}/edit`,
                      drawer: true,
                      ingest: true
                    }
                  },
                  {
                    element: <Text.Section.Ingest />,
                    path: ":sectionId/ingestion",
                    handle: {
                      name: "backendTextSectionIngestEdit",
                      helper: (t, s) =>
                        `/backend/projects/text/${t}/sections/${s}/ingestion`,
                      drawer: true,
                      ingest: true
                    }
                  },
                  {
                    element: <Ingestion.Ingest />,
                    path: "ingestion/:ingestionId/ingest",
                    handle: {
                      name: "backendTextSectionIngestIngest",
                      helper: (t, i) =>
                        `/backend/projects/text/${t}/sections/ingestion/${i}/ingest`,
                      ingest: true
                    }
                  },
                  {
                    element: <Text.Section.Properties />,
                    path: ":sectionId/properties",
                    handle: {
                      name: "backendTextSectionProperties",
                      helper: (t, s) =>
                        `/backend/projects/text/${t}/sections/${s}/properties`,
                      drawer: true
                    }
                  }
                ]
              },
              {
                element: <Text.TableOfContents />,
                path: "contents",
                handle: {
                  name: "backendTextTOC",
                  helper: t => `/backend/projects/text/${t}/contents`
                },
                children: [
                  {
                    element: <Text.TOCEntry />,
                    path: "new",
                    handle: {
                      name: "backendTextTOCEntryNew",
                      helper: t => `/backend/projects/text/${t}/contents/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <Text.TOCEntry />,
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
                element: <Text.Assets.List />,
                path: "assets",
                handle: {
                  name: "backendTextAssets",
                  helper: t => `/backend/projects/text/${t}/assets`
                },
                children: [
                  {
                    element: <Text.Assets.AddEdit />,
                    path: "new",
                    handle: {
                      name: "backendTextAssetNew",
                      helper: t => `/backend/projects/text/${t}/assets/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <Text.Assets.AddEdit />,
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
          // ------------------------------------------
          // Resource Routes
          // ------------------------------------------
          {
            element: <Resource.New />,
            path: ":projectId/resources/new",
            handle: {
              name: "backendProjectResourcesNew",
              helper: p => `/backend/projects/${p}/resources/new`
            }
          },
          {
            element: <ResourceImport.Wrapper />,
            path: ":projectId/resource-import",
            handle: {
              name: "backendResourceImport",
              helper: p => `/backend/projects/${p}/resource-import`
            },
            children: [
              {
                element: <ResourceImport.New />,
                index: true,
                handle: {
                  name: "backendResourceImportNew",
                  helper: p => `/backend/projects/${p}/resource-import`
                }
              },
              {
                element: <ResourceImport.New />,
                path: ":id",
                handle: {
                  name: "backendResourceImportEdit",
                  helper: (p, id) =>
                    `/backend/projects/${p}/resource-import/${id}`
                }
              },
              {
                element: <ResourceImport.Map />,
                path: ":id/map",
                handle: {
                  name: "backendResourceImportMap",
                  helper: (p, id) =>
                    `/backend/projects/${p}/resource-import/${id}/map`
                }
              },
              {
                element: <ResourceImport.Results />,
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
            element: <Resource.Wrapper />,
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
                element: <Resource.Variants />,
                path: "variants",
                handle: {
                  name: "backendResourceVariants",
                  helper: r => `/backend/projects/resource/${r}/variants`
                }
              },
              {
                element: <Resource.Metadata />,
                path: "metadata",
                handle: {
                  name: "backendResourceMetadata",
                  helper: r => `/backend/projects/resource/${r}/metadata`
                }
              },
              {
                element: <Resource.Properties />,
                path: "properties",
                handle: {
                  name: "backendResourceProperties",
                  helper: r => `/backend/projects/resource/${r}/properties`
                }
              },
              {
                element: <TextTracks.List />,
                path: "tracks",
                handle: {
                  name: "backendResourceTracks",
                  helper: r => `/backend/projects/resource/${r}/tracks`
                },
                children: [
                  {
                    element: <TextTracks.AddEdit />,
                    path: "new",
                    handle: {
                      name: "backendResourceTrackNew",
                      helper: r => `/backend/projects/resource/${r}/tracks/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <TextTracks.AddEdit />,
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
          // ------------------------------------------
          // Resource Collection Routes
          // ------------------------------------------
          {
            element: <ResourceCollection.New />,
            path: ":projectId/resource-collections/new",
            handle: {
              name: "backendProjectResourceCollectionsNew",
              helper: p => `/backend/projects/${p}/resource-collections/new`
            }
          },
          {
            element: <ResourceCollection.Wrapper />,
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
                element: <ResourceCollection.Properties />,
                path: "properties",
                handle: {
                  name: "backendResourceCollectionProperties",
                  helper: r =>
                    `/backend/projects/resource-collection/${r}/properties`
                }
              },
              {
                element: <ResourceCollection.Resources />,
                path: "resources",
                handle: {
                  name: "backendResourceCollectionResources",
                  helper: r =>
                    `/backend/projects/resource-collection/${r}/resources`
                }
              }
            ]
          },
          // ------------------------------------------
          // Project Collection Routes
          // ------------------------------------------
          {
            element: <ProjectCollection.Wrapper />,
            path: "project-collections",
            handle: {
              name: "backendProjectCollections",
              helper: () => "/backend/projects/project-collections"
            },
            children: [
              {
                element: <ProjectCollection.New />,
                path: "new",
                handle: {
                  name: "backendProjectCollectionsNew",
                  helper: () => `/backend/projects/project-collections/new`,
                  drawer: true
                }
              },
              {
                element: <ProjectCollection.Detail />,
                path: ":id",
                handle: {
                  name: "backendProjectCollection",
                  helper: pc => `/backend/projects/project-collections/${pc}`
                },
                children: [
                  {
                    element: <ProjectCollection.ManageProjects />,
                    path: "manage-projects",
                    handle: {
                      name: "backendProjectCollectionManageProjects",
                      helper: pc =>
                        `/backend/projects/project-collections/${pc}/manage-projects`,
                      drawer: true
                    }
                  },
                  {
                    element: <ProjectCollection.Settings />,
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
          }
        ]
      },
      // ==========================================
      // Journals
      // ==========================================
      {
        element: <Journals.Wrapper />,
        path: "journals",
        handle: {
          name: "backendJournals",
          helper: () => "/backend/journals"
        },
        children: [
          {
            element: <Journals.List />,
            index: true,
            handle: {
              name: "backendJournalsList",
              helper: () => "/backend/journals"
            }
          },
          {
            element: <Journals.New />,
            path: "new",
            handle: {
              name: "backendJournalsNew",
              helper: () => "/backend/journals/new"
            }
          },
          {
            element: <Journal.Wrapper />,
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
                element: <Journal.Properties />,
                path: "properties",
                handle: {
                  name: "backendJournalProperties",
                  helper: j => `/backend/journals/${j}/properties`
                }
              },
              {
                element: <Journal.Layout />,
                path: "layout",
                handle: {
                  name: "backendJournalLayout",
                  helper: j => `/backend/journals/${j}/layout`
                },
                children: [
                  {
                    element: <ActionCallout.New />,
                    path: "action-callout/new",
                    handle: {
                      name: "backendJournalActionCalloutNew",
                      helper: j =>
                        `/backend/journals/${j}/layout/action-callout/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <ActionCallout.Edit />,
                    path: "action-callout/:calloutId",
                    handle: {
                      name: "backendJournalActionCalloutEdit",
                      helper: (j, calloutId) =>
                        `/backend/journals/${j}/layout/action-callout/${calloutId}`,
                      drawer: true
                    }
                  }
                ]
              },
              {
                element: <Journal.AccessWrapper />,
                path: "access",
                handle: {
                  name: "backendJournalAccess",
                  helper: j => `/backend/journals/${j}/access`
                },
                children: [
                  {
                    element: <Entitlements.New />,
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
                element: <Journal.Volumes />,
                path: "volumes",
                handle: {
                  name: "backendJournalVolumes",
                  helper: j => `/backend/journals/${j}/volumes`
                },
                children: [
                  {
                    element: <Journal.VolumeNew />,
                    path: "new",
                    handle: {
                      name: "backendJournalVolumeNew",
                      helper: j => `/backend/journals/${j}/volumes/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <Journal.VolumeWrapper />,
                    path: ":volumeId",
                    children: [
                      {
                        element: <Journal.VolumeEdit />,
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
                element: <Journal.Issues />,
                path: "issues",
                handle: {
                  name: "backendJournalIssues",
                  helper: j => `/backend/journals/${j}/issues`
                },
                children: [
                  {
                    element: <Journal.IssueNew />,
                    path: "new",
                    handle: {
                      name: "backendJournalIssueNew",
                      helper: j => `/backend/journals/${j}/issues/new`,
                      drawer: true
                    }
                  },
                  {
                    element: <Journal.IssueWrapper />,
                    path: ":issueId",
                    children: [
                      {
                        element: <Journal.IssueEdit />,
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
                element: <Journal.Metadata />,
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
      // ==========================================
      // Reading Groups
      // ==========================================
      {
        element: <ReadingGroups.Wrapper />,
        path: "groups",
        handle: {
          name: "backendReadingGroups",
          helper: () => `/backend/groups`
        },
        children: [
          {
            element: <ReadingGroups.List />,
            index: true,
            handle: {
              name: "backendReadingGroupsList",
              helper: () => "/backend/groups"
            }
          },
          {
            element: <ReadingGroup.Wrapper />,
            path: ":id",
            handle: {
              name: "backendReadingGroup",
              helper: g => `/backend/groups/${g}`
            },
            children: [
              {
                index: true,
                element: <Navigate to="details" replace />
              },
              {
                element: <ReadingGroup.Details />,
                path: "details",
                handle: {
                  name: "backendReadingGroupDetails",
                  helper: g => `/backend/groups/${g}/details`
                }
              },
              {
                element: <ReadingGroup.Members />,
                path: "members",
                handle: {
                  name: "backendReadingGroupMembers",
                  helper: g => `/backend/groups/${g}/members`
                }
              },
              {
                element: <ReadingGroup.Annotations />,
                path: "annotations",
                handle: {
                  name: "backendReadingGroupAnnotations",
                  helper: g => `/backend/groups/${g}/annotations`
                },
                children: [
                  {
                    element: <Annotations.Detail />,
                    path: ":annotationId",
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
      // ==========================================
      // Records
      // ==========================================
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
            element: <Outlet />,
            path: "users",
            handle: {
              name: "backendRecordsUsers",
              helper: () => "/backend/records/users"
            },
            children: [
              {
                index: true,
                element: <Users.List />
              },
              {
                element: <User.New />,
                path: "new",
                handle: {
                  name: "backendRecordsUserNew",
                  helper: () => "/backend/records/users/new"
                }
              },
              {
                element: <User.Wrapper />,
                path: ":id",
                handle: {
                  name: "backendRecordsUser",
                  helper: u => `/backend/records/users/${u}`
                },
                children: [
                  {
                    index: true,
                    element: <Navigate to="properties" replace />
                  },
                  {
                    element: <User.Properties />,
                    path: "properties",
                    handle: {
                      name: "backendRecordsUserProperties",
                      helper: u => `/backend/records/users/${u}/properties`
                    }
                  },
                  {
                    element: <User.Activity />,
                    path: "activity",
                    handle: {
                      name: "backendRecordsUserActivity",
                      helper: u => `/backend/records/users/${u}/activity`
                    }
                  }
                ]
              }
            ]
          },
          {
            element: <Makers.List />,
            path: "makers",
            handle: {
              name: "backendRecordsMakers",
              helper: () => `/backend/records/makers`
            },
            children: [
              {
                element: <Makers.New />,
                path: "new",
                handle: {
                  name: "backendRecordsMakersNew",
                  helper: () => "/backend/records/makers/new",
                  drawer: true
                }
              },
              {
                element: <Makers.Edit />,
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
            element: <Outlet />,
            path: "pages",
            handle: {
              name: "backendRecordsPages",
              helper: () => `/backend/records/pages`
            },
            children: [
              {
                index: true,
                element: <Pages.List />
              },
              {
                element: <Pages.New />,
                path: "new",
                handle: {
                  name: "backendRecordsPageNew",
                  helper: () => `/backend/records/pages/new`
                }
              },
              {
                element: <Pages.Wrapper />,
                path: ":id",
                handle: {
                  name: "backendRecordsPage",
                  helper: p => `/backend/records/pages/${p}`
                },
                children: [
                  {
                    index: true,
                    element: <Navigate to="properties" replace />
                  },
                  {
                    element: <Pages.Detail />,
                    path: "properties",
                    handle: {
                      name: "backendRecordsPageProperties",
                      helper: p => `/backend/records/pages/${p}/properties`
                    }
                  }
                ]
              }
            ]
          },
          {
            element: <Outlet />,
            path: "features",
            handle: {
              name: "backendRecordsFeatures",
              helper: () => `/backend/records/features`
            },
            children: [
              {
                index: true,
                element: <Features.List />
              },
              {
                element: <Features.New />,
                path: "new",
                handle: {
                  name: "backendRecordsFeatureNew",
                  helper: () => `/backend/records/features/new`
                }
              },
              {
                element: <Features.Wrapper />,
                path: ":id",
                handle: {
                  name: "backendRecordsFeature",
                  helper: f => `/backend/records/features/${f}`
                },
                children: [
                  {
                    index: true,
                    element: <Navigate to="properties" replace />
                  },
                  {
                    element: <Features.Detail />,
                    path: "properties",
                    handle: {
                      name: "backendRecordsFeatureProperties",
                      helper: f => `/backend/records/features/${f}/properties`
                    }
                  }
                ]
              }
            ]
          },
          {
            element: <EntitlementsPending.List />,
            path: "entitlements",
            handle: {
              name: "backendRecordsEntitlements",
              helper: () => `/backend/records/entitlements`
            },
            children: [
              {
                element: <EntitlementsPending.AddEdit />,
                path: "new",
                handle: {
                  name: "backendRecordsEntitlementsNew",
                  helper: () => `/backend/records/entitlements/new`,
                  drawer: true
                }
              },
              {
                element: <EntitlementsPending.AddEdit />,
                path: "edit/:id",
                handle: {
                  name: "backendRecordsEntitlementsEdit",
                  helper: e => `/backend/records/entitlements/edit/${e}`,
                  drawer: true
                }
              },
              {
                element: <EntitlementsPending.Import />,
                path: "import",
                handle: {
                  name: "backendRecordsEntitlementsImport",
                  helper: () => `/backend/records/entitlements/import`,
                  drawer: true
                }
              }
            ]
          },
          {
            element: <EntitlementsPending.CSVImports />,
            path: "entitlement-imports",
            handle: {
              name: "backendRecordsEntitlementImports",
              helper: () => `/backend/records/entitlement-imports`
            }
          },
          {
            element: <Annotations.List />,
            path: "annotations",
            handle: {
              name: "backendRecordsAnnotations",
              helper: () => `/backend/records/annotations`
            },
            children: [
              {
                element: <Annotations.Detail />,
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
            element: <Comments.List />,
            path: "comments",
            handle: {
              name: "backendRecordsComments",
              helper: () => `/backend/records/comments`
            },
            children: [
              {
                element: <Comments.Detail />,
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
      // ==========================================
      // Analytics
      // ==========================================
      {
        element: <Analytics.Wrapper />,
        path: "analytics",
        handle: {
          name: "backendAnalytics",
          helper: () => "/backend/analytics"
        },
        children: [
          {
            element: <Analytics.Global />,
            index: true,
            handle: {
              name: "backendAnalyticsGlobal",
              helper: () => "/backend/analytics"
            }
          },
          {
            element: <Analytics.TopProjects />,
            path: "top-projects",
            handle: {
              name: "backendAnalyticsTopProjects",
              helper: () => "/backend/analytics/top-projects"
            }
          },
          {
            element: <Analytics.TopSearches />,
            path: "top-searches",
            handle: {
              name: "backendAnalyticsTopSearches",
              helper: () => "/backend/analytics/top-searches"
            }
          }
        ]
      },
      // ==========================================
      // Settings
      // ==========================================
      {
        element: <Settings.Wrapper />,
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
            element: <Settings.Theme />,
            path: "theme",
            handle: {
              name: "backendSettingsTheme",
              helper: () => "/backend/settings/theme"
            }
          },
          {
            element: <Settings.Integrations />,
            path: "integrations",
            handle: {
              name: "backendSettingsIntegrations",
              helper: () => "/backend/settings/integrations"
            }
          },
          {
            element: <Settings.Subjects.List />,
            path: "subjects",
            handle: {
              name: "backendSettingsSubjects",
              helper: () => "/backend/settings/subjects"
            },
            children: [
              {
                element: <Settings.Subjects.New />,
                path: "new",
                handle: {
                  name: "backendSettingsSubjectsNew",
                  helper: () => "/backend/settings/subjects/new",
                  drawer: true
                }
              },
              {
                element: <Settings.Subjects.Edit />,
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
            element: <ExportTargets.List />,
            path: "export-targets",
            handle: {
              name: "backendSettingsExportTargets",
              helper: () => "/backend/settings/export-targets"
            },
            children: [
              {
                element: <ExportTargets.New />,
                path: "new",
                handle: {
                  name: "backendSettingsExportTargetsNew",
                  helper: () => "/backend/settings/export-targets/new",
                  drawer: true
                }
              },
              {
                element: <ExportTargets.Edit />,
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
            element: <Settings.Ingestion />,
            path: "ingestion",
            handle: {
              name: "backendSettingsIngestion",
              helper: () => "/backend/settings/ingestion"
            }
          },
          {
            element: <Settings.Email />,
            path: "email",
            handle: {
              name: "backendSettingsEmail",
              helper: () => "/backend/settings/email"
            }
          },
          {
            element: <Settings.Properties />,
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

import queryString from "query-string";
import NotFound from "global/containers/NotFound";
import requireAuth from "helpers/router/requireAuth";
import checkLibraryMode from "helpers/router/checkLibraryMode";
import ApiDocs from "frontend/containers/Api";
import Frontend from "frontend/containers/Frontend";
import ProjectsWrapper from "frontend/containers/ProjectsWrapper";
import Projects from "frontend/containers/Projects";
import ProjectCollections from "frontend/containers/ProjectCollections";
import ProjectCollectionDetail from "frontend/containers/ProjectCollectionDetail";
import ProjectWrapper from "frontend/containers/ProjectWrapper";
import ProjectDetail from "frontend/containers/ProjectDetail";
import ProjectSearch from "frontend/containers/ProjectSearch";
import ProjectResources from "frontend/containers/ProjectResources";
import ResourceDetail from "frontend/containers/ResourceDetail";
import ProjectResourceCollections from "frontend/containers/ProjectResourceCollections";
import ResourceCollectionDetail from "frontend/containers/ResourceCollectionDetail";
import EventList from "frontend/containers/EventList";
import Search from "frontend/containers/Search";
import Contact from "frontend/containers/Contact";
import PasswordReset from "frontend/containers/PasswordReset";
import Page from "frontend/containers/Page";
import Subscriptions from "frontend/containers/Subscriptions";
import Unsubscribe from "frontend/containers/Unsubscribe";
import Home from "frontend/containers/Home";
import MyReadingGroups from "frontend/containers/MyReadingGroups";
import PublicReadingGroups from "frontend/containers/PublicReadingGroups";
import ReadingGroup from "frontend/containers/ReadingGroup";
import ReadingGroupMembers from "frontend/containers/ReadingGroup/Members";
import ReadingGroupAnnotations from "frontend/containers/ReadingGroup/Annotations";
import ReadingGroupHomepage from "frontend/containers/ReadingGroup/Homepage";
import Login from "frontend/containers/Login";
import MyStarred from "frontend/containers/MyStarred";
import MyAnnotations from "frontend/containers/MyAnnotations";
import IssuesList from "frontend/containers/IssuesList";
import JournalsWrapper from "frontend/containers/JournalsWrapper";
import JournalsList from "frontend/containers/JournalsList";
import JournalWrapper from "frontend/containers/JournalWrapper";
import JournalDetail from "frontend/containers/JournalDetail";
import VolumeDetail from "frontend/containers/VolumeDetail";
import JournalVolumesList from "frontend/containers/JournalVolumesList";
import JournalIssuesList from "frontend/containers/JournalIssuesList";
import PrivacySettings from "frontend/containers/PrivacySettings";
import DataUse from "frontend/containers/DataUse";

const routes = [
  {
    element: <Frontend />,
    path: "",
    handle: { isLibrary: true },
    children: [
      {
        element: <ProjectsWrapper />,
        path: "projects",
        handle: {
          name: "frontendProjects",
          isLibrary: true,
          helper: () => "/projects"
        },
        children: [
          {
            element: <Projects />,
            index: true,
            loader: checkLibraryMode,
            handle: {
              name: "frontendProjectsAll",
              isLibrary: true,
              helper: (params = {}) => {
                const query = queryString.stringify(params);
                if (!query) return "/projects";
                return `/projects?${query}`;
              }
            }
          },
          {
            element: <ProjectCollections />,
            path: "project-collections",
            loader: checkLibraryMode,
            handle: {
              name: "frontendProjectCollections",
              isLibrary: true,
              helper: (params = {}) => {
                const query = queryString.stringify(params);
                if (!query) return "/projects/project-collections";
                return `/projects/project-collections?${query}`;
              }
            }
          },
          {
            element: <ProjectCollectionDetail />,
            path: "project-collection/:id",
            loader: checkLibraryMode,
            handle: {
              name: "frontendProjectCollection",
              isLibrary: true,
              helper: (pc, params = {}) => {
                const query = queryString.stringify(params);
                if (!query) return `/projects/project-collection/${pc}`;
                return `/projects/project-collection/${pc}?${query}`;
              }
            }
          },
          {
            element: <ProjectWrapper />,
            path: ":id",
            handle: {
              name: "frontendProject",
              helper: p => `/projects/${p}`
            },
            children: [
              {
                index: true,
                element: <ProjectDetail />,
                handle: {
                  name: "frontendProjectDetail",
                  helper: p => `/projects/${p}`
                }
              },
              {
                element: <ProjectSearch />,
                path: "search",
                handle: {
                  name: "frontendProjectSearch",
                  helper: (p, params = {}) => {
                    const query = queryString.stringify(params);
                    if (!query) return `/projects/${p}/search`;
                    return `/projects/${p}/search/?${query}`;
                  }
                }
              },
              {
                element: <ProjectResources />,
                path: "resources",
                handle: {
                  name: "frontendProjectResources",
                  helper: (p, params = {}) => {
                    const query = queryString.stringify(params);
                    if (!query) return `/projects/${p}/resources`;
                    return `/projects/${p}/resources/?${query}`;
                  }
                }
              },
              {
                element: <ProjectResourceCollections />,
                path: "resource-collections",
                handle: {
                  name: "frontendProjectResourceCollections",
                  helper: p => `/projects/${p}/resource-collections`
                }
              },
              {
                element: <ResourceDetail />,
                path:
                  "resource-collection/:resourceCollectionId/resource/:resourceId",
                handle: {
                  name: "frontendProjectCollectionResource",
                  helper: (p, c, r) =>
                    `/projects/${p}/resource-collection/${c}/resource/${r}`
                }
              },
              {
                element: <ResourceDetail />,
                path: "resource/:resourceId",
                handle: {
                  name: "frontendProjectResource",
                  helpers: {
                    frontendProjectResource: (p, r) =>
                      `/projects/${p}/resource/${r}`,
                    frontendProjectResourceRelative: r => `resource/${r}`
                  }
                }
              },
              {
                element: <ResourceCollectionDetail />,
                path: "resource-collection/:resourceCollectionId",
                handle: {
                  name: "frontendProjectResourceCollection",
                  helpers: {
                    frontendProjectResourceCollection: (p, c, params = {}) => {
                      const query = queryString.stringify(params);
                      if (!query)
                        return `/projects/${p}/resource-collection/${c}`;
                      return `/projects/${p}/resource-collection/${c}?${query}`;
                    },
                    frontendProjectResourceCollectionRelative: c =>
                      `resource-collection/${c}`
                  }
                }
              },
              {
                element: <EventList />,
                path: "events",
                handle: {
                  name: "frontendProjectEvents",
                  helper: p => `/projects/${p}/events`
                }
              },
              {
                element: <NotFound />,
                path: "*"
              }
            ]
          }
        ]
      },
      {
        element: <JournalsWrapper />,
        path: "journals",
        handle: {
          name: "frontendJournals",
          isLibrary: true,
          helper: () => "/journals"
        },
        children: [
          {
            element: <JournalsList />,
            index: true,
            loader: checkLibraryMode,
            handle: {
              name: "frontendJournalsList",
              isLibrary: true,
              helper: (params = {}) => {
                const query = queryString.stringify(params);
                if (!query) return "/journals";
                return `/journals?${query}`;
              }
            }
          },
          {
            element: <IssuesList />,
            path: "issues",
            loader: checkLibraryMode,
            handle: {
              name: "frontendIssuesList",
              isLibrary: true,
              helper: (params = {}) => {
                const query = queryString.stringify(params);
                if (!query) return "/journals/issues";
                return `/journals/issues?${query}`;
              }
            }
          },
          {
            element: <JournalWrapper />,
            path: ":id",
            handle: {
              name: "frontendJournal",
              helper: j => `/journals/${j}`
            },
            children: [
              {
                index: true,
                element: <JournalDetail />,
                handle: {
                  name: "frontendJournalDetail",
                  helper: j => `/journals/${j}`
                }
              },
              {
                element: <JournalIssuesList />,
                path: "issues",
                handle: {
                  name: "frontendJournalAllIssues",
                  helper: j => `/journals/${j}/issues`
                }
              },
              {
                element: <JournalVolumesList />,
                path: "volumes",
                handle: {
                  name: "frontendJournalAllVolumes",
                  helper: j => `/journals/${j}/volumes`
                }
              },
              {
                element: <VolumeDetail />,
                path: "volumes/:volumeSlug",
                handle: {
                  name: "frontendVolumeDetail",
                  helper: (j, v) => `/journals/${j}/volumes/${v}`
                }
              }
            ]
          }
        ]
      },
      {
        element: <PublicReadingGroups.Wrapper />,
        path: "groups",
        handle: {
          name: "frontendPublicReadingGroups",
          helper: (params = {}) => {
            const query = queryString.stringify(params);
            const base = `/groups`;
            if (!query) return base;
            return `${base}?${query}`;
          }
        },
        children: [
          {
            index: true,
            element: <PublicReadingGroups.List />,
            handle: {
              name: "frontendPublicReadingGroupsList",
              helper: (params = {}) => {
                const query = queryString.stringify(params);
                const base = `/groups`;
                if (!query) return base;
                return `${base}?${query}`;
              }
            }
          },
          {
            element: <ReadingGroup />,
            path: ":id",
            handle: {
              name: "frontendReadingGroupDetail",
              helper: (rg, params = {}) => {
                const query = queryString.stringify(params);
                const base = `/groups/${rg}`;
                if (!query) return base;
                return `${base}?${query}`;
              }
            },
            children: [
              {
                element: <ReadingGroupAnnotations />,
                path: "annotations",
                handle: {
                  name: "frontendReadingGroupAnnotations",
                  helper: (rg, params = {}) => {
                    const query = queryString.stringify(params);
                    const base = `/groups/${rg}/annotations`;
                    if (!query) return base;
                    return `${base}?${query}`;
                  }
                }
              },
              {
                element: <ReadingGroupMembers.Wrapper />,
                path: "members",
                handle: {
                  name: "frontendReadingGroupMembers",
                  helper: rg => `/groups/${rg}/members`
                },
                children: [
                  {
                    index: true,
                    element: null
                  },
                  {
                    element: <ReadingGroupMembers.MemberEdit />,
                    path: ":membershipId",
                    handle: {
                      name: "frontendReadingGroupMember",
                      helper: (rg, m) => `/groups/${rg}/members/${m}`,
                      drawer: true
                    }
                  }
                ]
              },
              {
                element: <ReadingGroupHomepage.Wrapper />,
                path: "",
                children: [
                  {
                    element: <ReadingGroupHomepage.Fetch />,
                    path: "",
                    children: [
                      {
                        index: true,
                        element: <ReadingGroupHomepage.Static />,
                        handle: {
                          name: "frontendReadingGroupHomepageStatic",
                          helper: rg => `/groups/${rg}`
                        }
                      },
                      {
                        element: <ReadingGroupHomepage.Edit />,
                        path: "edit",
                        handle: {
                          name: "frontendReadingGroupHomepageEdit",
                          helper: rg => `/groups/${rg}/edit`
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        element: <MyReadingGroups.Wrapper />,
        path: "my/groups",
        loader: async ({ context, request }) => {
          const url = new URL(request.url);
          return requireAuth(context, url.pathname);
        },
        handle: {
          name: "frontendMyReadingGroups",
          helper: (params = {}) => {
            const query = queryString.stringify(params);
            const base = `/my/groups`;
            if (!query) return base;
            return `${base}?${query}`;
          }
        },
        children: [
          {
            index: true,
            element: null
          },
          {
            element: <MyReadingGroups.New />,
            path: "new",
            handle: {
              name: "frontendMyReadingGroupsNew",
              helper: () => "/my/groups/new",
              drawer: true
            }
          }
        ]
      },
      {
        element: <MyStarred />,
        path: "my/starred",
        loader: async ({ context, request }) => {
          const url = new URL(request.url);
          return requireAuth(context, url.pathname);
        },
        handle: {
          name: "frontendStarred",
          helper: () => "/my/starred"
        }
      },
      {
        element: <MyAnnotations />,
        path: "my/notes",
        loader: async ({ context, request }) => {
          const url = new URL(request.url);
          return requireAuth(context, url.pathname);
        },
        handle: {
          name: "frontendAnnotations",
          helper: () => "/my/notes"
        }
      },
      {
        element: <Search />,
        path: "search",
        loader: checkLibraryMode,
        handle: {
          name: "frontendSearch",
          isLibrary: true,
          helper: () => `/search`
        }
      },
      {
        element: <Login />,
        path: "login",
        handle: {
          name: "frontendLogin",
          helper: () => `/login`
        }
      },
      {
        element: <Login />,
        path: "signup",
        handle: {
          name: "frontendSignUp",
          helper: () => `/signup`
        }
      },
      {
        element: <Contact />,
        path: "contact",
        handle: {
          name: "frontendContact",
          helper: () => "/contact"
        }
      },
      {
        element: <PasswordReset />,
        path: "reset-password/:resetToken"
      },
      {
        element: <Page />,
        path: "page/:slug",
        handle: {
          name: "frontendPage",
          helper: p => `/page/${p}`
        }
      },
      {
        element: <Subscriptions />,
        path: "subscriptions",
        loader: async ({ context, request }) => {
          const url = new URL(request.url);
          return requireAuth(context, url.pathname);
        },
        handle: {
          name: "subscriptions",
          helper: () => "/subscriptions"
        }
      },
      {
        element: <PrivacySettings />,
        path: "privacy",
        loader: async ({ context, request }) => {
          const url = new URL(request.url);
          return requireAuth(context, url.pathname);
        },
        handle: {
          name: "privacy",
          helper: () => "/privacy"
        }
      },
      {
        element: <DataUse />,
        path: "data-use",
        handle: {
          name: "dataUse",
          helper: () => "/data-use"
        }
      },
      {
        element: <Unsubscribe />,
        path: "unsubscribe/:token",
        handle: {
          name: "unsubscribe",
          helper: token => `/unsubscribe/${token}`
        }
      },
      {
        element: <ApiDocs />,
        path: "docs/api",
        handle: {
          name: "api",
          helper: () => "/docs/api"
        }
      },
      {
        index: true,
        element: <Home />,
        loader: checkLibraryMode,
        handle: {
          name: "frontend",
          isLibrary: true,
          helper: (params = {}) => {
            const query = queryString.stringify(params);
            if (!query) return "/";
            return `/?${query}`;
          }
        }
      },
      {
        element: <NotFound />,
        path: "*"
      }
    ]
  }
];

export default routes;

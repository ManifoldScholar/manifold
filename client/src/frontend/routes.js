import queryString from "query-string";
import NotFound from "global/containers/NotFound";

const routes = {
  component: "Frontend",
  path: "/",
  isLibrary: true,
  routes: [
    {
      name: "frontendProjects",
      exact: false,
      component: "ProjectsWrapper",
      path: "/projects",
      isLibrary: true,
      helper: () => "/projects",
      routes: [
        {
          name: "frontendProjectsAll",
          exact: true,
          component: "Projects",
          path: "/projects/all",
          isLibrary: true,
          helper: (params = {}) => {
            const query = queryString.stringify(params);
            if (!query) return "/projects/all";
            return `/projects/all?${query}`;
          }
        },
        {
          name: "frontendProjectCollections",
          exact: true,
          component: "ProjectCollections",
          path: "/projects/project-collections",
          isLibrary: true,
          helper: (params = {}) => {
            const query = queryString.stringify(params);
            if (!query) return "/projects/project-collections";
            return `/projects/project-collections?${query}`;
          }
        },
        {
          name: "frontendProjectCollection",
          exact: true,
          component: "ProjectCollectionDetail",
          path: "/projects/project-collection/:id",
          isLibrary: true,
          helper: (pc, params = {}) => {
            const query = queryString.stringify(params);
            if (!query) return `/projects/project-collection/${pc}`;
            return `/projects/project-collection/${pc}?${query}`;
          }
        },
        {
          name: "frontendProject",
          exact: false,
          component: "ProjectWrapper",
          path: "/projects/:id",
          helper: p => `/projects/${p}`,
          routes: [
            {
              name: "frontendProjectDetail",
              exact: true,
              component: "ProjectDetail",
              path: "/projects/:id",
              helper: p => `/projects/${p}`
            },
            {
              name: "frontendProjectSearch",
              exact: true,
              component: "ProjectSearch",
              path: "/projects/:id/search",
              helper: (p, params = {}) => {
                const query = queryString.stringify(params);
                if (!query) return `/projects/${p}/search`;
                return `/projects/${p}/search/?${query}`;
              }
            },
            {
              name: "frontendProjectResources",
              exact: true,
              component: "ProjectResources",
              path: "/projects/:id/resources",
              helper: (p, params = {}) => {
                const query = queryString.stringify(params);
                if (!query) return `/projects/${p}/resources`;
                return `/projects/${p}/resources/?${query}`;
              }
            },
            {
              name: "frontendProjectResourceCollections",
              exact: true,
              component: "ProjectResourceCollections",
              path: "/projects/:id/resource-collections",
              helper: p => {
                return `/projects/${p}/resource-collections`;
              }
            },
            {
              name: "frontendProjectCollectionResource",
              exact: true,
              component: "ResourceDetail",
              path:
                "/projects/:id/resource-collection/:resourceCollectionId/resource/:resourceId",
              helper: (p, c, r) =>
                `/projects/${p}/resource-collection/${c}/resource/${r}`
            },
            {
              name: "frontendProjectResource",
              exact: true,
              component: "ResourceDetail",
              path: "/projects/:id/resource/:resourceId",
              helpers: {
                frontendProjectResource: (p, r) =>
                  `/projects/${p}/resource/${r}`,
                frontendProjectResourceRelative: r => `resource/${r}`
              }
            },
            {
              name: "frontendProjectResourceCollection",
              exact: true,
              component: "ResourceCollectionDetail",
              path: "/projects/:id/resource-collection/:resourceCollectionId",
              helpers: {
                frontendProjectResourceCollection: (p, c, params = {}) => {
                  const query = queryString.stringify(params);
                  if (!query) return `/projects/${p}/resource-collection/${c}`;
                  return `/projects/${p}/resource-collection/${c}?${query}`;
                },
                frontendProjectResourceCollectionRelative: c =>
                  `resource-collection/${c}`
              }
            },
            {
              name: "frontendProjectEvents",
              exact: true,
              component: "EventList",
              path: "/projects/:id/events/:page?",
              helpers: {
                frontendProjectEvents: p => `/projects/${p}/events`,
                frontendProjectEventsPage: (pr, pg) =>
                  `/projects/${pr}/events/${pg}`
              }
            },
            {
              component: NotFound
            }
          ]
        }
      ]
    },
    {
      name: "frontendJournals",
      exact: false,
      component: "JournalsWrapper",
      path: "/journals",
      isLibrary: true,
      helper: () => "/journals",
      routes: [
        {
          name: "frontendJournalsList",
          exact: true,
          component: "JournalsList",
          path: "/journals/all",
          isLibrary: true,
          helper: (params = {}) => {
            const query = queryString.stringify(params);
            if (!query) return "/journals/all";
            return `/journals/all?${query}`;
          }
        },
        {
          name: "frontendIssuesList",
          exact: true,
          component: "IssuesList",
          path: "/journals/issues",
          isLibrary: true,
          helper: (params = {}) => {
            const query = queryString.stringify(params);
            if (!query) return "/journals/issues";
            return `/journals/issues?${query}`;
          }
        },
        {
          name: "frontendJournal",
          exact: false,
          component: "JournalWrapper",
          path: "/journals/:id",
          helper: j => `/journals/${j}`,
          routes: [
            {
              name: "frontendJournalDetail",
              exact: true,
              component: "JournalDetail",
              path: "/journals/:id",
              helper: j => `/journals/${j}`
            },
            {
              name: "frontendJournalAllIssues",
              exact: true,
              component: "JournalIssuesList",
              path: "/journals/:id/issues",
              helper: j => `/journals/${j}/issues`
            },
            {
              name: "frontendJournalAllVolumes",
              exact: true,
              component: "JournalVolumesList",
              path: "/journals/:id/volumes",
              helper: j => `/journals/${j}/volumes`
            },
            {
              name: "frontendVolumeDetail",
              exact: true,
              component: "VolumeDetail",
              path: "/journals/:id/volumes/:volumeSlug",
              helper: (j, v) => `/journals/${j}/volumes/${v}`
            }
          ]
        }
      ]
    },
    {
      name: "frontendPublicReadingGroups",
      exact: false,
      component: "PublicReadingGroups",
      path: "/groups",
      helper: (params = {}) => {
        const query = queryString.stringify(params);
        const base = `/groups`;
        if (!query) return base;
        return `${base}?${query}`;
      },
      routes: [
        {
          name: "frontendPublicReadingGroupsList",
          exact: true,
          component: "PublicReadingGroupsList",
          path: "/groups",
          helper: (params = {}) => {
            const query = queryString.stringify(params);
            const base = `/groups`;
            if (!query) return base;
            return `${base}?${query}`;
          }
        },
        {
          name: "frontendReadingGroupDetail",
          exact: false,
          component: "ReadingGroup",
          path: "/groups/:id",
          helper: (rg, params = {}) => {
            const query = queryString.stringify(params);
            const base = `/groups/${rg}`;
            if (!query) return base;
            return `${base}?${query}`;
          },
          routes: [
            {
              name: "frontendReadingGroupAnnotations",
              exact: true,
              component: "ReadingGroupAnnotations",
              path: "/groups/:id/annotations",
              helper: (rg, params = {}) => {
                const query = queryString.stringify(params);
                const base = `/groups/${rg}/annotations`;
                if (!query) return base;
                return `${base}?${query}`;
              }
            },
            {
              name: "frontendReadingGroupMembers",
              exact: false,
              component: "ReadingGroupMembers",
              path: "/groups/:id/members",
              helper: rg => `/groups/${rg}/members`,
              routes: [
                {
                  exact: true,
                  component: "ReadingGroupMembersList",
                  path: "/groups/:id/members/:membershipId?",
                  routes: [
                    {
                      name: "frontendReadingGroupMember",
                      exact: true,
                      component: "ReadingGroupMemberEdit",
                      path: "/groups/:id/members/:membershipId",
                      helper: (rg, m) => `/groups/${rg}/members/${m}`
                    }
                  ]
                }
              ]
            },
            {
              exact: false,
              component: "ReadingGroupHomepage",
              path: "/groups/:id",
              routes: [
                {
                  exact: false,
                  component: "ReadingGroupHomepageFetch",
                  path: "/groups/:id",
                  routes: [
                    {
                      name: "frontendReadingGroupHomepageStatic",
                      exact: true,
                      component: "ReadingGroupHomepageStatic",
                      path: "/groups/:id",
                      helper: rg => `/groups/${rg}`
                    },
                    {
                      name: "frontendReadingGroupHomepageEdit",
                      exact: true,
                      component: "ReadingGroupHomepageEdit",
                      path: "/groups/:id/edit",
                      helper: rg => `/groups/${rg}/edit`
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
      name: "frontendMyReadingGroups",
      exact: false,
      component: "MyReadingGroups",
      path: "/my/groups",
      helper: (params = {}) => {
        const query = queryString.stringify(params);
        const base = `/my/groups`;
        if (!query) return base;
        return `${base}?${query}`;
      },
      routes: [
        {
          exact: true,
          component: "MyReadingGroupsList",
          path: "/my/groups/:new(new)?",
          routes: [
            {
              name: "frontendMyReadingGroupsNew",
              exact: true,
              path: "/my/groups/new",
              component: "MyReadingGroupsNew",
              helper: () => "/my/groups/new"
            }
          ]
        }
      ]
    },
    {
      name: "frontendStarred",
      exact: true,
      component: "MyStarred",
      path: "/my/starred",
      helper: () => "/my/starred"
    },
    {
      name: "frontendAnnotations",
      exact: true,
      component: "MyAnnotations",
      path: "/my/notes",
      helper: () => "/my/notes"
    },
    {
      name: "frontendSearch",
      exact: true,
      component: "Search",
      path: "/search",
      isLibrary: true,
      helper: () => `/search`
    },
    {
      name: "frontendLogin",
      exact: true,
      component: "Login",
      path: "/login",
      helper: () => `/login`
    },
    {
      name: "frontendSignUp",
      exact: true,
      component: "Login",
      path: "/signup",
      helper: () => `/signup`
    },
    {
      name: "frontendContact",
      exact: true,
      component: "Contact",
      path: "/contact",
      helper: () => "/contact"
    },
    {
      exact: true,
      component: "PasswordReset",
      path: "/reset-password/:resetToken"
    },
    {
      name: "frontendPage",
      exact: true,
      component: "Page",
      path: "/page/:slug",
      helper: p => `/page/${p}`
    },
    {
      name: "subscriptions",
      exact: true,
      component: "Subscriptions",
      path: "/subscriptions",
      helper: () => "/subscriptions"
    },
    {
      name: "privacy",
      exact: true,
      component: "PrivacySettings",
      path: "/privacy",
      helper: () => "/privacy"
    },
    {
      name: "dataUse",
      exact: true,
      component: "DataUse",
      path: "/data-use",
      helper: () => "/data-use"
    },
    {
      name: "unsubscribe",
      exact: true,
      component: "Unsubscribe",
      path: "/unsubscribe/:token",
      helper: token => `/unsubscribe/${token}`
    },
    {
      name: "api",
      exact: true,
      component: "ApiDocs",
      path: "/docs/api",
      helper: () => "/docs/api"
    },
    {
      name: "frontend",
      exact: true,
      component: "Home",
      isLibrary: true,
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
};

export default routes;

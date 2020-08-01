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
      name: "frontendReadingGroups",
      exact: false,
      component: "ReadingGroups",
      path: "/my/groups",
      helper: () => "/my/groups",
      routes: [
        {
          exact: true,
          component: "ReadingGroupsList",
          path: "/my/groups/:new(new)?",
          routes: [
            {
              name: "frontendReadingGroupsNew",
              exact: true,
              path: "/my/groups/new",
              component: "ReadingGroupsNew",
              helper: () => "/my/groups/new"
            }
          ]
        },
        {
          name: "frontendReadingGroupDetail",
          exact: false,
          component: "ReadingGroup",
          path: "/my/groups/:id",
          helper: (rg, params = {}) => {
            const query = queryString.stringify(params);
            const base = `/my/groups/${rg}`;
            if (!query) return base;
            return `${base}/?${query}`;
          },
          routes: [
            {
              name: "frontendReadingGroupMembers",
              exact: true,
              component: "ReadingGroupMembers",
              path: "/my/groups/:id/members",
              helper: rg => `/my/groups/${rg}/members`
            },
            {
              exact: false,
              component: "ReadingGroupDetail",
              path: "/my/groups/:id",
              routes: [
                {
                  name: "frontendReadingGroupEdit",
                  exact: true,
                  component: "ReadingGroupEdit",
                  path: "/my/groups/:id/edit",
                  helper: rg => `/my/groups/${rg}/edit`
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "frontendFollowing",
      exact: true,
      component: "Following",
      path: "/following",
      isLibrary: true,
      helper: () => "/following"
    },
    {
      name: "frontendFeatured",
      exact: true,
      component: "Featured",
      path: "/featured",
      isLibrary: true,
      helper: () => "/featured"
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
      component: "SignUp",
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

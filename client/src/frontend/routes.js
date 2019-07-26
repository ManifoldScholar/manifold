import queryString from "query-string";
import NotFound from "global/containers/NotFound";

const routes = {
  component: "Frontend",
  path: "/",
  routes: [
    {
      name: "frontendProjects",
      exact: false,
      component: "ProjectsWrapper",
      path: "/projects",
      helper: () => "/projects",
      routes: [
        {
          name: "frontendProjectsAll",
          exact: true,
          component: "Projects",
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
          component: "ProjectCollections",
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
          component: "ProjectCollectionDetail",
          path: "/projects/project-collection/:id",
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
      name: "groups",
      exact: false,
      component: "GroupsContainer",
      path: "/my/groups",
      helper: () => "/my/groups",
      routes: [
        {
          name: "group",
          exact: true,
          component: "GroupWrapper",
          path: "/my/groups/:groupId",
          helper: () => "/my/groups/:groupId",
          routes: [
            {
              name: "groupMembers",
              exact: true,
              component: "GroupMembersList",
              path: "/my/groups/:groupId/members",
              helper: () => "/my/groups/:groupId/members"
            },
            {
              name: "groupDetail",
              exact: true,
              component: "GroupDetail",
              path: "/my/groups/:groupId",
              helper: () => "/my/groups/:groupId"
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
      helper: () => "/following"
    },
    {
      name: "frontendFeatured",
      exact: true,
      component: "Featured",
      path: "/featured",
      helper: () => "/featured"
    },
    {
      name: "frontendSearch",
      exact: true,
      component: "Search",
      path: "/search",
      helper: () => `/search`
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
      name: "frontend",
      exact: true,
      component: "Home",
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

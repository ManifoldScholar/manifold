import * as Frontend from "containers/frontend";
import * as Reader from "containers/reader";
import queryString from "query-string";
import * as Backend from "containers/backend";

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
          component: Backend.Dashboard,
          path: "/backend"
        },
        {
          name: "backendProjectResourcesNew",
          exact: true,
          component: Backend.Resource.New,
          path: "/backend/project/:projectId/resources/new",
          helper: p => `/backend/project/${p}/resources/new`
        },
        {
          name: "backendProjectCollectionsNew",
          exact: true,
          component: Backend.Collection.New,
          path: "/backend/project/:projectId/collections/new",
          helper: p => `/backend/project/${p}/collections/new`
        },
        {
          name: "backendProjectsNew",
          exact: true,
          component: Backend.Project.New,
          path: "/backend/project/new",
          helper: () => "/backend/project/new"
        },
        {
          name: "backendProject",
          exact: false,
          component: Backend.Project.Wrapper,
          path: "/backend/project/:id",
          helper: p => `/backend/project/${p}`,
          routes: [
            {
              name: "backendProjectTexts",
              exact: false,
              component: Backend.Project.Texts,
              path: "/backend/project/:id/texts",
              helper: p => `/backend/project/${p}/texts`,
              routes: [
                {
                  name: "backendProjectTextsIngestionsNew",
                  exact: false,
                  component: Backend.Project.Text.Ingestion.New,
                  path: "/backend/project/:id/texts/ingestions/new",
                  helper: p => `/backend/project/${p}/texts/ingestions/new`,
                  modal: true
                },
                {
                  name: "backendProjectTextsIngestionEdit",
                  exact: false,
                  component: Backend.Project.Text.Ingestion.Edit,
                  path:
                    "/backend/project/:id/texts/ingestion/:ingestionId/edit",
                  helper: (p, i) =>
                    `/backend/project/${p}/texts/ingestion/${i}/edit`,
                  modal: true
                },
                {
                  name: "backendProjectTextsIngestionIngest",
                  exact: false,
                  component: Backend.Ingestion.Ingest,
                  path:
                    "/backend/project/:id/texts/ingestion/:ingestionId/ingest",
                  helper: (p, i) =>
                    `/backend/project/${p}/texts/ingestion/${i}/ingest`,
                  modal: true
                },
                {
                  exact: false,
                  component: Backend.Project.Category.Wrapper,
                  path: "/backend/project/:id/texts/category",
                  routes: [
                    {
                      name: "backendProjectCategoriesNew",
                      exact: true,
                      component: Backend.Project.Category.New,
                      path: "/backend/project/:id/texts/category/new",
                      helper: p => `/backend/project/${p}/texts/category/new`
                    },
                    {
                      name: "backendProjectCategory",
                      exact: true,
                      component: Backend.Project.Category.Edit,
                      path: "/backend/project/:id/texts/category/:catId/edit",
                      helper: (p, c) =>
                        `/backend/project/${p}/texts/category/${c}/edit`
                    }
                  ]
                }
              ]
            },
            {
              name: "backendProjectResources",
              exact: true,
              component: Backend.Project.Resources,
              path: "/backend/project/:id/resources",
              helper: p => `/backend/project/${p}/resources`
            },
            {
              name: "backendProjectCollections",
              exact: true,
              component: Backend.Project.Collections,
              path: "/backend/project/:id/collections",
              helper: p => `/backend/project/${p}/collections`
            },
            {
              name: "backendProjectCollaborators",
              component: Backend.Project.Collaborators,
              path: "/backend/project/:id/collaborators",
              helper: p => `/backend/project/${p}/collaborators`,
              routes: [
                {
                  name: "backendProjectCollaborator",
                  component: Backend.People.Makers.Edit,
                  path: "/backend/project/:pId/collaborators/:id",
                  helper: (pId, id) =>
                    `/backend/project/${pId}/collaborators/${id}`
                }
              ]
            },
            {
              name: "backendProjectEvents",
              exact: true,
              component: Backend.Project.Events,
              path: "/backend/project/:id/events",
              helper: p => `/backend/project/${p}/events`
            },
            {
              name: "backendProjectMetadata",
              exact: true,
              component: Backend.Project.Metadata,
              path: "/backend/project/:id/metadata",
              helper: p => `/backend/project/${p}/metadata`
            },
            {
              name: "backendProjectSocial",
              exact: false,
              component: Backend.Project.Social.Wrapper,
              path: "/backend/project/:pId/social/:type(twitter-query)?/:qId?",
              helper: p => `/backend/project/${p}/social`,
              routes: [
                {
                  name: "backendProjectSocialTwitterQueryNew",
                  component: Backend.TwitterQuery.New,
                  path: "/backend/project/:pId/social/twitter-query/new",
                  helper: pId =>
                    `/backend/project/${pId}/social/twitter-query/new`
                },
                {
                  name: "backendProjectSocialTwitterQuery",
                  component: Backend.TwitterQuery.Edit,
                  path: "/backend/project/:pId/social/twitter-query/:id",
                  helper: (pId, id) =>
                    `/backend/project/${pId}/social/twitter-query/${id}`
                }
              ]
            },
            {
              name: "backendProjectProjectPage",
              exact: true,
              component: Backend.Project.ProjectPage,
              path: "/backend/project/:id/project-page",
              helper: p => `/backend/project/${p}/project-page`
            },
            {
              exact: true,
              component: Backend.Project.General,
              path: "/backend/project/:id"
            }
          ]
        },
        {
          name: "backendContentPage",
          component: Backend.Content.Pages.Detail,
          path: "/backend/content/pages/:id",
          exact: false,
          helper: p => `/backend/content/pages/${p}`,
          routes: [
            {
              name: "backendContentPageNew",
              component: Backend.Content.Pages.New,
              path: "/backend/content/pages/new",
              helper: () => `/backend/content/pages/new`
            },
            {
              name: "backendContentPageBody",
              component: Backend.Content.Pages.Body,
              path: "/backend/content/pages/:id/body",
              helper: p => `/backend/content/pages/${p}/body`
            },
            {
              name: "backendContentPageGeneral",
              component: Backend.Content.Pages.General,
              path: "/backend/content/pages/:id",
              helper: p => `/backend/content/pages/${p}`
            }
          ]
        },
        {
          name: "backendContentFeature",
          component: Backend.Content.Features.Detail,
          path: "/backend/content/features/:id",
          exact: false,
          helper: f => `/backend/content/features/${f}`,
          routes: [
            {
              name: "backendContentFeatureNew",
              component: Backend.Content.Features.New,
              path: "/backend/content/features/new",
              helper: () => `/backend/content/features/new`
            },
            {
              name: "backendContentFeatureGeneral",
              component: Backend.Content.Features.General,
              path: "/backend/content/features/:id",
              helper: p => `/backend/content/features/${p}`
            }
          ]
        },
        {
          name: "backendContent",
          exact: false,
          component: Backend.Content.Wrapper,
          path: "/backend/content",
          helper: () => "/backend/content",
          routes: [
            {
              name: "backendContentPages",
              component: Backend.Content.Pages.List,
              path: "/backend/content",
              exact: true,
              helper: () => `/backend/content`
            },
            {
              name: "backendContentFeatures",
              component: Backend.Content.Features.List,
              exact: true,
              path: "/backend/content/features",
              helper: () => `/backend/content/features`
            }
          ]
        },
        {
          name: "backendContentFeaturesNew",
          component: Backend.Content.Features.New,
          path: "/backend/features/new",
          helper: () => `/backend/features/new`
        },
        {
          name: "backendContentFeaturesEdit",
          component: Backend.Content.Features.Edit,
          path: "/backend/features/:id",
          helper: f => `/backend/features/${f}`
        },
        {
          name: "backendPeople",
          exact: false,
          component: Backend.People.Wrapper,
          path: "/backend/people",
          helper: () => "/backend/people",
          routes: [
            {
              name: "backendPeopleMakers",
              component: Backend.People.Makers.List,
              path: "/backend/people/makers/:id?",
              helper: () => `/backend/people/makers`,
              routes: [
                {
                  name: "backendPeopleMaker",
                  component: Backend.People.Makers.Edit,
                  exact: true,
                  path: "/backend/people/makers/:id",
                  helper: m => `/backend/people/makers/${m}`
                }
              ]
            },
            {
              name: "backendPeopleUsers",
              exact: false,
              component: Backend.People.Users.List,
              path: "/backend/people/:users(users)?/:id?",
              helper: () => "/backend/people/users",
              routes: [
                {
                  name: "backendPeopleUsersNew",
                  exact: true,
                  component: Backend.People.Users.New,
                  path: "/backend/people/users/new",
                  helper: () => "/backend/people/users/new"
                },
                {
                  name: "backendPeopleUser",
                  component: Backend.People.Users.Edit,
                  path: "/backend/people/users/:id",
                  helper: u => `/backend/people/users/${u}`
                }
              ]
            }
          ]
        },
        {
          exact: false,
          component: Backend.Text.Wrapper,
          path: "/backend/text/:id",
          routes: [
            {
              name: "backendTextStyles",
              component: Backend.Text.Styles,
              exact: true,
              path: "/backend/text/:id/styles",
              helper: t => `/backend/text/${t}/styles`
            },
            {
              name: "BackendTextStylesheetNew",
              component: Backend.Stylesheet.Edit,
              exact: true,
              path: "/backend/text/:id/styles/new",
              helper: t => `/backend/text/${t}/styles/new`
            },
            {
              name: "BackendTextStylesheetEdit",
              component: Backend.Stylesheet.Edit,
              exact: true,
              path: "/backend/text/:id/styles/:stylesheet",
              helper: (t, ss) => `/backend/text/${t}/styles/${ss}`
            },
            {
              name: "backendTextMetadata",
              exact: true,
              component: Backend.Text.Metadata,
              path: "/backend/text/:id/metadata",
              helper: t => `/backend/text/${t}/metadata`
            },
            {
              name: "backendTextCollaborators",
              exact: false,
              component: Backend.Text.Collaborators,
              path: "/backend/text/:id/collaborators",
              helper: t => `/backend/text/${t}/collaborators`,
              routes: [
                {
                  name: "backendTextCollaborator",
                  component: Backend.People.Makers.Edit,
                  path: "/backend/text/:tId/collaborators/:id",
                  helper: (tId, id) =>
                    `/backend/text/${tId}/collaborators/${id}`
                }
              ]
            },
            {
              name: "backendTextIngestionsNew",
              exact: true,
              component: Backend.Text.Ingestion.New,
              path: "/backend/text/:id/ingestions/new",
              helper: t => `/backend/text/${t}/ingestions/new`,
              modal: false
            },
            {
              name: "backendTextIngestionEdit",
              exact: false,
              component: Backend.Text.Ingestion.Edit,
              path: "/backend/text/:id/ingestion/:ingestionId/edit",
              helper: (t, i) => `/backend/text/${t}/ingestion/${i}/edit`,
              modal: false
            },
            {
              name: "backendTextIngestionIngest",
              exact: false,
              component: Backend.Ingestion.Ingest,
              path: "/backend/text/:id/ingestion/:ingestionId/ingest",
              helper: (t, i) => `/backend/text/${t}/ingestion/${i}/ingest`,
              modal: false
            },
            {
              name: "backendText",
              exact: true,
              component: Backend.Text.General,
              path: "/backend/text/:id",
              helper: t => `/backend/text/${t}`
            }
          ]
        },
        {
          exact: false,
          component: Backend.Resource.Wrapper,
          path: "/backend/resource/:id",
          routes: [
            {
              name: "backendResourceVariants",
              exact: true,
              component: Backend.Resource.Variants,
              path: "/backend/resource/:id/variants",
              helper: r => `/backend/resource/${r}/variants`
            },
            {
              name: "backendResourceMetadata",
              exact: true,
              component: Backend.Resource.Metadata,
              path: "/backend/resource/:id/metadata",
              helper: r => `/backend/resource/${r}/metadata`
            },
            {
              name: "backendResource",
              exact: true,
              component: Backend.Resource.General,
              path: "/backend/resource/:id",
              helper: r => `/backend/resource/${r}`
            }
          ]
        },
        {
          exact: false,
          component: Backend.Collection.Wrapper,
          path: "/backend/collection/:id",
          routes: [
            {
              name: "backendCollection",
              exact: true,
              component: Backend.Collection.General,
              path: "/backend/collection/:id",
              helper: r => `/backend/collection/${r}`
            },
            {
              name: "backendCollectionResources",
              exact: true,
              component: Backend.Collection.Resources,
              path: "/backend/collection/:id/resources",
              helper: r => `/backend/collection/${r}/resources`
            }
          ]
        },
        {
          name: "backendSettingsSubjectsNew",
          exact: true,
          component: Backend.Settings.Subjects.New,
          path: "/backend/settings/subjects/new",
          helper: () => "/backend/settings/subjects/new"
        },
        {
          exact: false,
          component: Backend.Settings.Wrapper,
          path: "/backend/settings",
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
              name: "backendSettings",
              exact: true,
              component: Backend.Settings.General,
              path: "/backend/settings",
              helper: () => "/backend/settings"
            }
          ]
        },
        {
          component: Frontend.NotFound
        }
      ]
    },
    {
      component: Frontend.Frontend,
      path: "/",
      routes: [
        {
          name: "frontendProject",
          exact: true,
          component: Frontend.ProjectDetail,
          path: "/project/:id",
          helper: p => `/project/${p}`
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
          exact: true,
          component: Frontend.PasswordReset,
          path: "/reset-password/:resetToken"
        },
        {
          name: "frontendProjectEvents",
          exact: true,
          component: Frontend.EventList,
          path: "/project/:id/events/:page?",
          helpers: {
            frontendProjectEvents: p => `/project/${p}/events`,
            frontendProjectEventsPage: (pr, pg) => `/project/${pr}/events/${pg}`
          }
        },
        {
          name: "frontendPage",
          exact: true,
          component: Frontend.Page,
          path: "/page/:slug",
          helper: p => `/page/${p}`
        },
        {
          name: "frontendProjectCollection",
          exact: true,
          component: Frontend.CollectionDetail,
          path: "/project/:id/collection/:collectionId",
          helpers: {
            frontendProjectCollection: (p, c) =>
              `/project/${p}/collection/${c}`,
            frontendProjectCollectionRelative: c => `collection/${c}`
          }
        },
        {
          name: "frontendProjectResources",
          exact: true,
          component: Frontend.ProjectResources,
          path: "/project/:id/resources/:page?",
          helper: (p, pg = null) =>
            `/project/${p}/resources${pg ? `/${pg}` : ""}`
        },
        {
          name: "frontendProjectCollectionResource",
          exact: true,
          component: Frontend.ResourceDetail,
          path: "/project/:id/collection/:collectionId/resource/:resourceId",
          helper: (p, c, r) => `/project/${p}/collection/${c}/resource/${r}`
        },
        {
          name: "frontendProjectResource",
          exact: true,
          component: Frontend.ResourceDetail,
          path: "/project/:id/resource/:resourceId",
          helpers: {
            frontendProjectResource: (p, r) => `/project/${p}/resource/${r}`,
            frontendProjectResourceRelative: r => `resource/${r}`
          }
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
          component: Frontend.NotFound
        }
      ]
    },
    {
      component: Frontend.NotFound
    }
  ];
};
/* eslint-enable max-len */

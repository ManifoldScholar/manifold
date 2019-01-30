const routes = {
  name: "reader",
  component: "Reader",
  exact: false,
  path: "/read/:textId/:ignore(section|search)?/:sectionId?",
  helper: t => `/read/${t}`,
  routes: [
    {
      name: "readerSearchResults",
      exact: true,
      component: "Search",
      path: "/read/:textId/search",
      helper: t => `/read/${t}/search`
    },
    {
      name: "readerSection",
      exact: false,
      component: "Section",
      path: "/read/:textId/section/:sectionId",
      helper: (t, s, anchor = "") => `/read/${t}/section/${s}${anchor}`,
      routes: [
        {
          name: "readerSectionResource",
          exact: true,
          component: "NotationResourceDetail",
          path: "/read/:textId/section/:sectionId/resource/:resourceId",
          helper: (t, s, r) => `/read/${t}/section/${s}/resource/${r}`
        },
        {
          name: "readerSectionResourceCollection",
          exact: true,
          component: "NotationResourceCollectionDetail",
          path:
            "/read/:textId/section/:sectionId/resource-collection/:resourceCollectionId",
          helper: (t, s, c) =>
            `/read/${t}/section/${s}/resource-collection/${c}`
        },
        {
          name: "readerSectionSearchResults",
          exact: true,
          component: "Search",
          transition: "overlay-full",
          path: "/read/:textId/section/:sectionId/search",
          helper: (t, ts) => `/read/${t}/section/${ts}/search`
        }
      ]
    }
  ]
};

export default routes;

import Reader from "reader/containers/Reader";
import StartSectionRedirect from "reader/containers/Reader/StartSectionRedirect";
import Section from "reader/containers/Section";
import Search from "reader/containers/Search";

const routes = [
  {
    element: <Reader />,
    path: "/read/:textId",
    handle: {
      name: "reader",
      helper: t => `/read/${t}`
    },
    children: [
      {
        index: true,
        element: <StartSectionRedirect />
      },
      {
        element: <Search />,
        path: "search",
        handle: {
          name: "readerSearchResults",
          helper: t => `/read/${t}/search`
        }
      },
      {
        element: <Section />,
        path: "section/:sectionId",
        handle: {
          name: "readerSection",
          helper: (t, s, anchor = "") => `/read/${t}/section/${s}${anchor}`
        },
        children: [
          {
            element: <Search />,
            path: "search",
            handle: {
              name: "readerSectionSearchResults",
              helper: (t, ts) => `/read/${t}/section/${ts}/search`
            }
          }
        ]
      }
    ]
  }
];

export default routes;

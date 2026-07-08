import Layout from "lti/containers/Layout";
import Landing from "lti/containers/Landing";
import Search from "lti/containers/Search";
import ProjectDetail from "lti/containers/ProjectDetail";
import ResourceCollectionDetail from "lti/containers/ResourceCollectionDetail";
import TextDetail from "lti/containers/TextDetail";
import { DeepLinkingProvider } from "lti/contexts";

const routes = [
  {
    element: (
      <DeepLinkingProvider>
        <Layout />
      </DeepLinkingProvider>
    ),
    path: "lti/deep_linking",
    handle: { name: "lti" },
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        element: <Search />,
        path: "search"
      },
      {
        element: <ProjectDetail />,
        path: "projects/:id"
      },
      {
        element: <ResourceCollectionDetail />,
        path: "resource-collections/:id"
      },
      {
        element: <TextDetail />,
        path: "texts/:id"
      }
    ]
  }
];

export default routes;

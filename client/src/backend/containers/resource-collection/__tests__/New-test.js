import { ResourceCollectionNewContainer } from "../New";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/resource-collection/New", () => {
  def("project", () => factory("project"));
  def("root", () => <BreadcrumbsProvider><ResourceCollectionNewContainer project={$project} t={key => key} /></BreadcrumbsProvider>);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

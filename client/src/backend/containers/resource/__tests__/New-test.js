import { ResourceNewContainer } from "../New";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/resource/New", () => {
  def("project", () => factory("project"));
  def("root", () => <BreadcrumbsProvider><ResourceNewContainer project={$project} t={key => key} /></BreadcrumbsProvider>);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

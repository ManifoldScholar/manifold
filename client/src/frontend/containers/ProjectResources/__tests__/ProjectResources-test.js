import ProjectResourcesContainer from "../";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("frontend/containers/ProjectResources/ProjectResources", () => {
  def("project", () => factory("project"));
  def("root", () => (
    <BreadcrumbsProvider>
      <ProjectResourcesContainer project={$project} />
    </BreadcrumbsProvider>
  ));
  it("matches the snapshot", () => {
    expect(mount($withApp($root))).toMatchSnapshot();
  });
});

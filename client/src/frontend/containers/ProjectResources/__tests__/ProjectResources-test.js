import ProjectResourcesContainer from "../";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";
import useSetLocation from "hooks/useSetLocation";

jest.mock("hooks/useSetLocation", () => () => null);

describe("frontend/containers/ProjectResources/ProjectResources", () => {
  def("project", () => factory("project"));
  def("root", () => (
    <BreadcrumbsProvider>
      <ProjectResourcesContainer
        project={$project}
      />
    </BreadcrumbsProvider>
  ));
  it("matches the snapshot", () => {
    expect(mount($withApp($root))).toMatchSnapshot();
  });
});

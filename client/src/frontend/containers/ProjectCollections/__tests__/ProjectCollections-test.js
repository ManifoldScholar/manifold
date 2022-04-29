import ProjectsCollectionsContainer from "../";
import useSetLocation from "hooks/useSetLocation";

jest.mock("hooks/useSetLocation", () => () => null);

describe("frontend/containers/ProjectCollections/ProjectCollections", () => {
  def("root", () => (
    <ProjectsCollectionsContainer
    />
  ));
  it("matches the snapshot", () => {
    expect(mount($withApp($root))).toMatchSnapshot();
  });
});

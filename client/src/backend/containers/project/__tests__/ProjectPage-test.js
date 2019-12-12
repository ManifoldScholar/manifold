import ProjectProjectPageContainer from "../ProjectPage";
import { project, route } from "./__fixtures__";

describe("backend/containers/project/ProjectPage", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });

  def("abilities", () => ({ update: true }));
  def("user", () => factory("user"));
  def("project", () => project($abilities));
  def("root", () => <ProjectProjectPageContainer project={$project} />);

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(mount($withApp($root)).html()).not.toBeNull();
  });
});

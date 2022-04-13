import ProjectResourcesContainer from "../Resources";
import { project } from "./__fixtures__";

describe("backend/containers/project/Resources", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });

  def("abilities", () => ({ manageResources: true }));
  def("user", () => factory("user"));
  def("project", () => project($abilities));
  def("root", () => (
    <ProjectResourcesContainer project={$project} dispatch={$dispatch} t={key => key} />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});

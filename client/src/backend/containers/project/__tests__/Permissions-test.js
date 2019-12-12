import ProjectPermissionsContainer from "../Permissions";
import { project, route } from "./__fixtures__";
import ProjectGeneralContainer from "../General";

describe("backend/containers/project/Permissions", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });

  def("abilities", () => ({ managePermissions: true }));
  def("user", () => factory("user"));
  def("project", () => project($abilities));
  def("route", () => route());

  def("root", () => (
    <ProjectPermissionsContainer project={$project} route={$route} />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(shallow($withApp($root)).html()).not.toBeNull();
  });
});

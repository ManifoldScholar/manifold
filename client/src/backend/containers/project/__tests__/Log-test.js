import { LogContainer } from "../Log";
import { project } from "./__fixtures__";

describe("backend/containers/project/Log", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });
  def("abilities", () => ({ readLog: true }));
  def("user", () => factory("user"));
  def("project", () => project($abilities));
  def("version", () => factory("version"));
  def("versions", () => [$version]);
  def("pagination", () => fixtures.pagination());

  def("root", () => (
    <LogContainer
      project={$project}
      dispatch={$dispatch}
      versions={$versions}
      versionsMeta={{ pagination: $pagination }}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(shallow($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(shallow($withApp($root)).html()).not.toBeNull();
  });
});

import { ProjectWrapperContainer } from "../Wrapper";
import { project, route } from "./__fixtures__";

describe("backend/containers/project/Wrapper", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });

  def("abilities", () => ({ update: true }));
  def("user", () => factory("user"));
  def("project", () => project($abilities));
  def("route", () => route());
  def("match", () => ({
    params: {}
  }));
  def("root", () => (
    <ProjectWrapperContainer
      project={$project}
      dispatch={$dispatch}
      location={{ pathname: "/projects/1" }}
      route={$route}
      match={$match}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});

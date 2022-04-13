import { ProjectCollaboratorsContainer } from "../Collaborators";
import { project, route } from "./__fixtures__";

describe("backend/containers/project/Collaborators", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });

  def("user", () => factory("user"));
  def("project", () => project($abilities));
  def("route", () => route());
  def("refresh", () => jest.fn());

  def("root", () => (
    <ProjectCollaboratorsContainer
      project={$project}
      route={$route}
      history={{}}
      refresh={$refresh}
      t={key => key}
    />
  ));

  describe("when the user can manage makers", () => {
    def("abilities", () => ({
      updateMakers: true
    }));

    it("matches the snapshot when rendered", () => {
      expect(render($withApp($root)).html()).toMatchSnapshot();
    });
    it("does not render a null value", () => {
      expect(render($withApp($root)).html()).not.toBeNull();
    });
  });

  describe("when the user cannot manage makers", () => {
    def("abilities", () => ({
      updateMakers: false
    }));

    it("renders a null value", () => {
      expect(render($withApp($root)).html()).toBe("");
    });
  });
});

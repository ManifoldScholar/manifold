import { ProjectTextsContainer } from "../Texts";
import { project, route } from "./__fixtures__";

describe("backend/containers/project/Texts", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });

  def("abilities", () => ({ manageTexts: true }));
  def("user", () => factory("user"));
  def("project", () => project($abilities));
  def("route", () => route());
  def("root", () => (
    <ProjectTextsContainer project={$project} route={$route} t={key => key} />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});

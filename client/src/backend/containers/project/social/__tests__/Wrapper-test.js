import ProjectSocialWrapperContainer from "../Wrapper";

describe("backend/containers/project/social/Wrapper", () => {
  def("project", () => factory("project"));
  def("route", () => fixtures.route());
  def("root", () => (
    <ProjectSocialWrapperContainer route={$route} project={$project} />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

import { ResourceWrapperContainer } from "../Wrapper";

describe("backend/containers/resource/Wrapper", () => {
  def("project", () => factory("project"));
  def("resource", () =>
    factory("resource", { relationships: { project: $project } })
  );

  def("root", () => (
    <ResourceWrapperContainer
      resource={$resource}
      route={fixtures.route()}
      match={{ params: {} }}
      dispatch={$dispatch}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

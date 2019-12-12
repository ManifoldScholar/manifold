import { ResourceCollectionWrapperContainer } from "../Wrapper";

describe("backend/containers/resource-collection/Wrapper", () => {
  def("project", () => factory("project"));
  def("resourceCollection", () =>
    factory("resourceCollection", { relationships: { project: $project } })
  );
  def("root", () => (
    <ResourceCollectionWrapperContainer
      resourceCollection={$resourceCollection}
      route={fixtures.route()}
      match={{ params: {} }}
      dispatch={$dispatch}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

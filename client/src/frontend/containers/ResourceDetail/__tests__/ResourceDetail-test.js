import { ResourceDetailContainer } from "../";

describe("frontend/containers/ResourceDetail/ResourceDetail", () => {
  def("settings", () => factory("settings"));
  def("project", () => factory("project"));
  def("resource", () => factory("resource"));

  def("root", () => (
    <ResourceDetailContainer
      settings={$settings}
      dispatch={$dispatch}
      project={$project}
      resource={$resource}
      t={key => key}
      location={{pathname: '/projects/test/resource'}}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

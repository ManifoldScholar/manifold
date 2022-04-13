import { ResourceCollectionNewContainer } from "../New";

describe("backend/containers/resource-collection/New", () => {
  def("project", () => factory("project"));
  def("root", () => <ResourceCollectionNewContainer project={$project} t={key => key} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

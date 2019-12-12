import { ResourceNewContainer } from "../New";

describe("backend/containers/resource/New", () => {
  def("project", () => factory("project"));
  def("root", () => <ResourceNewContainer project={$project} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

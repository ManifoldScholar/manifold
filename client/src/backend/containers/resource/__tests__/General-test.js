import { ResourceGeneralContainer } from "../General";

describe("backend/containers/resource/General", () => {
  def("resource", () => factory("resource"));
  def("root", () => <ResourceGeneralContainer resource={$resource} />);

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});

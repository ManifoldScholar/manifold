import { ResourcePropertiesContainer } from "../Properties";

describe("backend/containers/resource/Properties", () => {
  def("resource", () => factory("resource"));
  def("root", () => <ResourcePropertiesContainer resource={$resource} t={key => key} />);

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});

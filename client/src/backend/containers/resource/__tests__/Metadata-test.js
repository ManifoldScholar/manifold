import ResourceMetadataContainer from "../Metadata";

describe("backend/containers/resource/Metadata", () => {
  def("resource", () => factory("resource"));
  def("root", () => <ResourceMetadataContainer resource={$resource} />);

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});

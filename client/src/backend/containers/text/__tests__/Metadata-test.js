import TextMetadataContainer from "../Metadata";

describe("backend/containers/text/Metadata", () => {
  def("text", () => factory("text"));
  def("root", () => <TextMetadataContainer text={$text} />);

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});

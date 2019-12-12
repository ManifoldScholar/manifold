import Item from "../Item";

describe("global/components/meta/Item", () => {
  def("root", () => (
    <Item label="aMetadataProperty" value="A Metadata Value" />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  context("when passed a child component", () => {
    def("root", () => (
      <Item label="aMetadataProperty">
        <div>A Metadata Value</div>
      </Item>
    ));
    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });
});

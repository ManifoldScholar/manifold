import TextArea from "../TextArea";

describe("global/components/form/TextArea", () => {
  def("mock", () => jest.fn());
  def("root", () => (
    <TextArea onChange={$mock} label="Label this" name="attributes[fake]" />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

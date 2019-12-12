import MaskedTextInput from "../MaskedTextInput";

describe("global/components/form/MaskedTestInput", () => {
  def("mock", () => jest.fn());
  def("root", () => (
    <MaskedTextInput
      mask={[/\d/, /\d/, /\d/, /\d/]}
      placeholder="Hold my place"
      onChange={$mock}
      label="Label this"
      value="attributes[fake]"
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

import NumberInput from "../NumberInput";

describe("global/components/form/NumberInput", () => {
  def("mock", () => jest.fn());
  def("root", () => (
    <NumberInput
      label="A form label"
      name="attributes[property]"
      onChange={$mock}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

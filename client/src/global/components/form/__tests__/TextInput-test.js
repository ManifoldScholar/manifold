import TextInput from "../TextInput";

describe("global/components/form/TextInput", () => {
  def("change", () => jest.fn());
  def("root", () => (
    <TextInput
      label="A form label"
      name="attributes[property]"
      mask="hashtag"
      onChange={$change}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

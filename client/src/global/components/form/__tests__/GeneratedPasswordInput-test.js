import GeneratedPasswordInput from "../GeneratedPasswordInput";

describe("global/components/form/GeneratedPasswordInput", () => {
  def("root", () => (
    <GeneratedPasswordInput
      value="attributes[password]"
      name="attributes[password]"
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

import SwitchArray from "../SwitchArray";

describe("global/components/form/SwitchArray", () => {
  def("root", () => (
    <SwitchArray
      label="Label this"
      name="attributes[fake]"
      options={[
        { label: "Option one", value: "1" },
        { label: "Option two", value: "2" }
      ]}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

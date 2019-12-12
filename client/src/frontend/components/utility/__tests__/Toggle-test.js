import Toggle from "../Toggle";

describe("frontend/components/utility/Toggle", () => {
  def("toggle", () => jest.fn());
  def("root", () => (
    <Toggle
      handleToggle={$toggle}
      label="options"
      optionOne={{
        icon: "resource24",
        label: "resources"
      }}
      optionTwo={{
        icon: "resourceCollection64",
        label: "collection"
      }}
      selected="resources"
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

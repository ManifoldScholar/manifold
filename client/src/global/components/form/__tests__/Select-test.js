import Select from "../Select";

describe("global/components/form/Select", () => {
  def("options", () => [
    {
      label: "option-1",
      value: "1"
    },
    {
      label: "option-2",
      value: "2"
    }
  ]);
  def("mock", () => jest.fn());
  def("root", () => (
    <Select
      options={$options}
      label="Label this"
      name="attributes[fake]"
      onChange={$mock}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

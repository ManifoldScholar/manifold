import Radios from "../Radios";

describe("global/components/form/Radios", () => {
  def("options", () => [
    {
      label: "option-1",
      instructions: "What does this option really mean?",
      value: "1"
    },
    {
      label: "option-2",
      value: "2"
    }
  ]);
  def("root", () => (
    <Radios
      options={$options}
      label="Label this"
      prompt="Pick the right choice"
      name="attributes[fake]"
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

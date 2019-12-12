import Switch from "../Switch";

describe("global/components/form/Switch", () => {
  def("root", () => <Switch label="Label this" name="attributes[fake]" />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

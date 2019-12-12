import Save from "../Save";

describe("global/components/form/Save", () => {
  def("root", () => <Save text="Save" cancelRoute="cancel/this" />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

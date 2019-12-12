import Dropdown from "../";

describe("global/components/Dropdown", () => {
  def("triggerComponent", () => () => <div>Render me</div>);
  def("bodyComponent", () => () => <div>Me too</div>);

  def("root", () => (
    <Dropdown
      triggerComponent={$triggerComponent}
      bodyComponent={$bodyComponent}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

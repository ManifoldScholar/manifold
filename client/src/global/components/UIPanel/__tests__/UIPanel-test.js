import UIPanel from "../";

describe("global/components/UIPanel", () => {
  def("bodyComponentMock", () => () => <div>Render me</div>);
  def("root", () => (
    <UIPanel
      id="show"
      visibility={{
        show: true
      }}
      bodyComponent={$bodyComponentMock}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

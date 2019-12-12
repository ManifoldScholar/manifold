import StylesheetEditContainer from "../Edit";

describe("backend/containers/stylesheet/Edit", () => {
  def("stylesheet", () => factory("stylesheet"));
  def("root", () => <StylesheetEditContainer stylesheet={$stylesheet} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

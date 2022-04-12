import { MakersEditContainer } from "../Edit";

describe("backend/containers/makers/Edit", () => {
  def("maker", () => factory("maker"));
  def("root", () => (
    <MakersEditContainer
      maker={$maker}
      dispatch={$dispatch}
      match={{
        params: {}
      }}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});

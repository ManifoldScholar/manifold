import { MakersNewContainer } from "../New";

describe("backend/containers/makers/New", () => {
  def("history", () => fixtures.history());
  def("root", () => (
    <MakersNewContainer dispatch={$dispatch} history={$history} t={key => key} />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});

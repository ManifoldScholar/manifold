import { ExportTargetsNewContainer } from "../New";

describe("backend/containers/Records/export-targets/New", () => {
  def("root", () => (
    <ExportTargetsNewContainer history={fixtures.history()} t={key => key} />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});

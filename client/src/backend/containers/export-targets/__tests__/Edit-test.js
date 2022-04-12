import { ExportTargetsEditContainer } from "../Edit";

describe("backend/containers/Records/export-targets/Edit", () => {
  def("exportTarget", () => factory("exportTarget"));
  def("root", () => (
    <ExportTargetsEditContainer
      exportTarget={$exportTarget}
      dispatch={$dispatch}
      match={{ params: {} }}
      confirm={() => null}
      history={$history}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});

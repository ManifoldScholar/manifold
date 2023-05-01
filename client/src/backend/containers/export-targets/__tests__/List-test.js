import { ExportTargetsContainerImplementation } from "../List";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/Records/export-targets/List", () => {
  def("exportTargets", () => collectionFactory("exportTarget"));
  def("root", () => (
    <BreadcrumbsProvider>
      <ExportTargetsContainerImplementation
        exportTargets={$exportTargets}
        exportTargetsMeta={{ pagination: fixtures.pagination() }}
        match={{ params: {} }}
        route={fixtures.route()}
        dispatch={$dispatch}
        t={key => key}
      />
    </BreadcrumbsProvider>
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});

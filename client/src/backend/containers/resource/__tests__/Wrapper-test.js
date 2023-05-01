import { ResourceWrapperContainer } from "../Wrapper";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/resource/Wrapper", () => {
  def("project", () => factory("project"));
  def("resource", () =>
    factory("resource", { relationships: { project: $project } })
  );

  def("root", () => (
    <BreadcrumbsProvider>
      <ResourceWrapperContainer
        resource={$resource}
        route={fixtures.route()}
        match={{ params: {} }}
        dispatch={$dispatch}
        t={key => key}
      />
    </BreadcrumbsProvider>
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

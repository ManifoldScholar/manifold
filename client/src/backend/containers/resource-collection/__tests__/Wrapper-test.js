import { ResourceCollectionWrapperContainer } from "../Wrapper";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/resource-collection/Wrapper", () => {
  def("project", () => factory("project"));
  def("resourceCollection", () =>
    factory("resourceCollection", { relationships: { project: $project } })
  );
  def("root", () => (
    <BreadcrumbsProvider>
      <ResourceCollectionWrapperContainer
        resourceCollection={$resourceCollection}
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

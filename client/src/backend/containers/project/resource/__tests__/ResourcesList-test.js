import { ProjectResourcesListContainer } from "../ResourcesList";

describe("backend/containers/project/resource/ResourcesList", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });

  def("abilities", () => ({ managePermissions: true }));
  def("user", () => factory("user"));
  def("pagination", () => fixtures.pagination());
  def("project", () => factory("project"));
  def("resources", () => [
    factory("resource", { id: "resource-1" }),
    factory("resource", { id: "resource-2" })
  ]);
  def("root", () => (
    <ProjectResourcesListContainer
      project={$project}
      resources={$resources}
      resourcesMeta={{
        pagination: $pagination
      }}
      dispatch={$dispatch}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});

import { PermissionContainer } from "../List";

describe("backend/containers/permission/List", () => {
  def("project", () => factory("project"));
  def("user", () => factory("user"));
  def("permission", () =>
    factory("permission", {
      id: "permission-id",
      relationships: { resource: $project, user: $user }
    })
  );
  def("permissions", () => {
    const permissions = [$permission];
    $project.relationships.permissions = permissions;
    return permissions;
  });
  def("match", () => ({ params: { id: "permission-id" } }));
  def("root", () => (
    <PermissionContainer
      entity={$project}
      dispatch={$dispatch}
      permissions={$permissions}
      project={$project}
      match={$match}
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

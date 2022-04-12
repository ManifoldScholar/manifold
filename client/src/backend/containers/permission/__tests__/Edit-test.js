import { PermissionEdit } from "../Edit";

describe("backend/containers/permission/Edit", () => {
  def("project", () => factory("project"));
  def("user", () => factory("user"));
  def("permission", () =>
    factory("permission", {
      relationships: { resource: $project, user: $user }
    })
  );

  def("root", () => {
    return (
      <PermissionEdit
        entity={$project}
        permission={$permission}
        closeUrl={"http://www.dailyrowan.com"}
        t={key => key}
      />
    );
  });

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});

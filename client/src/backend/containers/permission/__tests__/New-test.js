import PermissionNew from "../New";

describe("backend/containers/permission/New", () => {
  def("project", () => factory("project"));
  def("root", () => <PermissionNew entity={$project} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

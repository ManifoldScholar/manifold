import { PermissionForm } from "../Form";

describe("backend/containers/permission/Form", () => {
  def("project", () => factory("project"));
  def("history", () => fixtures.history());
  def("root", () => (
    <PermissionForm
      entity={$project}
      history={$history}
      successUrl="http://www.dailyrowan.com"
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});

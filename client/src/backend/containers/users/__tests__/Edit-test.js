import { UsersEditContainer } from "../Edit";

describe("backend/containers/users/Edit", () => {
  def("user", () => factory("user"));
  def("root", () => (
    <UsersEditContainer
      user={$user}
      dispatch={$dispatch}
      match={{ params: {} }}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

import { UsersListContainer } from "../List";

describe("backend/containers/users/List", () => {
  def("users", () => collectionFactory("user"));
  def("root", () => (
    <UsersListContainer
      dispatch={$dispatch}
      users={$users}
      usersMeta={{ pagination: fixtures.pagination() }}
      match={{ params: {} }}
      route={fixtures.route()}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});

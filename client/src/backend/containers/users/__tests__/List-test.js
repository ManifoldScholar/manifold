import { UsersListContainer } from "../List";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/users/List", () => {
  def("users", () => collectionFactory("user"));
  def("root", () => (
    <BreadcrumbsProvider>
      <UsersListContainer
        dispatch={$dispatch}
        users={$users}
        usersMeta={{ pagination: fixtures.pagination() }}
        match={{ params: {} }}
        route={fixtures.route()}
        t={key => key}
      />
    </BreadcrumbsProvider>
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});

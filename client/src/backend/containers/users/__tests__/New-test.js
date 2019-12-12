import { UsersNewContainer } from "../New";

describe("backend/containers/users/New", () => {
  def("root", () => (
    <UsersNewContainer history={fixtures.history()} />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

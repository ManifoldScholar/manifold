import Update from "../Update";

describe("global/components/sign-in-up/Update", () => {
  def("user", () => factory("user"));
  def("authentication", () =>
    fixtures.authentication({ user: $user })
  );
  def("root", () => <Update authentication={$authentication} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

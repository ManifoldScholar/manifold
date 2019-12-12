import CreateUpdate from "../CreateUpdate";

describe("global/components/sign-in-up/CreateUpdate", () => {
  def("user", () => factory("user"));
  def("authentication", () =>
    fixtures.authentication({ user: $user })
  );
  def("root", () => <CreateUpdate authentication={$authentication} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

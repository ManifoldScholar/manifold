import Avatar from "../";

describe("global/components/avatar/Avatar", () => {
  def("root", () => <Avatar url="some/url" />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

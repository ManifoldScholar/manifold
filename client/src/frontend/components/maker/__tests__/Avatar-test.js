import Avatar from "../Avatar";

describe("frontend/components/maker/Avatar", () => {
  def("maker", () => factory("maker"));
  def("root", () => <Avatar maker={$maker} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

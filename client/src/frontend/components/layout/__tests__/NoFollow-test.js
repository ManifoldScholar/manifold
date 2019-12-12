import NoFollow from "../NoFollow";

describe("frontend/components/layout/NoFollow", () => {
  def("root", () => <NoFollow />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});

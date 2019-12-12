import NotFound from "../";

describe("global/containers/NotFound/NotFound", () => {
  def("root", () => <NotFound />);
  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});

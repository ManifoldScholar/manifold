import Wrapper from "../Wrapper";

describe("global/components/drawer/Wrapper", () => {
  def("root", () => (
    <Wrapper
      open={true}
      style="backend"
      title="wrapper"
      closeCallback={jest.fn()}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

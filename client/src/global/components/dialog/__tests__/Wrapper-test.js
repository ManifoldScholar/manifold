import Wrapper from "../Wrapper";

describe("backend/components/dialog/Wrapper", () => {
  def("child", () => <div>a child node.</div>);
  def("root", () => (
    <Wrapper className="dialog-confirm" maxWidth={400} children={$child} />
  ));

  it("matches the snapshot", () => {
    expect(render($withApp($root))).toMatchSnapshot();
  });
});

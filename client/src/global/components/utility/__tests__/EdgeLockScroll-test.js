import EdgeLockScroll from "../EdgeLockScroll";

describe("global/components/utility/EdgeLockScroll", () => {
  def("children", () => <div>How is babby formed?</div>);
  def("root", () => <EdgeLockScroll children={$children} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

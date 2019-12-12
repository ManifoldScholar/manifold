import LockBodyScroll from "../LockBodyScroll";
import EdgeLockScroll from "../EdgeLockScroll";

describe("global/components/utility/LockBodyScroll", () => {
  def("children", () => <div>How is babby formed?</div>);
  def("root", () => <LockBodyScroll children={$children} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

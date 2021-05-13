import Overlay from "../";

describe("global/components/Overlay", () => {
  def("children", () => <div>Test me</div>);
  def("mock", () => jest.fn());
  def("root", () => <Overlay children={$children} closeCallback={$mock} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  it("should trigger closeCallback callback when close is clicked", () => {
    const wrapper = mount($root);
    $mock.mockClear();
    wrapper
      .find('.overlay-close')
      .first()
      .simulate("click");
    expect($mock).toHaveBeenCalled();
  });
});

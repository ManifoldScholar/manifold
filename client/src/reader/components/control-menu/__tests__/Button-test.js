import Button from "../Button";

describe("reader/components/control-menu/Button", () => {
  def("toggleMock", () => jest.fn());
  def("onClick", () => jest.fn());
  def("root", () => (
    <Button
      toggleMock={$toggleMock}
      onClick={$onClick}
      icon="notes24"
      label="Notes"
    />
  ));
  def("wrapper", () => mount($withApp($root)));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  // it("should trigger toggle callback when toggle is clicked", () => {
  //   $toggleMock.mockClear();
  //   $wrapper.find("button").simulate("click");
  //   expect($toggleMock).toHaveBeenCalled();
  // });
});

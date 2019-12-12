import Detail from "../Detail";

describe("reader/components/notation/resource/Detail", () => {
  def("resource", () => factory("resource"));
  def("closeMock", () => jest.fn());
  def("root", () => <Detail resource={$resource} handleClose={$closeMock} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

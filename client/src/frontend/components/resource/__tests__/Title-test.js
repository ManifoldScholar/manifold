import Title from "../Title";

describe("frontend/components/resource/Title", () => {
  def("resource", () => factory("resource"));
  def("root", () => <Title resource={$resource} showDate showIcon />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

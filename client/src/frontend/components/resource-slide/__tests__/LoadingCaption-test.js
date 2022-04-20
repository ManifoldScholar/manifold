import LoadingCaption from "../Caption/LoadingCaption";

describe("frontend/components/resource-slide/LoadingCaption", () => {
  def("root", () => <LoadingCaption />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

import Image from "../Types/Image";

describe("frontend/components/resource-preview/Image", () => {
  def("resource", () => factory("resource"));
  def("root", () => <Image resource={$resource} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

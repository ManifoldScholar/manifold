import Marker from "../Marker";

describe("reader/components/notation/Marker", () => {
  def("annotations", () => collectionFactory("annotation"));
  def("root", () => <Marker annotations={$annotations} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

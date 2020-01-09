import { NotationMarker } from "../Marker";

describe("reader/components/notation/Marker", () => {
  def("annotations", () => collectionFactory("annotation"));
  def("root", () => <NotationMarker annotations={$annotations} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});

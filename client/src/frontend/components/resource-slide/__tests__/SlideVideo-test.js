import SlideVideo from "../SlideVideo";

describe("frontend/components/resource-slide/SlideVideo", () => {
  def("resource", () =>
    factory("resource", {
      attributes: {
        kind: "video",
        subKind: "external_video",
        externalType: "youtube",
        externalId: "1VrAwK7FaOw"
      }
    })
  );
  def("root", () => <SlideVideo resource={$resource} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
